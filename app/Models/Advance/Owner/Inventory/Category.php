<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    protected $table = 'inventory_categories';

    protected $fillable = ['name'];

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}
