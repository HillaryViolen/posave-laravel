<?php

namespace App\Http\Controllers\Advance\Management;

use App\Http\Controllers\Controller;
use App\Models\Advance\Transaction\Transaction;
use App\Models\Advance\Transaction\TransactionItem;
use App\Models\Auth\Branch;
use App\Models\User;
use App\Support\SalesFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        // Semua branch milik company ini — jadi batas wajib biar data company lain
        // gak ikut kebaca walau user gak pilih outlet/cabang spesifik.
        $companyBranchIds = Branch::where('company_id', $owner->company_id)->pluck('id');

        $filter = SalesFilter::fromRequest($request);
        if ($owner->isBranchManager()) {
            $filter = new SalesFilter($owner->branch_id, $filter->start, $filter->end, $filter->preset);
        }
        [$prevStart, $prevEnd] = $filter->previousPeriod();

        $current = $this->statement($companyBranchIds, $filter->outletId, $filter->start, $filter->end);
        $previous = $this->statement($companyBranchIds, $filter->outletId, $prevStart, $prevEnd);

        $itemBase = TransactionItem::query()
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->where('transactions.status', '!=', 'void')
            ->whereIn('transactions.branch_id', $companyBranchIds)
            ->when($filter->outletId, fn($q) => $q->where('transactions.branch_id', $filter->outletId))
            ->whereBetween('transactions.transacted_at', [$filter->start, $filter->end]);

        return Inertia::render('advance/management/report/report', [
            'filters' => $filter->toArray(),
            'outlets' => $owner->isBranchManager()
                ? Branch::where('id', $owner->branch_id)->get(['id', 'name'])
                : Branch::where('company_id', $owner->company_id)->orderBy('name')->get(['id', 'name']),
            'statement' => [
                'current' => $current,
                'previous' => $previous,
            ],
            'productSales' => $this->productSales($itemBase),
            'categorySales' => $this->categorySales($itemBase),
        ]);
    }

    private function statement($companyBranchIds, ?int $branchId, $start, $end): array
    {
        $s = Transaction::query()
            ->revenue()
            ->whereIn('branch_id', $companyBranchIds)
            ->forBranch($branchId)
            ->withinPeriod($start, $end)
            ->selectRaw(implode(', ', [
                'COALESCE(SUM(gross_amount), 0) as gross',
                'COALESCE(SUM(discount_amount), 0) as discount',
                'COALESCE(SUM(refund_amount), 0) as refund',
                'COALESCE(SUM(tax_amount), 0) as tax',
                'COALESCE(SUM(gratuity_amount), 0) as gratuity',
                'COALESCE(SUM(rounding_amount), 0) as rounding',
                'COALESCE(SUM(cogs_amount), 0) as cogs',
                'COALESCE(SUM(total_amount), 0) as total',
            ]))
            ->first();

        $gross = (float) $s->gross;
        $discount = (float) $s->discount;
        $refund = (float) $s->refund;
        $nett = $gross - $discount - $refund;
        $cogs = (float) $s->cogs;

        return [
            'grossSales' => $gross,
            'discounts' => $discount,
            'refunds' => $refund,
            'nettSales' => $nett,
            'gratuity' => (float) $s->gratuity,
            'tax' => (float) $s->tax,
            'rounding' => (float) $s->rounding,
            'totalCollected' => (float) $s->total,
            'cogs' => $cogs,
            'grossProfit' => $nett - $cogs,
            'margin' => $nett > 0 ? round(($nett - $cogs) / $nett * 100, 1) : 0,
        ];
    }

    private function productSales($itemBase): array
    {
        return (clone $itemBase)
            ->selectRaw(implode(', ', [
                'transaction_items.product_name as name',
                'transaction_items.category_name as category',
                'SUM(transaction_items.qty) as qty',
                'SUM(transaction_items.subtotal) as omzet',
                'SUM(transaction_items.qty * transaction_items.unit_cost) as hpp',
            ]))
            ->groupBy('transaction_items.product_name', 'transaction_items.category_name')
            ->orderByDesc('omzet')
            ->get()
            ->map(function ($row) {
                $omzet = (float) $row->omzet;
                $hpp = (float) $row->hpp;

                return [
                    'name' => $row->name,
                    'category' => $row->category ?? 'Lainnya',
                    'qty' => (int) $row->qty,
                    'omzet' => $omzet,
                    'hpp' => $hpp,
                    'margin' => $omzet - $hpp,
                    'marginPct' => $omzet > 0 ? round(($omzet - $hpp) / $omzet * 100, 1) : 0,
                ];
            })
            ->all();
    }

    private function categorySales($itemBase): array
    {
        return (clone $itemBase)
            ->selectRaw(implode(', ', [
                'transaction_items.category_name as name',
                'SUM(transaction_items.qty) as qty',
                'SUM(transaction_items.subtotal) as omzet',
                'SUM(transaction_items.qty * transaction_items.unit_cost) as hpp',
            ]))
            ->groupBy('transaction_items.category_name')
            ->orderByDesc('omzet')
            ->get()
            ->map(function ($row) {
                $omzet = (float) $row->omzet;
                $hpp = (float) $row->hpp;

                return [
                    'name' => $row->name ?? 'Lainnya',
                    'qty' => (int) $row->qty,
                    'omzet' => $omzet,
                    'hpp' => $hpp,
                    'margin' => $omzet - $hpp,
                    'marginPct' => $omzet > 0 ? round(($omzet - $hpp) / $omzet * 100, 1) : 0,
                ];
            })
            ->all();
    }
}
