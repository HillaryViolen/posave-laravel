<h2>Perubahan Stok</h2>
<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Barang</th>
            <th>SKU</th>
            <th>Cabang</th>
            <th>Catatan</th>
            <th class="text-right">Perubahan Qty</th>
            <th class="text-right">Perubahan Nilai</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row->date }}</td>
                <td>{{ $row->item->name }}</td>
                <td>{{ $row->item->sku }}</td>
                <td>{{ $row->branch->name }}</td>
                <td>{{ $row->note }}</td>
                <td class="text-right">{{ $row->qty_change > 0 ? '+' . $row->qty_change : $row->qty_change }}</td>
                <td class="text-right">{{ $rupiah($row->financial_change) }}</td>
            </tr>
        @empty
            <tr class="empty-row">
                <td colspan="7">Tidak ada data perubahan stok</td>
            </tr>
        @endforelse
    </tbody>
</table>
