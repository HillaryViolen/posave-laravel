<?php

namespace Database\Seeders;

use App\Models\Sales\Category;
use App\Models\Sales\Outlet;
use App\Models\Sales\Product;
use App\Models\Sales\Transaction;
use App\Models\Sales\TransactionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SalesSeeder extends Seeder
{
    /**
     * Seed dummy data penjualan untuk Dashboard & Laporan.
     */
    public function run(): void
    {
        $outlets = $this->seedOutlets();
        $cashiers = $this->seedCashiers();
        $products = $this->seedCatalog();

        $this->seedTransactions($outlets, $cashiers, $products);
    }

    /** @return \App\Models\Sales\Outlet[] */
    private function seedOutlets(): array
    {
        $data = [
            ['name' => 'Outlet 1', 'address' => 'Jl. Merdeka No. 10, Jakarta', 'phone' => '021-555-0101'],
            ['name' => 'Outlet 2', 'address' => 'Jl. Sudirman No. 45, Bandung', 'phone' => '022-555-0202'],
        ];

        return array_map(fn ($o) => Outlet::create($o), $data);
    }

    /** @return \App\Models\User[] */
    private function seedCashiers(): array
    {
        $names = ['Kasir Andi', 'Kasir Bintang', 'Kasir Citra'];

        return array_map(function ($name) {
            return User::firstOrCreate(
                ['email' => Str::slug($name, '.') . '@posave.test'],
                ['name' => $name, 'password' => bcrypt('password'), 'role' => 'cashier'],
            );
        }, $names);
    }

    /**
     * Seed kategori + produk. Mengembalikan daftar produk siap pakai.
     *
     * @return \App\Models\Sales\Product[]
     */
    private function seedCatalog(): array
    {
        $catalog = [
            'Minuman' => [
                'color' => '#3d8ab8',
                'items' => [
                    ['Susu Ultra Milk 250ml', 6000, 4500],
                    ['Kopi Kapal Api Sachet', 2000, 1200],
                    ['Teh Pucuk Harum 350ml', 4000, 2800],
                    ['Aqua 600ml', 3500, 2500],
                    ['Pocari Sweat 500ml', 8000, 6000],
                    ['Le Minerale 600ml', 3500, 2400],
                ],
            ],
            'Makanan' => [
                'color' => '#16a34a',
                'items' => [
                    ['Indomie Goreng', 3500, 2500],
                    ['Nasi Bungkus', 13000, 9000],
                    ['Roti Tawar Sari Roti', 16000, 12000],
                    ['Telur Ayam (butir)', 2500, 2000],
                    ['Sosis So Nice', 3000, 2100],
                ],
            ],
            'Snack' => [
                'color' => '#e75f1a',
                'items' => [
                    ['Chitato Sapi Panggang', 9500, 6800],
                    ['Taro Net', 6000, 4000],
                    ['Beng Beng', 2000, 1300],
                    ['Oreo Original', 8500, 5800],
                    ['SilverQueen 30gr', 11000, 8000],
                ],
            ],
            'Lainnya' => [
                'color' => '#9f6fd5',
                'items' => [
                    ['Sabun Lifebuoy', 4000, 2800],
                    ['Tisu Paseo', 12000, 9000],
                    ['Baterai ABC AA', 10000, 7000],
                    ['Korek Api Gas', 3000, 1800],
                ],
            ],
        ];

        $products = [];
        foreach ($catalog as $categoryName => $group) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'color' => $group['color'],
            ]);

            foreach ($group['items'] as $i => [$name, $price, $cost]) {
                $products[] = Product::create([
                    'category_id' => $category->id,
                    'name' => $name,
                    'sku' => strtoupper(Str::slug($categoryName, '')) . '-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT),
                    'price' => $price,
                    'cost' => $cost,
                ]);
            }
        }

        return $products;
    }

    /**
     * Generate ~90 hari transaksi untuk tiap outlet.
     *
     * @param  \App\Models\Sales\Outlet[]  $outlets
     * @param  \App\Models\User[]  $cashiers
     * @param  \App\Models\Sales\Product[]  $products
     */
    private function seedTransactions(array $outlets, array $cashiers, array $products): void
    {
        $start = Carbon::today()->subDays(89);
        $end = Carbon::today();
        $seq = 0;
        $itemRows = [];

        for ($day = $start->copy(); $day->lte($end); $day->addDay()) {
            // Akhir pekan lebih ramai.
            $isWeekend = $day->isWeekend();

            foreach ($outlets as $outlet) {
                $count = random_int($isWeekend ? 10 : 5, $isWeekend ? 22 : 14);

                for ($t = 0; $t < $count; $t++) {
                    $seq++;
                    $lineCount = random_int(1, 5);
                    $picked = collect($products)->random($lineCount);

                    $gross = 0.0;
                    $discount = 0.0;
                    $cogs = 0.0;
                    $pendingItems = [];

                    foreach ($picked as $product) {
                        $qty = random_int(1, 5);
                        $unitPrice = (float) $product->price;
                        $unitCost = (float) $product->cost;
                        $lineGross = $qty * $unitPrice;

                        // 20% kemungkinan ada diskon item (5–15%).
                        $lineDiscount = random_int(1, 100) <= 20
                            ? round($lineGross * (random_int(5, 15) / 100), -2)
                            : 0.0;

                        $gross += $lineGross;
                        $discount += $lineDiscount;
                        $cogs += $qty * $unitCost;

                        $pendingItems[] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'category_name' => $product->category->name,
                            'qty' => $qty,
                            'unit_price' => $unitPrice,
                            'unit_cost' => $unitCost,
                            'discount_amount' => $lineDiscount,
                            'subtotal' => $lineGross - $lineDiscount,
                        ];
                    }

                    // 5% transaksi di-refund.
                    $isRefunded = random_int(1, 100) <= 5;
                    $refund = $isRefunded ? round(($gross - $discount) * (random_int(20, 100) / 100), -2) : 0.0;

                    $nett = $gross - $discount - $refund;
                    $tax = 0.0;
                    $gratuity = 0.0;

                    // Pembulatan total ke kelipatan 500 terdekat.
                    $beforeRound = $nett + $tax + $gratuity;
                    $rounded = round($beforeRound / 500) * 500;
                    $rounding = $rounded - $beforeRound;
                    $total = $rounded;

                    $transactedAt = $day->copy()->setTime(random_int(8, 20), random_int(0, 59), random_int(0, 59));

                    $transaction = Transaction::create([
                        'outlet_id' => $outlet->id,
                        'user_id' => collect($cashiers)->random()->id,
                        'invoice_no' => sprintf('INV/%s/%05d', $day->format('Ymd'), $seq),
                        'status' => $isRefunded ? 'refunded' : 'completed',
                        'payment_method' => $this->randomPaymentMethod(),
                        'gross_amount' => $gross,
                        'discount_amount' => $discount,
                        'refund_amount' => $refund,
                        'tax_amount' => $tax,
                        'gratuity_amount' => $gratuity,
                        'rounding_amount' => $rounding,
                        'cogs_amount' => $cogs,
                        'total_amount' => $total,
                        'transacted_at' => $transactedAt,
                    ]);

                    foreach ($pendingItems as $row) {
                        $row['transaction_id'] = $transaction->id;
                        $row['created_at'] = $transactedAt;
                        $row['updated_at'] = $transactedAt;
                        $itemRows[] = $row;
                    }

                    // Insert item secara batch agar hemat memori.
                    if (count($itemRows) >= 500) {
                        TransactionItem::insert($itemRows);
                        $itemRows = [];
                    }
                }
            }
        }

        if ($itemRows !== []) {
            TransactionItem::insert($itemRows);
        }
    }

    /** Metode pembayaran dengan bobot ~50/30/12/8. */
    private function randomPaymentMethod(): string
    {
        $roll = random_int(1, 100);

        return match (true) {
            $roll <= 50 => 'cash',
            $roll <= 80 => 'qris',
            $roll <= 92 => 'debit',
            default => 'transfer',
        };
    }
}
