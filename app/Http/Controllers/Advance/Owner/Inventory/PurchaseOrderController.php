<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\PurchaseOrder;
use App\Models\Advance\Owner\Inventory\PurchaseOrderItem;
use App\Models\Advance\Owner\Inventory\Supplier;
use App\Models\Advance\Owner\Inventory\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 6;

        $purchaseOrders = PurchaseOrder::with('supplier')
            ->withCount('items')
            ->when($request->branch, function ($query) use ($request) {
                $query->where('branch', $request->branch);
            })
            ->when($request->date, function ($query) use ($request) {
                $query->whereDate('date', $request->date);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->search, function ($query) use ($request) {
                $query->where('po_number', 'like', '%' . $request->search . '%');
            })
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('advance/owner/inventory/inventory-po', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => Supplier::select('id', 'name')->get(),
            'inventoryItems' => Item::select('id', 'name', 'sku', 'price')->get(),
            'filters' => $request->only('branch', 'date', 'status', 'search', 'per_page'),
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
            'branch' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $totalPrice = 0;
            foreach ($validated['items'] as $item) {
                $totalPrice += $item['quantity'] * $item['price'];
            }

            $purchaseOrder = PurchaseOrder::create([
                'po_number' => PurchaseOrder::generatePoNumber(),
                'branch' => $validated['branch'],
                'supplier_id' => $validated['supplier_id'],
                'total_price' => $totalPrice,
                'date' => $validated['date'],
                'status' => 'waiting_fulfilment',
            ]);

            foreach ($validated['items'] as $item) {
                $purchaseOrder->items()->create($item);
            }
        });

        return redirect()->route('dashboard.inventory.purchase-orders.index')
            ->with('success', 'PO berhasil dibuat!');
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
        $validated = $request->validate([
            'status' => 'required|in:waiting_fulfilment,success,cancelled',
        ]);

        PurchaseOrder::findOrFail($id)->update($validated);

        return redirect()->route('dashboard.inventory.purchase-orders.index')
            ->with('success', 'Status PO berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        PurchaseOrder::findOrFail($id)->delete();

        return redirect()->route('dashboard.inventory.purchase-orders.index')
            ->with('success', 'PO berhasil dihapus!');
    }
}
