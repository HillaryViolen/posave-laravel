<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    protected $fillable = ['email', 'code', 'expires_at', 'is_used', 'attempts'];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_used'    => 'boolean',
        'attempts'   => 'integer',
    ];

    // Scope: cari OTP yang masih bisa dipakai (belum expired, belum dipakai, attempts < 3)
    public function scopeActive(Builder $query, string $email): Builder
    {
        return $query->where('email', $email)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->where('attempts', '<', 3);
    }
}
