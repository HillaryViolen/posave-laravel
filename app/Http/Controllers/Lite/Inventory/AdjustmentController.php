<?php

namespace App\Http\Controllers\Lite\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdjustmentController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        $adjustments = Adjustment::with('item')
            ->where('branch_id', $owner->branch_id)
            ->whereHas('item', fn($q) => $q->where('company_id', $owner->company_id))
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('item', fn($qq) => $qq->where('name', 'like', '%' . $request->search . '%'));
            })
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(8)
            ->withQueryString();

        $adjustments->getCollection()->transform(fn($a) => [
            'id' => $a->id,
            'item_name' => $a->item->name,
            'note' => $a->note,
            'qty_change' => $a->qty_change,
            'date' => $a->date,
        ]);

        $items = Item::where('company_id', $owner->company_id)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('lite/inventory/adjustment-list', [
            'adjustments' => $adjustments,
            'items' => $items,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'qty_change' => 'required|integer|not_in:0',
            'note' => 'required|string|max:255',
        ]);

        $item = Item::where('company_id', $owner->company_id)->findOrFail($validated['inventory_item_id']);

        DB::transaction(function () use ($validated, $owner, $item) {
            $stock = BranchStock::firstOrCreate(
                ['branch_id' => $owner->branch_id, 'inventory_item_id' => $item->id],
                ['current_stock' => 0, 'min_stock' => 0],
            );

            $stock->update(['current_stock' => max(0, $stock->current_stock + $validated['qty_change'])]);

            Adjustment::create([
                'inventory_item_id' => $item->id,
                'branch_id' => $owner->branch_id,
                'note' => $validated['note'],
                'qty_change' => $validated['qty_change'],
                'financial_change' => $validated['qty_change'] * (float) $item->cost,
                'date' => now()->toDateString(),
            ]);
        });

        return redirect()->route('lite.inventory.adjustments.index')->with('success', 'Perubahan stok berhasil dicatat!');
    }
}
