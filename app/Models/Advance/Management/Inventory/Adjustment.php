<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Auth\Branch;
use Illuminate\Database\Eloquent\Model;

class Adjustment extends Model
{
    //

    protected $table = 'inventory_adjustments';

    protected $fillable = [
        'inventory_item_id',
        'branch_id',
        'note',
        'qty_change',
        'financial_change',
        'date',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'inventory_item_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
