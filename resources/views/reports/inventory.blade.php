<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Inventory</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1e293b;
        }
        h1 {
            font-size: 18px;
            margin-bottom: 4px;
        }
        .meta {
            color: #64748b;
            font-size: 10px;
            margin-bottom: 16px;
        }
        h2 {
            font-size: 13px;
            margin-top: 24px;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #cbd5e1;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 5px 7px;
            text-align: left;
        }
        th {
            background-color: #1e293b;
            color: #ffffff;
            font-size: 10px;
        }
        td {
            font-size: 10px;
        }
        .text-right { text-align: right; }
        .empty-row td {
            text-align: center;
            color: #94a3b8;
            padding: 10px;
        }
        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
        }
    </style>
</head>
<body>

    <h1>Laporan Inventory</h1>
    <div class="meta">
        @if ($from || $to)
            Periode: {{ $from ?? '...' }} s/d {{ $to ?? '...' }} &nbsp;|&nbsp;
        @endif
        Dicetak: {{ now()->translatedFormat('d F Y, H:i') }}
    </div>

    @php
        $statusTransfer = fn ($s) => match ($s) {
            'waiting' => 'Menunggu',
            'success' => 'Diterima',
            'rejected' => 'Ditolak',
            default => $s,
        };
        $statusPo = fn ($s) => match ($s) {
            'waiting_fulfilment' => 'Menunggu',
            'success' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => $s,
        };
        $rupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    @endphp

    @if ($type === 'all')
        {{-- Tipe 'all': data-nya array asosiatif berisi 4 koleksi --}}
        @include('reports.partials.transfers', ['rows' => $data['transfers'], 'statusTransfer' => $statusTransfer])
        @include('reports.partials.adjustments', ['rows' => $data['adjustments'], 'rupiah' => $rupiah])
        @include('reports.partials.purchase-orders', ['rows' => $data['purchase_orders'], 'statusPo' => $statusPo, 'rupiah' => $rupiah])
        @include('reports.partials.items', ['rows' => $data['items'], 'rupiah' => $rupiah])
    @elseif ($type === 'transfers')
        @include('reports.partials.transfers', ['rows' => $data, 'statusTransfer' => $statusTransfer])
    @elseif ($type === 'adjustments')
        @include('reports.partials.adjustments', ['rows' => $data, 'rupiah' => $rupiah])
    @elseif ($type === 'purchase_orders')
        @include('reports.partials.purchase-orders', ['rows' => $data, 'statusPo' => $statusPo, 'rupiah' => $rupiah])
    @elseif ($type === 'items')
        @include('reports.partials.items', ['rows' => $data, 'rupiah' => $rupiah])
    @endif

</body>
</html>