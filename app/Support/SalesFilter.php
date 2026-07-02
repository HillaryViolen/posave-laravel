<?php

namespace App\Support;

use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * Menerjemahkan parameter filter (outlet + rentang tanggal) dari request
 * menjadi nilai siap pakai untuk query Dashboard & Laporan.
 */
class SalesFilter
{
    public function __construct(
        public readonly ?int $outletId,
        public readonly Carbon $start,
        public readonly Carbon $end,
        public readonly string $preset,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $preset = $request->string('range', '30d')->toString();
        $outletId = $request->integer('outlet_id') ?: null;

        [$start, $end] = match ($preset) {
            'today' => [Carbon::today(), Carbon::today()->endOfDay()],
            '7d' => [Carbon::today()->subDays(6), Carbon::today()->endOfDay()],
            '90d' => [Carbon::today()->subDays(89), Carbon::today()->endOfDay()],
            'custom' => [
                self::parseDate($request->input('from'), Carbon::today()->subDays(29)),
                self::parseDate($request->input('to'), Carbon::today())->endOfDay(),
            ],
            default => [Carbon::today()->subDays(29), Carbon::today()->endOfDay()],
        };

        // Pastikan start <= end walau user membalik tanggal.
        if ($start->gt($end)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return new self($outletId, $start, $end, $preset === 'custom' ? 'custom' : $preset);
    }

    /** Jumlah hari dalam rentang terpilih. */
    public function durationDays(): int
    {
        return $this->start->copy()->startOfDay()->diffInDays($this->end->copy()->startOfDay()) + 1;
    }

    /**
     * Rentang periode sebelumnya (panjang sama, tepat sebelum periode ini).
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    public function previousPeriod(): array
    {
        $days = $this->durationDays();
        $prevStart = $this->start->copy()->subDays($days)->startOfDay();
        $prevEnd = $this->start->copy()->subDay()->endOfDay();

        return [$prevStart, $prevEnd];
    }

    /** Label rentang yang mudah dibaca, mis. "2 Apr – 30 Jun 2026". */
    public function label(): string
    {
        return $this->start->translatedFormat('d M Y') . ' – ' . $this->end->translatedFormat('d M Y');
    }

    /** @return array{outlet_id: int|null, range: string, from: string, to: string, label: string, days: int} */
    public function toArray(): array
    {
        return [
            'outlet_id' => $this->outletId,
            'range' => $this->preset,
            'from' => $this->start->toDateString(),
            'to' => $this->end->toDateString(),
            'label' => $this->label(),
            'days' => $this->durationDays(),
        ];
    }

    private static function parseDate(?string $value, Carbon $fallback): Carbon
    {
        if (! $value) {
            return $fallback->copy()->startOfDay();
        }

        try {
            return Carbon::parse($value)->startOfDay();
        } catch (\Throwable) {
            return $fallback->copy()->startOfDay();
        }
    }
}
