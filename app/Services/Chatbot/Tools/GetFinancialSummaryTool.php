<?php

namespace App\Services\Chatbot\Tools;

use App\Models\Advance\Transaction\Transaction;
use App\Models\Auth\Branch;
use App\Models\User;
use Carbon\Carbon;

class GetFinancialSummaryTool implements ToolInterface
{
  public function name(): string
  {
    return 'get_financial_summary';
  }

  public function description(): string
  {
    return 'Ambil ringkasan keuangan (penjualan kotor, HPP, laba kotor/net profit, margin) untuk periode tertentu. Gunakan ini kalau user nanya soal omzet, laba, profit, atau keuntungan.';
  }

  public function parameters(): array
  {
    return [
      'type' => 'object',
      'properties' => [
        'period' => [
          'type' => 'string',
          'enum' => ['today', '7d', '30d'],
          'description' => 'Rentang waktu. Default "today" kalau user gak sebutkan.',
        ],
      ],
      'required' => [],
    ];
  }

  public function isReadOnly(): bool
  {
    return true;
  }

  public function isAvailableFor(User $user): bool
  {
    // Data keuangan itu sensitif — batasannya sama kayak menu Laporan (gak ada di nav cashier).
    if ($user->company?->isLite()) {
      return true;
    }
    return $user->isOwner() || $user->isBranchManager();
  }

  public function execute(User $user, array $args): array
  {
    $period = $args['period'] ?? 'today';
    [$start, $end] = $this->resolvePeriod($period);

    $companyBranchIds = Branch::where('company_id', $user->company_id)->pluck('id');
    $branchId = $user->isBranchManager() ? $user->branch_id : null;

    $s = Transaction::query()
      ->revenue()
      ->whereIn('branch_id', $companyBranchIds)
      ->forBranch($branchId)
      ->withinPeriod($start, $end)
      ->selectRaw(implode(', ', [
        'COALESCE(SUM(gross_amount), 0) as gross',
        'COALESCE(SUM(discount_amount), 0) as discount',
        'COALESCE(SUM(refund_amount), 0) as refund',
        'COALESCE(SUM(cogs_amount), 0) as cogs',
      ]))
      ->first();

    $gross = (float) $s->gross;
    $nett = $gross - (float) $s->discount - (float) $s->refund;
    $cogs = (float) $s->cogs;
    $netProfit = $nett - $cogs;

    return [
      'period' => $period,
      'gross_sales' => $gross,
      'nett_sales' => $nett,
      'cogs' => $cogs,
      'net_profit' => $netProfit,
      'margin_pct' => $nett > 0 ? round($netProfit / $nett * 100, 1) : 0,
      'links' => [
        'label' => 'Lihat Dashboard lengkap',
        'url' => route('dashboard.index'),
      ],
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

  private function resolvePeriod(string $period): array
  {
    return match ($period) {
      '7d' => [Carbon::today()->subDays(6), Carbon::today()->endOfDay()],
      '30d' => [Carbon::today()->subDays(29), Carbon::today()->endOfDay()],
      default => [Carbon::today(), Carbon::today()->endOfDay()],
    };
  }
}
