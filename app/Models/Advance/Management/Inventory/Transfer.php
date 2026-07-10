<?php

namespace App\Models\Advance\Management\Inventory;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transfer extends Model
{
    protected $fillable = [
        'company_id',
        'transfer_number',
        'sender_branch_id',
        'receiver_branch_id',
        'status',
        'rejection_note',
        'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(TransferItem::class, 'transfer_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function senderBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'sender_branch_id');
    }

    public function receiverBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'receiver_branch_id');
    }
}
