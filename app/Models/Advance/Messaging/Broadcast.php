<?php

namespace App\Models\Advance\Messaging;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Broadcast extends Model
{
    use HasFactory;

    protected $fillable = ['company_id', 'branch_id', 'user_id', 'content'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function isCompanyWide(): bool
    {
        return is_null($this->branch_id);
    }
}
