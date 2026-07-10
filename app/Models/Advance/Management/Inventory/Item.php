<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Advance\Transaction\TransactionItem;
use App\Models\Auth\Company;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'inventory_items';

    protected $fillable = [
        'company_id',
        'name',
        'sku',
        'category_id',
        'image',
        'price',
        'cost',
        'is_active',   // ← cost & is_active baru
    ];

    protected $casts = [
        'price'     => 'decimal:2',
        'cost'      => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function adjustments()
    {
        return $this->hasMany(Adjustment::class, 'inventory_item_id');
    }
    public function branchStocks()
    {
        return $this->hasMany(BranchStock::class, 'inventory_item_id');
    }

    public function transactionItems()   // ← relasi baru
    {
        return $this->hasMany(TransactionItem::class, 'item_id');
    }

    public static function generateSku(): string
    {
        $last = static::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;
        return 'BRG-' . str_pad($next, 5, '0', STR_PAD_LEFT);
    }
}
