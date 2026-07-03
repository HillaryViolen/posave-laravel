<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureCashierAccess
{
    public function handle(Request $request, Closure $next)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) {
            abort(403);
        }

        $isCashier   = $user->role === 'cashier';
        $isLiteOwner = $user->role === 'owner' && $user->company?->type === 'lite';

        if (!$isCashier && !$isLiteOwner) {
            abort(403, 'Akses tidak diizinkan.');
        }

        return $next($request);
    }
}
