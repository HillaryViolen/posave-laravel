<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Auth\Branch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BranchStock extends Model
{
    protected $fillable = ['branch_id', 'inventory_item_id', 'current_stock', 'min_stock'];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'inventory_item_id');
    }
}
