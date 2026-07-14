<?php

namespace App\Services\Chatbot\Tools;

use App\Models\User;

class GetPageLinkTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_page_link';
  }

  public function description(): string
  {
    return 'Ambil link langsung ke halaman tertentu di aplikasi. WAJIB gunakan ini setiap kali user nanya "gimana caranya ke...", "dimana menu...", atau minta diarahkan ke suatu halaman.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'page' => [
          'type' => 'string',
          'enum' => [
            'dashboard',
            'inventory_items',
            'inventory_categories',
            'inventory_adjustments',
            'inventory_transfers',
            'inventory_purchase_orders',
            'inventory_suppliers',
            'employees',
            'employees_access',
            'reports',
            'messaging',
            'settings_company_profile',
            'settings_receipt',
            'settings_branches',
            'cashier_order',
            'cashier_history',
            'my_profile',
          ],
          'description' => 'Pilih halaman yang paling sesuai sama yang diminta user.',
        ],
      ],
      'required' => ['page'],
    ];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    return true; // pembatasan per-halaman ditangani di resolve(), bukan di sini
  }

  public function execute(User $user, array $args): array
  {
    $resolved = isset($args['page']) ? $this->resolve($args['page'], $user) : null;

    if (!$resolved) {
      return ['error' => 'Halaman ini tidak tersedia, atau Anda tidak memiliki akses ke halaman tersebut sesuai role Anda.'];
    }

    return ['links' => ['label' => $resolved['label'], 'url' => route($resolved['route'])]];
  }

  public function summarize(User $user, array $args): array
  {
    return [];
  }

  public function formFields(User $user, array $currentArgs): array
  {
    return [];
  }

  /** @return array{label: string, route: string}|null */
  private function resolve(string $page, User $user): ?array
  {
    $isLite = $user->company?->isLite() ?? false;
    $role = $user->role;
    $isManager = in_array($role, ['owner', 'branch_manager']);

    return match ($page) {
      'dashboard' => ['label' => 'Dashboard', 'route' => 'dashboard.index'],

      'inventory_items' => $isLite
        ? ['label' => 'Daftar Barang', 'route' => 'lite.inventory.items.index']
        : ($isManager ? ['label' => 'Daftar Barang', 'route' => 'dashboard.inventory.items.index'] : null),

      'inventory_categories' => $isLite
        ? ['label' => 'Kategori Barang', 'route' => 'lite.inventory.categories.index']
        : ($isManager ? ['label' => 'Kategori Barang', 'route' => 'dashboard.inventory.categories.index'] : null),

      'inventory_adjustments' => $isLite
        ? ['label' => 'Perubahan Stok', 'route' => 'lite.inventory.adjustments.index']
        : ($isManager ? ['label' => 'Perubahan Stok', 'route' => 'dashboard.inventory.adjustments.index'] : null),

      'inventory_transfers' => !$isLite && $isManager
        ? ['label' => 'Kiriman Antar Cabang', 'route' => 'dashboard.inventory.transfers.index']
        : null,

      'inventory_purchase_orders' => !$isLite && $isManager
        ? ['label' => 'Pembelian (PO)', 'route' => 'dashboard.inventory.purchase-orders.index']
        : null,

      'inventory_suppliers' => !$isLite && $role === 'owner'
        ? ['label' => 'Pemasok', 'route' => 'dashboard.inventory.suppliers.index']
        : null,

      'employees' => !$isLite && $isManager
        ? ['label' => 'Daftar Karyawan', 'route' => 'dashboard.employees.index']
        : null,

      'employees_access' => !$isLite && $role === 'owner'
        ? ['label' => 'Akses Karyawan', 'route' => 'dashboard.employees-access.index']
        : null,

      'reports' => !$isLite && $isManager
        ? ['label' => 'Laporan', 'route' => 'dashboard.reports.index']
        : null,

      'messaging' => !$isLite ? ['label' => 'Pesan', 'route' => 'messaging.index'] : null,

      'settings_company_profile' => !$isLite && $role === 'owner'
        ? ['label' => 'Profil Perusahaan', 'route' => 'settings.company-profile']
        : null,

      'settings_receipt' => $isLite
        ? ['label' => 'Bukti Bayar', 'route' => 'lite.settings.receipt.index']
        : ($role === 'owner' ? ['label' => 'Bukti Bayar', 'route' => 'settings.receipt'] : null),

      'settings_branches' => !$isLite && $role === 'owner'
        ? ['label' => 'Cabang', 'route' => 'settings.branches']
        : null,

      'cashier_order' => $isLite
        ? ['label' => 'Pesanan', 'route' => 'lite.order.index']
        : ['label' => 'Pesanan', 'route' => 'cashier.order.index'],

      'cashier_history' => $isLite
        ? ['label' => 'Riwayat Pesanan', 'route' => 'lite.history.index']
        : ['label' => 'Riwayat Pesanan', 'route' => 'cashier.history.index'],

      'my_profile' => ['label' => 'Profil Saya', 'route' => 'settings.profile.edit'],

      default => null,
    };
  }
}
