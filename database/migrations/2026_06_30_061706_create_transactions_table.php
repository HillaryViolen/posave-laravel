<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2);
            
            // Data Pembayaran
            $table->string('payment_method')->nullable(); // 'cash' atau 'qris'
            $table->decimal('cash_received', 15, 2)->nullable();   // Nominal Uang Pelanggan
            $table->decimal('change_returned', 15, 2)->nullable(); // Kembalian
            
            $table->string('status')->default('completed'); 
            $table->timestamps();
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
