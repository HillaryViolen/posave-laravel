<?php

namespace App\Models\Advance\Owner\Inventory;

use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    //
    protected $fillable = [
        'transfer_number', 
        'sender_branch', 
        'receiver_branch', 
        'status', 
        'date',
    ];

    public function items()
    {
        return $this->hasMany(TransferItem::class, 'transfer_id');
    }

    public static function generateTransferNumber(): string
    {
        $last = static::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'KI-' . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
