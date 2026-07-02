<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Detail item per transaksi. Menyimpan snapshot nama/harga/HPP
        // saat penjualan agar laporan tetap akurat walau master produk berubah.
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('product_name');              // snapshot nama produk
            $table->string('category_name')->nullable(); // snapshot kategori (untuk grouping laporan)
            $table->unsignedInteger('qty');
            $table->decimal('unit_price', 15, 2);        // snapshot harga jual
            $table->decimal('unit_cost', 15, 2)->default(0); // snapshot HPP
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2);          // qty × unit_price − discount
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
