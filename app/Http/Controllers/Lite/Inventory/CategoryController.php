<?php

namespace App\Http\Controllers\Lite\Inventory;

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
        /** @var User $owner */
        $owner = Auth::user();

        $categories = Category::where('company_id', $owner->company_id)
            ->withCount('items')
            ->when($request->search, fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
            ->paginate((int) ($request->per_page ?? 6))
            ->withQueryString();

        return Inertia::render('lite/inventory/category-list', [
            'categories' => $categories,
            'filters' => $request->only('search', 'per_page'),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $owner */
        $owner = Auth::user();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')->where(fn($q) => $q->where('company_id', $owner->company_id)),
            ],
            'color' => 'nullable|string|max:20',
        ]);

        Category::create([
            'company_id' => $owner->company_id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#3d8ab8',
        ]);

        return redirect()->route('lite.inventory.categories.index')->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function update(Request $request, string $id)
    {
        /** @var User $owner */
        $owner = Auth::user();
        $category = Category::where('company_id', $owner->company_id)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inventory_categories', 'name')
                    ->where(fn($q) => $q->where('company_id', $owner->company_id))
                    ->ignore($category->id),
            ],
            'color' => 'nullable|string|max:20',
        ]);

        $category->update($validated);

        return redirect()->route('lite.inventory.categories.index')->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        /** @var User $owner */
        $owner = Auth::user();
        Category::where('company_id', $owner->company_id)->findOrFail($id)->delete();

        return redirect()->route('lite.inventory.categories.index')->with('success', 'Kategori berhasil dihapus!');
    }
}
