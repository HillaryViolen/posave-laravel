<?php

namespace Database\Seeders;

use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\Sales\Category;
use App\Models\Sales\Outlet;
use App\Models\Sales\Product;
use App\Models\Sales\Transaction;
use App\Models\Sales\TransactionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Data demo "Berkah Mart" — jaringan minimarket 3 cabang.
 *
 * Menghasilkan ±6 bulan riwayat transaksi dengan pola layaknya toko sungguhan:
 * jam ramai (makan siang & pulang kerja), akhir pekan + tanggal gajian lebih
 * ramai, omzet bertumbuh perlahan, produk fast-mover lebih sering terjual,
 * plus diskon/refund/void sesekali. Seluruh nama memakai Bahasa Indonesia.
 */
class SalesSeeder extends Seeder
{
    /** Rentang riwayat transaksi. 185 hari = filter "90 Hari" + pembanding periode sebelumnya. */
    private const DAYS = 185;

    public function run(): void
    {
        $company = Company::firstOrFail(); // dibuat di DatabaseSeeder

        $outlets = $this->seedOutletsAndBranches($company);
        $cashiers = $this->seedCashiers($company, $outlets);
        $products = $this->seedCatalog();

        $this->seedTransactions($outlets, $cashiers, $products);
    }

    /**
     * Outlet penjualan + cabang (menu Pengaturan Cabang) dengan data yang sama
     * agar kedua sisi aplikasi konsisten.
     *
     * @return array<int, array{outlet: Outlet, branch: Branch, code: string, weight: float}>
     */
    private function seedOutletsAndBranches(Company $company): array
    {
        $data = [
            // code utk nomor struk; weight = bobot keramaian relatif antar cabang
            ['name' => 'Berkah Mart Merdeka', 'address' => 'Jl. Merdeka No. 10, Jakarta Pusat', 'phone' => '021-5550101', 'code' => 'BMM', 'weight' => 1.0, 'is_main' => true],
            ['name' => 'Berkah Mart Sudirman', 'address' => 'Jl. Jend. Sudirman Kav. 45, Jakarta Selatan', 'phone' => '021-5550202', 'code' => 'BMS', 'weight' => 0.75, 'is_main' => false],
            ['name' => 'Berkah Mart Kemang', 'address' => 'Jl. Kemang Raya No. 8, Jakarta Selatan', 'phone' => '021-5550303', 'code' => 'BMK', 'weight' => 0.55, 'is_main' => false],
        ];

        return array_map(function ($row) use ($company) {
            $outlet = Outlet::create([
                'name' => $row['name'],
                'address' => $row['address'],
                'phone' => $row['phone'],
            ]);

            $branch = Branch::create([
                'company_id' => $company->id,
                'name' => $row['name'],
                'address' => $row['address'],
                'phone' => $row['phone'],
                'is_main' => $row['is_main'],
                'status' => 'open',
            ]);

            return ['outlet' => $outlet, 'branch' => $branch, 'code' => $row['code'], 'weight' => $row['weight']];
        }, $data);
    }

    /**
     * Dua kasir per cabang, nama Indonesia.
     *
     * @param  array<int, array{outlet: Outlet, branch: Branch, code: string, weight: float}>  $outlets
     * @return array<int, User[]> kasir dikelompokkan per index outlet
     */
    private function seedCashiers(Company $company, array $outlets): array
    {
        $names = [
            ['Andi Saputra', 'Dewi Anggraini'],       // Merdeka
            ['Bintang Ramadhan', 'Citra Lestari'],    // Sudirman
            ['Eko Prasetyo', 'Fitri Handayani'],      // Kemang
        ];

        $byOutlet = [];
        foreach ($outlets as $i => $entry) {
            foreach ($names[$i] as $name) {
                $byOutlet[$i][] = User::firstOrCreate(
                    ['email' => Str::slug($name, '.') . '@posave.test'],
                    [
                        'name' => $name,
                        'password' => bcrypt('password'),
                        'role' => 'cashier',
                        'company_id' => $company->id,
                        'branch_id' => $entry['branch']->id,
                    ],
                );
            }
        }

        return $byOutlet;
    }

