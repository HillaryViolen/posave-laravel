<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\Item;
use App\Models\Advance\Owner\Inventory\Transfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 6;

        $transfers = Transfer::withCount('items')
            ->when($request->branch, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('sender_branch', $request->branch)
                      ->orWhere('receiver_branch', $request->branch);
                });
            })
            ->when($request->date, function ($query) use ($request) {
                $query->whereDate('date', $request->date);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->search, function ($query) use ($request) {
                $query->where('transfer_number', 'like', '%' . $request->search . '%');
            })
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('advance/owner/inventory/inventory-transfer-list', [
            'transfers' => $transfers,
            'inventoryItems' => Item::select('id', 'name', 'sku')->get(),
            'filters' => $request->only('branch', 'date', 'status', 'search', 'per_page'),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_branch' => 'required|string|max:255|different:receiver_branch',
            'receiver_branch' => 'required|string|max:255',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $transfer = Transfer::create([
                'transfer_number' => Transfer::generateTransferNumber(),
                'sender_branch' => $validated['sender_branch'],
                'receiver_branch' => $validated['receiver_branch'],
                'date' => $validated['date'],
                'status' => 'waiting',
            ]);

            foreach ($validated['items'] as $item) {
                $transfer->items()->create($item);
            }
        });

        return redirect()->route('dashboard.inventory.transfers.index')
            ->with('success', 'Kiriman berhasil dibuat!');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:waiting,success,cancelled',
        ]);

        Transfer::findOrFail($id)->update($validated);

        return redirect()->route('dashboard.inventory.transfers.index')
            ->with('success', 'Status kiriman berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        Transfer::findOrFail($id)->delete();

        return redirect()->route('dashboard.inventory.transfers.index')
            ->with('success', 'Kiriman berhasil dihapus!');
    }
}