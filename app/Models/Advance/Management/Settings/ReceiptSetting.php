<?php

namespace App\Models\Advance\Management\Settings;

use App\Models\Auth\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceiptSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'logo',
        'address',
        'province',
        'city',
        'zip',
        'phone',
        'email',
        'notes',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
