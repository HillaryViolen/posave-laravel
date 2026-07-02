<?php

namespace App\Models\Sales;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'outlet_id',
        'user_id',
        'invoice_no',
        'status',
        'payment_method',
        'gross_amount',
        'discount_amount',
        'refund_amount',
        'tax_amount',
        'gratuity_amount',
        'rounding_amount',
        'cogs_amount',
        'total_amount',
        'transacted_at',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'gratuity_amount' => 'decimal:2',
        'rounding_amount' => 'decimal:2',
        'cogs_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'transacted_at' => 'datetime',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    /** Hanya transaksi yang menghasilkan omzet (bukan void). */
    public function scopeRevenue(Builder $query): Builder
    {
        return $query->where('status', '!=', 'void');
    }

    /** Filter berdasarkan outlet; abaikan jika null (semua outlet). */
    public function scopeForOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->when($outletId, fn (Builder $q) => $q->where('outlet_id', $outletId));
    }

    /** Filter rentang tanggal berdasarkan waktu transaksi. */
    public function scopeWithinPeriod(Builder $query, $start, $end): Builder
    {
        return $query->whereBetween('transacted_at', [$start, $end]);
    }
}
