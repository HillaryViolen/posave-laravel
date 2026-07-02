<?php

namespace App\Http\Controllers\Advance\Owner\Employee;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Employee\EmployeeAccess;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $accesses = EmployeeAccess::withCount('employees')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('advance/owner/employee/employee-access-list', [
            'accesses' => $accesses,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:employee_accesses,name',
        ]);

        EmployeeAccess::create($validated);

        return redirect()->route('dashboard.employees.access.index')->with('success', 'Kategori berhasil ditambahkan!');
    
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
            'name' => 'required|string|max:255|unique:employee_accesses,name,' . $id,
        ]);

        $access = EmployeeAccess::findOrFail($id);
        $oldName = $access->name;
        $access->update($validated);

        // sync nama role di tabel employees biar konsisten
        \App\Models\Advance\Owner\Employee::where('role', $oldName)->update(['role' => $validated['name']]);

        return redirect()->route('dashboard.employees.access.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $access = EmployeeAccess::findOrFail($id);
        $access->delete();

        return redirect()->route('dashboard.employees.access.index')->with('success', 'Kategori berhasil dihapus!');
    }
}
