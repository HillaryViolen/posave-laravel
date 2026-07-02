<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    //
    protected $fillable = [
        'po_number', 'branch', 'supplier_id', 'total_price', 'status', 'date',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id');
    }

    public static function generatePoNumber(): string
    {
        $last = static::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'PO-' . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
