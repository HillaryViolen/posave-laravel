<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Management\Inventory\Item;
use App\Models\User;

class GetInventorySummaryTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_inventory_summary';
  }

  public function description(): string
  {
    return 'Ambil ringkasan stok barang: jumlah barang habis, jumlah barang mau habis, dan daftar barangnya. Gunakan ini kalau user nanya soal stok/inventory.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => new \stdClass(), // gak butuh parameter dari user sama sekali
      'required' => [],
    ];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    return true; // semua role boleh nanya stok
  }

  public function execute(User $user, array $args): array
  {
    // Scoping SELALU dari user yang login, gak pernah dari $args.
    $branchId = $user->branch_id;
    $companyId = $user->company_id;

    $items = Item::where('company_id', $companyId)
      ->with(['branchStocks' => fn($q) => $q->where('branch_id', $branchId)])
      ->get();

    $outOfStock = [];
    $lowStock = [];

    foreach ($items as $item) {
      $stock = $item->branchStocks->first();
      $current = $stock->current_stock ?? 0;
      $min = $stock->min_stock ?? 0;

      if ($current === 0) {
        $outOfStock[] = $item->name;
      } elseif ($current <= $min) {
        $lowStock[] = ['name' => $item->name, 'stock' => $current];
      }
    }

    return [
      'out_of_stock_count' => count($outOfStock),
      'out_of_stock_items' => $outOfStock,
      'low_stock_count' => count($lowStock),
      'low_stock_items' => $lowStock,
    ];
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
