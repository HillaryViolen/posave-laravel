<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Category;
use App\Models\User;

class GetCategoriesTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_categories';
  }

  public function description(): string
  {
    return 'Ambil daftar kategori barang yang sudah ada di sistem. Gunakan ini kalau user nanya kategori apa saja yang tersedia.';
  }

  public function parameters(): array
  {
    return ['type' => 'object', 'properties' => new \stdClass(), 'required' => []];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    return true;
  }

  public function execute(User $user, array $args): array
  {
    $categories = Category::where('company_id', $user->company_id)->pluck('name');

    return ['categories' => $categories->values()->all(), 'count' => $categories->count()];
  }

  public function summarize(User $user, array $args): array
  {
    return [];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    return [];
  }
}
