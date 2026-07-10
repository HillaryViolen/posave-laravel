<?php

namespace App\Http\Controllers\Advance\Management\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $categories = Category::where('company_id', $user->company_id)
            ->withCount('items')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('advance/management/inventory/inventory-category', [
            'categories' => $categories,
            'filters' => $request->only('search'),
            'can_manage_catalog' => $user->isOwner(),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')->where(fn($q) => $q->where('company_id', $user->company_id)),
            ],
        ]);

        $validated['company_id'] = $user->company_id;

        Category::create($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        $category = Category::where('company_id', $user->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')
                    ->where(fn($q) => $q->where('company_id', $user->company_id))
                    ->ignore($category->id),
            ],
        ]);

        $category->update($validated);

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();
        abort_if(!$user->isOwner(), 403);

        Category::where('company_id', $user->company_id)->findOrFail($id)->delete();

        return redirect()->route('dashboard.inventory.categories.index')->with('success', 'Kategori berhasil dihapus!');
    }
}
