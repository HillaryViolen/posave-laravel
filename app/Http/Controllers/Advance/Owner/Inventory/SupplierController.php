<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\Supplier;
use App\Models\Advance\Owner\Inventory\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 6;

        $suppliers = Supplier::with('category')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->when($request->category_id, function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->paginate($perPage)
            ->withQueryString();

        $categories = Category::select('id', 'name')->get();

        return Inertia::render('advance/owner/inventory/inventory-supplier', [
            'suppliers' => $suppliers,
            'categories' => $categories,
            'filters' => $request->only('search', 'category_id', 'per_page'),
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
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:inventory_categories,id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        Supplier::create($validated);

        return redirect()->route('dashboard.inventory.suppliers.index')
            ->with('success', 'Pemasok berhasil ditambahkan!');
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
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        $supplier->update($validated);

        return redirect()->route('dashboard.inventory.suppliers.index')
            ->with('success', 'Pemasok berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        Supplier::findOrFail($id)->delete();

        return redirect()->route('dashboard.inventory.suppliers.index')
            ->with('success', 'Pemasok berhasil dihapus!');
    }
}
