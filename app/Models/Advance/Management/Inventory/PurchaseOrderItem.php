<?php

namespace App\Models\Advance\Management\Inventory;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    //
    protected $fillable = ['purchase_order_id', 'inventory_item_id', 'quantity', 'price'];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function inventoryItem()
    {
        return $this->belongsTo(Item::class);
    }
}
