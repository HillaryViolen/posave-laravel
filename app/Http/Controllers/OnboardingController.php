<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\Auth\CompanyProfile;
use App\Models\Auth\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $user = Auth::user();

        // 1. Bikin company
        $company = Company::create([
            'owner_id' => $user->id,
            'type'     => $request->type,
        ]);

        // 2. Bikin company profile
        CompanyProfile::create([
            'company_id' => $company->id,
            'name'       => $request->company_name,
        ]);

        // 3. Bikin branch utama
        $branch = Branch::create([
            'company_id' => $company->id,
            'name'       => $request->branch_name,
            'is_main'    => true,
        ]);

        // 4. Bikin user profile kosong
        UserProfile::create(['user_id' => $user->id]);

        // 5. Tautkan user ke company dan branch, set role owner
        $user->update([
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
            'role'       => 'owner',
        ]);

        return redirect()->route('dashboard.index');
    }
}
