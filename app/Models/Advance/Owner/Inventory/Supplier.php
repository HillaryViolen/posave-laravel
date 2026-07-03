<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    //
    protected $fillable = [
        'name', 
        'category_id', 
        'address', 
        'phone', 
        'email', 
        'logo'
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
