<?php

namespace App\Models\Advance\Transaction;

use App\Models\Advance\Management\Inventory\Item;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'item_id',
        'product_name',
        'category_name',
        'qty',
        'unit_price',
        'unit_cost',
        'discount_amount',
        'subtotal',
        'note'
    ];

    protected $casts = [
        'qty'              => 'integer',
        'unit_price'       => 'decimal:2',
        'unit_cost'        => 'decimal:2',
        'discount_amount'  => 'decimal:2',
        'subtotal'         => 'decimal:2',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
