<h2>Pembelian (Purchase Order)</h2>
<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Nomor PO</th>
            <th>Cabang</th>
            <th>Pemasok</th>
            <th class="text-right">Total Harga</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row->date }}</td>
                <td>{{ $row->po_number }}</td>
                <td>{{ $row->branch->name }}</td>
                <td>{{ $row->supplier->name }}</td>
                <td class="text-right">{{ $rupiah($row->total_price) }}</td>
                <td>{{ $statusPo($row->status) }}</td>
            </tr>
        @empty
            <tr class="empty-row">
                <td colspan="6">Tidak ada data pembelian</td>
            </tr>
        @endforelse
    </tbody>
</table>
