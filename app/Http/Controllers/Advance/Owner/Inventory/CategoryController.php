<?php

namespace App\Http\Controllers\Advance\Owner\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Owner\Inventory\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::withCount('items')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('advance/owner/inventory/inventory-category', [
            'categories' => $categories,
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
            'name' => 'required|string|max:255|unique:inventory_categories,name'
        ]);

        Category::create($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil ditambahkan!');
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
            'name' => 'required|string|max:255|unique:inventory_categories,name,' . $id
        ]);

        Category::findOrFail($id)->update($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        Category::findOrFail($id)->delete();

        return redirect()->route('dashboard.inventory.categories.index')
            ->with('success', 'Kategori berhasil dihapus!');
    }
}
