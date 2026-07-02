<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Transaksi penjualan (header). Sumber data Dashboard & Laporan.
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')      // kasir
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('invoice_no')->unique();
            $table->enum('status', ['completed', 'refunded', 'void'])->default('completed');

            // Ringkasan nominal (dihitung dari item) — disimpan agar laporan cepat.
            $table->decimal('gross_amount', 15, 2)->default(0);    // Σ(qty × harga) sebelum diskon
            $table->decimal('discount_amount', 15, 2)->default(0); // total diskon
            $table->decimal('refund_amount', 15, 2)->default(0);   // total refund
            $table->decimal('tax_amount', 15, 2)->default(0);      // pajak
            $table->decimal('gratuity_amount', 15, 2)->default(0); // service/gratuity
            $table->decimal('rounding_amount', 15, 2)->default(0); // pembulatan (bisa minus)
            $table->decimal('cogs_amount', 15, 2)->default(0);     // total HPP untuk laba kotor
            $table->decimal('total_amount', 15, 2)->default(0);    // total dibayar (Total Collected)

            // dateTime (bukan timestamp) supaya tidak kena auto "ON UPDATE CURRENT_TIMESTAMP" MySQL.
            $table->dateTime('transacted_at')->index(); // waktu transaksi (untuk filter tanggal)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
