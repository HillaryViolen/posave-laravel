<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Advance\Messaging\Conversation;
use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\Auth\CompanyProfile;
use App\Models\Auth\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->company_id) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('onboarding/onboarding-page');
    }

    public function setup(Request $request)
    {
        $request->validate([
            'type'         => 'required|in:lite,advance',
            'company_name' => 'required|string|max:255',
            'branch_name'  => 'required|string|max:255',
        ]);

        /** @var User $user */
        $user = Auth::user();

        // 1. Bikin company
        $company = Company::create([
            'owner_id' => $user->id,
            'type'     => $request->type,
        ]);

        CompanyProfile::create([
            'company_id' => $company->id,
            'name'       => $request->company_name,
        ]);

        $branch = Branch::create([
            'company_id' => $company->id,
            'name'       => $request->branch_name,
            'is_main'    => true,
        ]);

        UserProfile::create(['user_id' => $user->id]);

        $user->update([
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
            'role'       => 'owner',
        ]);

        $conversation = Conversation::create([
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
            'type'       => 'group',
            'name'       => $branch->name,
        ]);

        $conversation->members()->attach($user->id, ['last_read_at' => now()]);

        return redirect()->route('dashboard.index');
    }
}
