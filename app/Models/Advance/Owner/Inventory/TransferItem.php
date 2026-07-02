<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class TransferItem extends Model
{
    //
    protected $fillable = ['transfer_id', 'inventory_item_id', 'quantity'];

    public function transfer()
    {
        return $this->belongsTo(Transfer::class);
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
