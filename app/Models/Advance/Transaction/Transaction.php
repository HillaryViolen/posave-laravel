<?php

namespace App\Models\Advance\Transaction;

use App\Models\Advance\Transaction\TransactionItem;
use App\Models\Auth\Branch;
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
        'branch_id',
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
        'cash_received',
        'change_returned',
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
        'cash_received' => 'decimal:2',
        'change_returned' => 'decimal:2',
        'transacted_at' => 'datetime',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function scopeRevenue(Builder $query): Builder
    {
        return $query->where('status', '!=', 'void');
    }

    public function scopeForBranch(Builder $query, ?int $branchId): Builder
    {
        return $query->when($branchId, fn(Builder $q) => $q->where('branch_id', $branchId));
    }

    public function scopeWithinPeriod(Builder $query, $start, $end): Builder
    {
        return $query->whereBetween('transacted_at', [$start, $end]);
    }
}
