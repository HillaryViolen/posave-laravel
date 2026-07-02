<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class Adjustment extends Model
{
    //

    protected $table = 'inventory_adjustments';
    
    protected $fillable = [
        'inventory_item_id', 'branch', 'note', 'qty_change', 'financial_change', 'date',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'inventory_item_id');
    }
}
