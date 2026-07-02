<?php

namespace App\Http\Controllers\Advance\Owner;

use App\Http\Controllers\Controller;
use App\Models\Sales\Category;
use App\Models\Sales\Outlet;
use App\Models\Sales\Transaction;
use App\Models\Sales\TransactionItem;
use App\Support\SalesFilter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $filter = SalesFilter::fromRequest($request);
        [$prevStart, $prevEnd] = $filter->previousPeriod();

        $current = $this->metricsFor($filter->outletId, $filter->start, $filter->end);
        $previous = $this->metricsFor($filter->outletId, $prevStart, $prevEnd);

        $base = Transaction::query()
            ->revenue()
            ->forOutlet($filter->outletId)
            ->withinPeriod($filter->start, $filter->end);

        $itemBase = $this->itemBase($filter->outletId, $filter->start, $filter->end);

        return Inertia::render('advance/owner/dashboard/dashboard', [
            'filters' => $filter->toArray(),
            'outlets' => Outlet::orderBy('name')->get(['id', 'name']),
            'kpis' => [
                'totalSales' => $this->kpi($current['totalSales'], $previous['totalSales']),
                'totalTransactions' => $this->kpi($current['totalTransactions'], $previous['totalTransactions']),
                'productsSold' => $this->kpi($current['productsSold'], $previous['productsSold']),
                'averageSale' => $this->kpi($current['averageSale'], $previous['averageSale']),
                'grossProfit' => $this->kpi($current['grossProfit'], $previous['grossProfit']),
                'margin' => $this->kpi($current['margin'], $previous['margin']),
            ],
            'salesTrend' => $this->salesTrend($filter, $prevStart, $prevEnd),
            'hourlySales' => $this->hourlySales($base),
            'paymentBreakdown' => $this->paymentBreakdown($base),
            'categorySummary' => $this->categorySummary($itemBase),
            'topProducts' => $this->topProducts($itemBase),
            'recentTransactions' => $this->recentTransactions($base),
        ]);
    }

    /** Query item yang sudah di-join + difilter ke periode/outlet. */
    private function itemBase(?int $outletId, $start, $end)
    {
        return TransactionItem::query()
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->where('transactions.status', '!=', 'void')
            ->when($outletId, fn ($q) => $q->where('transactions.outlet_id', $outletId))
            ->whereBetween('transactions.transacted_at', [$start, $end]);
    }

    /** Metrik agregat satu periode. */
    private function metricsFor(?int $outletId, $start, $end): array
    {
        $t = Transaction::query()
            ->revenue()
            ->forOutlet($outletId)
            ->withinPeriod($start, $end)
            ->selectRaw(implode(', ', [
                'COUNT(*) as trx',
                'COALESCE(SUM(total_amount), 0) as total',
                'COALESCE(SUM(cogs_amount), 0) as cogs',
                'COALESCE(SUM(gross_amount - discount_amount - refund_amount), 0) as nett',
            ]))
            ->first();

        $qty = (int) $this->itemBase($outletId, $start, $end)->sum('transaction_items.qty');

        $total = (float) $t->total;
        $trx = (int) $t->trx;
        $nett = (float) $t->nett;
        $profit = $nett - (float) $t->cogs;

        return [
            'totalSales' => $total,
            'totalTransactions' => $trx,
            'productsSold' => $qty,
            'averageSale' => $trx > 0 ? round($total / $trx) : 0,
            'grossProfit' => $profit,
            'margin' => $nett > 0 ? round($profit / $nett * 100, 1) : 0,
        ];
    }

    /** Bungkus nilai + persentase perubahan vs periode sebelumnya. */
    private function kpi(float|int $value, float|int $previous): array
    {
        if ($previous == 0) {
            $delta = $value > 0 ? 100.0 : 0.0;
        } else {
            $delta = round((($value - $previous) / abs($previous)) * 100, 1);
        }

        return [
            'value' => $value,
            'previous' => $previous,
            'deltaPct' => $delta,
        ];
    }

    /** Tren harian: periode ini + periode sebelumnya (sejajar per indeks hari). */
    private function salesTrend(SalesFilter $filter, $prevStart, $prevEnd): array
    {
        $cur = Transaction::query()->revenue()->forOutlet($filter->outletId)
            ->withinPeriod($filter->start, $filter->end)
            ->selectRaw('DATE(transacted_at) as d, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('d')->get()->keyBy('d');

        $prev = Transaction::query()->revenue()->forOutlet($filter->outletId)
            ->withinPeriod($prevStart, $prevEnd)
            ->selectRaw('DATE(transacted_at) as d, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('d')->get()->keyBy('d');

        $curDays = $this->dateKeys($filter->start, $filter->end);
        $prevDays = $this->dateKeys(Carbon::parse($prevStart), Carbon::parse($prevEnd));

        $series = [];
        foreach ($curDays as $i => $date) {
            $prevDate = $prevDays[$i] ?? null;
            $series[] = [
                'date' => $date,
                'label' => Carbon::parse($date)->translatedFormat('d M'),
                'total' => (float) ($cur[$date]->total ?? 0),
                'count' => (int) ($cur[$date]->cnt ?? 0),
                'prevTotal' => (float) ($prevDate ? ($prev[$prevDate]->total ?? 0) : 0),
                'prevCount' => (int) ($prevDate ? ($prev[$prevDate]->cnt ?? 0) : 0),
            ];
        }

        return $series;
    }

    /** Penjualan per jam (0–23) untuk melihat jam ramai. */
    private function hourlySales($base): array
    {
        $byHour = (clone $base)
            ->selectRaw('HOUR(transacted_at) as h, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('h')->get()->keyBy('h');

        $hours = [];
        for ($h = 0; $h < 24; $h++) {
            $hours[] = [
                'hour' => sprintf('%02d', $h),
                'total' => (float) ($byHour[$h]->total ?? 0),
                'count' => (int) ($byHour[$h]->cnt ?? 0),
            ];
        }

        return $hours;
    }

    /** Komposisi metode pembayaran. */
    private function paymentBreakdown($base): array
    {
        $meta = [
            'cash' => ['label' => 'Tunai', 'color' => '#16a34a'],
            'qris' => ['label' => 'QRIS', 'color' => '#3d8ab8'],
            'debit' => ['label' => 'Kartu Debit', 'color' => '#9f6fd5'],
            'transfer' => ['label' => 'Transfer', 'color' => '#e75f1a'],
        ];

        $rows = (clone $base)
            ->selectRaw('payment_method, SUM(total_amount) as total, COUNT(*) as cnt')
            ->groupBy('payment_method')->get()->keyBy('payment_method');

        return collect($meta)->map(fn ($m, $key) => [
            'method' => $key,
            'label' => $m['label'],
            'color' => $m['color'],
            'total' => (float) ($rows[$key]->total ?? 0),
            'count' => (int) ($rows[$key]->cnt ?? 0),
        ])->values()->all();
    }

    private function categorySummary($itemBase): array
    {
        $colors = Category::pluck('color', 'name');

        return (clone $itemBase)
            ->selectRaw('transaction_items.category_name as name, SUM(transaction_items.subtotal) as omzet')
            ->groupBy('transaction_items.category_name')
            ->orderByDesc('omzet')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name ?? 'Lainnya',
                'omzet' => (float) $row->omzet,
                'color' => $colors[$row->name] ?? '#94a3b8',
            ])
            ->all();
    }

    private function topProducts($itemBase): array
    {
        return (clone $itemBase)
            ->selectRaw('transaction_items.product_name as name, SUM(transaction_items.qty) as qty, SUM(transaction_items.subtotal) as omzet')
            ->groupBy('transaction_items.product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name,
                'qty' => (int) $row->qty,
                'omzet' => (float) $row->omzet,
            ])
            ->all();
    }

    private function recentTransactions($base): array
    {
        return (clone $base)
            ->latest('transacted_at')
            ->limit(6)
            ->get(['invoice_no', 'total_amount', 'status', 'payment_method', 'transacted_at'])
            ->map(fn (Transaction $t) => [
                'invoice' => $t->invoice_no,
                'total' => (float) $t->total_amount,
                'status' => $t->status,
                'payment' => $t->payment_method,
                'time' => Carbon::parse($t->transacted_at)->translatedFormat('d M Y, H:i'),
            ])
            ->all();
    }

    /** @return string[] daftar tanggal (Y-m-d) dari start..end inklusif. */
    private function dateKeys(Carbon $start, Carbon $end): array
    {
        $keys = [];
        for ($day = $start->copy()->startOfDay(); $day->lte($end); $day->addDay()) {
            $keys[] = $day->toDateString();
        }

        return $keys;
    }
}