    /**
     * Katalog minimarket: 7 kategori / 44 produk merek lokal.
     * "weight" = seberapa sering produk terjual (fast mover lebih tinggi).
     *
     * @return array<int, array{product: Product, weight: int}>
     */
    private function seedCatalog(): array
    {
        $catalog = [
            'Minuman' => [
                'color' => '#3d8ab8',
                'items' => [
                    // [nama, harga jual, harga modal, bobot laku]
                    ['Aqua 600ml', 3500, 2500, 9],
                    ['Le Minerale 600ml', 3500, 2400, 7],
                    ['Teh Pucuk Harum 350ml', 4000, 2800, 8],
                    ['Teh Botol Sosro 450ml', 5500, 4000, 6],
                    ['Pocari Sweat 500ml', 8000, 6000, 4],
                    ['Susu Ultra Milk 250ml', 6000, 4500, 5],
                    ['Good Day Cappuccino 250ml', 6500, 4800, 4],
                    ['Floridina Orange 350ml', 4500, 3200, 4],
                    ['Kopi Kapal Api Sachet', 2000, 1200, 6],
                    ['Nescafe Kaleng 220ml', 9000, 6800, 3],
                ],
            ],
            'Makanan Instan' => [
                'color' => '#e75f1a',
                'items' => [
                    ['Indomie Goreng', 3500, 2500, 10],
                    ['Indomie Soto', 3200, 2300, 7],
                    ['Mie Sedaap Goreng', 3300, 2400, 6],
                    ['Pop Mie Ayam', 6500, 4800, 5],
                    ['Sarden ABC 155g', 12000, 9000, 3],
                    ['Kornet Pronas 198g', 17000, 13000, 2],
                ],
            ],
            'Sembako' => [
                'color' => '#a16207',
                'items' => [
                    ['Beras Setra Ramos 5kg', 68000, 60000, 4],
                    ['Minyak Goreng Bimoli 1L', 20000, 17000, 5],
                    ['Gula Pasir Gulaku 1kg', 16500, 14000, 4],
                    ['Telur Ayam 1kg', 28000, 24000, 5],
                    ['Tepung Terigu Segitiga Biru 1kg', 13000, 10500, 3],
                    ['Kecap Manis Bango 220ml', 14000, 10500, 3],
                ],
            ],
            'Camilan' => [
                'color' => '#16a34a',
                'items' => [
                    ['Chitato Sapi Panggang 68g', 9500, 6800, 6],
                    ['Taro Net Seaweed', 6000, 4000, 5],
                    ['Beng Beng', 2000, 1300, 7],
                    ['Oreo Original 133g', 8500, 5800, 5],
                    ['SilverQueen 30g', 11000, 8000, 4],
                    ['Qtela Singkong Balado', 7500, 5200, 4],
                    ['Nabati Keju', 2000, 1250, 6],
                    ['Tango Wafer Coklat', 7000, 4900, 4],
                ],
            ],
            'Roti & Kue' => [
                'color' => '#db2777',
                'items' => [
                    ['Roti Tawar Sari Roti', 16000, 12000, 5],
                    ['Roti Sobek Coklat', 14500, 11000, 4],
                    ['Roti Isi Coklat Sari Roti', 5500, 4000, 4],
                    ['Bolu Pandan Potong', 4500, 3200, 3],
                ],
            ],
            'Perawatan Diri' => [
                'color' => '#0d9488',
                'items' => [
                    ['Sabun Lifebuoy 110g', 4000, 2800, 4],
                    ['Pasta Gigi Pepsodent 120g', 9500, 7000, 4],
                    ['Shampo Clear Sachet', 1000, 650, 5],
                    ['Deodoran Rexona Roll On', 13500, 10000, 2],
                    ['Hand Sanitizer Antis 55ml', 11000, 8000, 2],
                ],
            ],
            'Kebutuhan Rumah' => [
                'color' => '#9f6fd5',
                'items' => [
                    ['Tisu Paseo 250 Lembar', 12000, 9000, 4],
                    ['Baterai ABC AA 2pcs', 10000, 7000, 2],
                    ['Korek Api Gas', 3000, 1800, 3],
                    ['Sunlight Jeruk Nipis 755ml', 14500, 11500, 3],
                    ['Rinso Anti Noda 770g', 15500, 12500, 3],
                    ['Pengharum Ruangan Stella', 10500, 7800, 2],
                ],
            ],
        ];

        $weighted = [];
        foreach ($catalog as $categoryName => $group) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'color' => $group['color'],
            ]);

            foreach ($group['items'] as $i => [$name, $price, $cost, $weight]) {
                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => $name,
                    'sku' => strtoupper(Str::slug($categoryName, '')) . '-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT),
                    'price' => $price,
                    'cost' => $cost,
                ]);
                $product->setRelation('category', $category);

                $weighted[] = ['product' => $product, 'weight' => $weight];
            }
        }

        return $weighted;
    }

    /**
     * Riwayat transaksi ±6 bulan, batch-insert supaya cepat.
     *
     * @param  array<int, array{outlet: Outlet, branch: Branch, code: string, weight: float}>  $outlets
     * @param  array<int, User[]>  $cashiersByOutlet
     * @param  array<int, array{product: Product, weight: int}>  $products
     */
    private function seedTransactions(array $outlets, array $cashiersByOutlet, array $products): void
    {
        $start = Carbon::today()->subDays(self::DAYS - 1);
        $today = Carbon::today();
        $now = Carbon::now();

        $productPool = $this->buildWeightedPool($products);
        $trxRows = [];
        $itemsByInvoice = [];

        for ($day = $start->copy(); $day->lte($today); $day->addDay()) {
            $progress = $start->diffInDays($day) / max(1, self::DAYS - 1); // 0 → 1
            $dailySeq = [];

            foreach ($outlets as $i => $entry) {
                $count = $this->dailyTransactionCount($day, $entry['weight'], $progress, $now);

                for ($t = 0; $t < $count; $t++) {
                    $dailySeq[$i] = ($dailySeq[$i] ?? 0) + 1;
                    $transactedAt = $this->randomBusinessTime($day, $now);
                    $invoiceNo = sprintf('INV/%s/%s/%03d', $entry['code'], $day->format('Ymd'), $dailySeq[$i]);

                    [$row, $items] = $this->makeTransaction($entry['outlet'], $cashiersByOutlet[$i], $productPool, $invoiceNo, $transactedAt);

                    $trxRows[] = $row;
                    $itemsByInvoice[$invoiceNo] = $items;

                    if (count($trxRows) >= 500) {
                        $this->flush($trxRows, $itemsByInvoice);
                    }
                }
            }
        }

        $this->flush($trxRows, $itemsByInvoice);
    }

    /** Jumlah transaksi per outlet per hari, dengan pola musiman. */
    private function dailyTransactionCount(Carbon $day, float $outletWeight, float $progress, Carbon $now): int
    {
        $base = 34 * $outletWeight;                       // rata-rata dasar per cabang
        $base *= $day->isWeekend() ? 1.25 : 1.0;          // akhir pekan lebih ramai
        $base *= ($day->day >= 25 || $day->day <= 3) ? 1.18 : 1.0; // efek tanggal gajian
        $base *= 1 + 0.18 * $progress;                    // bisnis bertumbuh ±18% dlm 6 bulan
        $base *= random_int(82, 118) / 100;               // variasi harian

        // Hari ini belum selesai: skala menurut jam berjalan (toko buka 07:00–22:00).
        if ($day->isToday()) {
            $openedHours = max(0, min(15, $now->hour + 1 - 7));
            $base *= $openedHours / 15;
        }

        return max($day->isToday() ? 0 : 4, (int) round($base));
    }

    /** Jam transaksi berbobot: ramai saat makan siang & pulang kerja. Toko buka 07–22. */
    private function randomBusinessTime(Carbon $day, Carbon $now): Carbon
    {
        $weights = [7 => 5, 8 => 6, 9 => 4, 10 => 4, 11 => 5, 12 => 9, 13 => 8, 14 => 5, 15 => 4, 16 => 5, 17 => 7, 18 => 10, 19 => 11, 20 => 8, 21 => 6];

        if ($day->isToday()) {
            $weights = array_filter($weights, fn ($h) => $h <= $now->hour, ARRAY_FILTER_USE_KEY);
            if ($weights === []) {
                $weights = [7 => 1];
            }
        }

        $hour = $this->weightedPick($weights);

        return $day->copy()->setTime($hour, random_int(0, 59), random_int(0, 59));
    }

    /**
     * Rakit satu transaksi + item-itemnya.
     *
     * @param  User[]  $cashiers
     * @param  array<int, array{product: Product, weight: int}>  $productPool  pool sudah terbobot
     * @return array{0: array<string, mixed>, 1: array<int, array<string, mixed>>}
     */
    private function makeTransaction(Outlet $outlet, array $cashiers, array $productPool, string $invoiceNo, Carbon $transactedAt): array
    {
        $lineCount = $this->weightedPick([1 => 30, 2 => 30, 3 => 20, 4 => 12, 5 => 5, 6 => 3]);

        // Pilih produk tanpa duplikat dalam satu struk.
        $chosen = [];
        while (count($chosen) < $lineCount) {
            $candidate = $productPool[random_int(0, count($productPool) - 1)];
            $chosen[$candidate->id] = $candidate;
        }

        $gross = 0.0;
        $discount = 0.0;
        $cogs = 0.0;
        $items = [];

        foreach ($chosen as $product) {
            $qty = $this->weightedPick([1 => 50, 2 => 28, 3 => 12, 4 => 6, 5 => 4]);
            $lineGross = $qty * (float) $product->price;

            // 15% kemungkinan diskon item 5–15%.
            $lineDiscount = random_int(1, 100) <= 15 ? round($lineGross * (random_int(5, 15) / 100), -2) : 0.0;

            $gross += $lineGross;
            $discount += $lineDiscount;
            $cogs += $qty * (float) $product->cost;

            $items[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'category_name' => $product->category->name,
                'qty' => $qty,
                'unit_price' => (float) $product->price,
                'unit_cost' => (float) $product->cost,
                'discount_amount' => $lineDiscount,
                'subtotal' => $lineGross - $lineDiscount,
                'created_at' => $transactedAt,
                'updated_at' => $transactedAt,
            ];
        }

        // Status: ~2.5% refund, ~1% void, sisanya selesai.
        $roll = random_int(1, 1000);
        $status = match (true) {
            $roll <= 25 => 'refunded',
            $roll <= 35 => 'void',
            default => 'completed',
        };
        $refund = $status === 'refunded' ? round(($gross - $discount) * (random_int(20, 100) / 100), -2) : 0.0;

        // Total dibulatkan ke kelipatan Rp100.
        $nett = $gross - $discount - $refund;
        $total = round($nett / 100) * 100;
        $rounding = $total - $nett;

        $payment = $this->weightedPick(['cash' => 45, 'qris' => 32, 'debit' => 14, 'transfer' => 9]);
        [$cashReceived, $changeReturned] = $payment === 'cash'
            ? $this->cashPayment($total)
            : [null, null];

        $row = [
            'outlet_id' => $outlet->id,
            'user_id' => $cashiers[array_rand($cashiers)]->id,
            'invoice_no' => $invoiceNo,
            'status' => $status,
            'payment_method' => $payment,
            'gross_amount' => $gross,
            'discount_amount' => $discount,
            'refund_amount' => $refund,
            'tax_amount' => 0,
            'gratuity_amount' => 0,
            'rounding_amount' => $rounding,
            'cogs_amount' => $cogs,
            'total_amount' => $total,
            'cash_received' => $cashReceived,
            'change_returned' => $changeReturned,
            'transacted_at' => $transactedAt,
            'created_at' => $transactedAt,
            'updated_at' => $transactedAt,
        ];

        return [$row, $items];
    }

    /**
     * Simulasi pembayaran tunai: sebagian pelanggan membayar pas, sisanya
     * memakai pecahan terdekat di atas total (Rp5rb–Rp100rb).
     *
     * @return array{0: float, 1: float}
     */
    private function cashPayment(float $total): array
    {
        if (random_int(1, 100) <= 30) {
            return [$total, 0.0]; // bayar pas
        }

        foreach ([5000, 10000, 20000, 50000, 100000] as $denom) {
            if ($denom >= $total) {
                return [(float) $denom, $denom - $total];
            }
        }

        $received = ceil($total / 50000) * 50000; // belanja besar: kelipatan Rp50rb
        return [(float) $received, $received - $total];
    }

    /** Insert batch transaksi lalu item-itemnya (butuh id transaksi dari DB). */
    private function flush(array &$trxRows, array &$itemsByInvoice): void
    {
        if ($trxRows === []) {
            return;
        }

        Transaction::insert($trxRows);

        $ids = Transaction::whereIn('invoice_no', array_keys($itemsByInvoice))->pluck('id', 'invoice_no');

        $itemRows = [];
        foreach ($itemsByInvoice as $invoiceNo => $items) {
            foreach ($items as $item) {
                $item['transaction_id'] = $ids[$invoiceNo];
                $itemRows[] = $item;
            }

            if (count($itemRows) >= 1000) {
                TransactionItem::insert($itemRows);
                $itemRows = [];
            }
        }

        if ($itemRows !== []) {
            TransactionItem::insert($itemRows);
        }

        $trxRows = [];
        $itemsByInvoice = [];
    }

    /**
     * Ambil satu kunci secara acak sesuai bobotnya.
     *
     * @template TKey of array-key
     * @param  array<TKey, int>  $weights
     * @return TKey
     */
    private function weightedPick(array $weights)
    {
        $total = array_sum($weights);
        $roll = random_int(1, $total);

        foreach ($weights as $key => $weight) {
            $roll -= $weight;
            if ($roll <= 0) {
                return $key;
            }
        }

        return array_key_first($weights);
    }

    /**
     * Pool produk terbobot: produk ber-weight n muncul n kali di pool
     * sehingga fast mover lebih sering terpilih.
     *
     * @param  array<int, array{product: Product, weight: int}>  $products
     * @return Product[]
     */
    private function buildWeightedPool(array $products): array
    {
        $pool = [];
        foreach ($products as ['product' => $product, 'weight' => $weight]) {
            for ($i = 0; $i < $weight; $i++) {
                $pool[] = $product;
            }
        }

        return $pool;
    }
}
