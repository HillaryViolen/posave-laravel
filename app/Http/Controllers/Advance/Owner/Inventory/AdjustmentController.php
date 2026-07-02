<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\Adjustment;
use App\Models\Advance\Owner\Inventory\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdjustmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $date = $request->date ?? now()->toDateString();

        $adjustments = Adjustment::with('item')
            ->whereDate('date', $date)
            ->when($request->branch, function ($query) use ($request) {
                $query->where('branch', $request->branch);
            })
            ->when($request->search, function ($query) use ($request) {
                $query->whereHas('item', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->status, function ($query) use ($request) {
                if ($request->status === 'in') {
                    $query->where('qty_change', '>', 0);
                } elseif ($request->status === 'out') {
                    $query->where('qty_change', '<', 0);
                }
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        $stats = [
            'total_changes' => Adjustment::whereDate('date', $date)->count(),
            'items_changed' => Adjustment::whereDate('date', $date)->distinct('inventory_item_id')->count('inventory_item_id'),
            'total_income' => Adjustment::whereDate('date', $date)->where('financial_change', '>', 0)->sum('financial_change'),
            'total_expense' => Adjustment::whereDate('date', $date)->where('financial_change', '<', 0)->sum('financial_change'),
        ];

        $inventoryItems = Item::select('id', 'name', 'sku', 'price')->get();

        return Inertia::render('advance/owner/inventory/inventory-adjustment', [
            'adjustments' => $adjustments,
            'stats' => $stats,
            'inventoryItems' => $inventoryItems,
            'filters' => $request->only('date', 'search', 'branch', 'status'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'branch' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'date' => 'required|date',
        ]);

        $item = Item::findOrFail($validated['inventory_item_id']);

        $qtyChange = $validated['type'] === 'in'
            ? $validated['quantity']
            : -$validated['quantity'];

        $financialChange = $qtyChange * $item->price;

        $item->increment('current_stock', $qtyChange);

        Adjustment::create([
            'inventory_item_id' => $validated['inventory_item_id'],
            'branch' => $validated['branch'],
            'note' => $validated['note'] ?? null,
            'qty_change' => $qtyChange,
            'financial_change' => $financialChange,
            'date' => $validated['date'],
        ]);

        return redirect()->route('dashboard.inventory.adjustments.index')
            ->with('success', 'Perubahan stok berhasil dicatat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $adjustment = Adjustment::with('item')->findOrFail($id);

        $adjustment->item->decrement('current_stock', $adjustment->qty_change);

        $adjustment->delete();

        return redirect()->route('dashboard.inventory.adjustments.index')
            ->with('success', 'Riwayat perubahan berhasil dihapus!');
        }
}
