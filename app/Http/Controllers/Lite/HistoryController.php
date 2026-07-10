<?php

namespace App\Http\Controllers\Lite;

use App\Http\Controllers\Controller;
use App\Models\Advance\Transaction\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $date = $request->filled('date')
            ? Carbon::parse($request->input('date'))->startOfDay()
            : Carbon::today();

        $transactions = Transaction::with('items')
            ->where('branch_id', $user->branch_id)
            ->whereBetween('transacted_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
            ->when($request->payment_method && $request->payment_method !== 'all', function ($query) use ($request) {
                $query->where('payment_method', $request->payment_method);
            })
            ->orderByDesc('transacted_at')
            ->get()
            ->map(fn(Transaction $t) => [
                'id' => $t->id,
                'invoice' => $t->invoice_no,
                'time' => $t->transacted_at->format('H:i'),
                'date' => $t->transacted_at->translatedFormat('d F Y'),
                'paymentMethod' => $t->payment_method,
                'total' => (float) $t->total_amount,
                'status' => $t->status,
                'items' => $t->items->map(fn($i) => [
                    'name' => $i->product_name,
                    'price' => (float) $i->unit_price,
                    'qty' => $i->qty,
                ]),
            ]);

        return Inertia::render('lite/order/history', [
            'transactions' => $transactions,
            'filters' => ['date' => $date->toDateString(), 'payment_method' => $request->payment_method ?? 'all'],
        ]);
    }
}
