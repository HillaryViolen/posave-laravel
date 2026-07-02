<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureLiteMode
{
    public function handle(Request $request, Closure $next)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user || !$user->company || $user->company->type !== 'lite') {
            abort(403, 'Fitur ini hanya tersedia untuk mode Lite.');
        }

        return $next($request);
    }
}
