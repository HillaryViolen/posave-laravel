<h2>Katalog Barang</h2>
<table>
    <thead>
        <tr>
            <th>Nama Barang</th>
            <th>SKU</th>
            <th>Kategori</th>
            <th class="text-right">Harga Jual</th>
            <th class="text-right">HPP</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row->name }}</td>
                <td>{{ $row->sku }}</td>
                <td>{{ $row->category->name }}</td>
                <td class="text-right">{{ $rupiah($row->price) }}</td>
                <td class="text-right">{{ $rupiah($row->cost) }}</td>
            </tr>
        @empty
            <tr class="empty-row">
                <td colspan="5">Tidak ada data barang</td>
            </tr>
        @endforelse
    </tbody>
</table>
