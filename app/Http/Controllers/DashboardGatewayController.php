<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Advance\Owner\DashboardController as AdvanceOwnerDashboardController;
use App\Http\Controllers\Lite\DashboardController as LiteOwnerDashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardGatewayController extends Controller
{
    public function __invoke(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role === 'cashier') {
            return redirect()->route('cashier.order.index');
        }

        if ($user->isLite()) {
            return app()->call([app(LiteOwnerDashboardController::class), 'index']);
        }

        if ($user->role === 'branch_manager') {
            return app()->call([app(AdvanceOwnerDashboardController::class), 'index']);
        }
        return app()->call([app(AdvanceOwnerDashboardController::class), 'index']);
    }
}
