<h2>Kiriman Antar Cabang</h2>
<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Nomor Kiriman</th>
            <th>Cabang Pengirim</th>
            <th>Cabang Penerima</th>
            <th class="text-right">Jumlah Barang</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row->date }}</td>
                <td>{{ $row->transfer_number }}</td>
                <td>{{ $row->senderBranch->name }}</td>
                <td>{{ $row->receiverBranch->name }}</td>
                <td class="text-right">{{ $row->items_count }}</td>
                <td>{{ $statusTransfer($row->status) }}</td>
            </tr>
        @empty
            <tr class="empty-row">
                <td colspan="6">Tidak ada data kiriman</td>
            </tr>
        @endforelse
    </tbody>
</table>
