<?php

namespace App\Http\Controllers\Advance\Owner\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advance\Owner\Employee\Employee;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $employees = Employee::when($request->branch && $request->branch !== 'all', function ($query) use ($request) {
                    $query->where('branch', $request->branch);
                })
                ->paginate(5)
                ->withQueryString();

        $branches = Employee::select('branch')->distinct()->pluck('branch');

        return Inertia::render('advance/owner/employee/employee-list', [
            'employees' => $employees,
            'branches' => $branches,
            'filters' => $request->only('branch'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $roles = \App\Models\Advance\Owner\Employee\EmployeeAccess::pluck('name');

        return Inertia::render('advance/owner/employee/employee-create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'branch' => 'required|string|max:255',
            'active_date' => 'required|date',
            'slot_status' => 'required|string'
        ]);

        Employee::create($validated);

        return redirect()->route('dashboard.employees.index')->with('success', 'Data berhasil disimpan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'branch' => 'required|string|max:255',
            'active_date' => 'required|date',
            'slot_status' => 'required|string'
        ]);

        $employee = Employee::findOrFail($id);
        $employee->update($validated);

        return redirect()->route('dashboard.employees.index')->with('success', 'Data berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return redirect()->route('dashboard.employees.index')->with('success', 'Data berhasil dihapus!');
    }
}
