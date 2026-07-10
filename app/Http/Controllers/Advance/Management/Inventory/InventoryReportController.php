<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Transfer;
use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Advance\Management\Inventory\PurchaseOrder;
use App\Models\Advance\Management\Inventory\Item;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class InventoryReportController extends Controller
{
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:transfers,adjustments,purchase_orders,items,all',
            'format' => 'required|in:pdf,excel',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->getData($validated);

        $filename = 'laporan-' . $validated['type'] . '-' . now()->format('Ymd-His');

        if ($validated['format'] === 'pdf') {
            $pdf = Pdf::loadView('reports.inventory', [
                'type' => $validated['type'],
                'data' => $data,
                'from' => $validated['from_date'] ?? null,
                'to' => $validated['to_date'] ?? null,
            ]);

            return $pdf->download($filename . '.pdf');
        }

        return Excel::download(
            new \App\Exports\InventoryReportExport($data, $validated['type']),
            $filename . '.xlsx'
        );
    }

    private function getData(array $filters)
    {
        /** @var User $user */
        $user = Auth::user();

        $from = $filters['from_date'] ?? null;
        $to = $filters['to_date'] ?? null;
        $branchId = $filters['branch_id'] ?? null;

        if ($user->isBranchManager()) {
            $branchId = $user->branch_id;
        }

        return match ($filters['type']) {
            'transfers' => Transfer::with(['senderBranch', 'receiverBranch'])
                ->withCount('items')
                ->where('company_id', $user->company_id)
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branchId, fn($q) => $q->where(function ($qq) use ($branchId) {
                    $qq->where('sender_branch_id', $branchId)->orWhere('receiver_branch_id', $branchId);
                }))
                ->get(),

            'adjustments' => Adjustment::with(['item', 'branch'])
                ->whereHas('item', fn($q) => $q->where('company_id', $user->company_id))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                ->get(),

            'purchase_orders' => PurchaseOrder::with(['supplier', 'branch'])
                ->where('company_id', $user->company_id)
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                ->get(),

            'items' => Item::with('category')
                ->where('company_id', $user->company_id)
                ->get(),

            'all' => [
                'transfers' => Transfer::with(['senderBranch', 'receiverBranch'])->withCount('items')
                    ->where('company_id', $user->company_id)
                    ->when($branchId, fn($q) => $q->where(function ($qq) use ($branchId) {
                        $qq->where('sender_branch_id', $branchId)->orWhere('receiver_branch_id', $branchId);
                    }))
                    ->get(),
                'adjustments' => Adjustment::with(['item', 'branch'])
                    ->whereHas('item', fn($q) => $q->where('company_id', $user->company_id))
                    ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                    ->get(),
                'purchase_orders' => PurchaseOrder::with(['supplier', 'branch'])
                    ->where('company_id', $user->company_id)
                    ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                    ->get(),
                'items' => Item::with('category')->where('company_id', $user->company_id)->get(),
            ],

            default => collect(),
        };
    }
}
