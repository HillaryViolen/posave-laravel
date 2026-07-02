<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //
    protected $table = 'inventory_items';
    
    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'image',
        'min_stock',
        'current_stock',
        'price',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function adjustments()
    {
        return $this->hasMany(Adjustment::class, 'inventory_item_id');
    }

    public static function generateSku(): string
    {
        $last = static::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'BRG-' . str_pad($next, 5, '0', STR_PAD_LEFT);
    }
}
