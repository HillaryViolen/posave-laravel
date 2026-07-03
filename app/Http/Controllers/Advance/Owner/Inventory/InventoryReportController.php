<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\Transfer;
use App\Models\Advance\Owner\Inventory\Adjustment;
use App\Models\Advance\Owner\Inventory\PurchaseOrder;
use App\Models\Advance\Owner\Inventory\Item;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
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
            'branch' => 'nullable|string',
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
        $from = $filters['from_date'] ?? null;
        $to = $filters['to_date'] ?? null;
        $branch = $filters['branch'] ?? null;

        return match ($filters['type']) {
            'transfers' => Transfer::withCount('items')
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branch, fn($q) => $q->where('sender_branch', $branch)->orWhere('receiver_branch', $branch))
                ->get(),

            'adjustments' => Adjustment::with('item')
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branch, fn($q) => $q->where('branch', $branch))
                ->get(),

            'purchase_orders' => PurchaseOrder::with('supplier')
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->when($branch, fn($q) => $q->where('branch', $branch))
                ->get(),

            'items' => Item::with('category')->get(),

            'all' => [
                'transfers' => Transfer::withCount('items')->get(),
                'adjustments' => Adjustment::with('item')->get(),
                'purchase_orders' => PurchaseOrder::with('supplier')->get(),
                'items' => Item::with('category')->get(),
            ],

            default => collect(),
        };
    }
}   