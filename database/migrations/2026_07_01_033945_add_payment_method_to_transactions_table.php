<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'qris', 'debit', 'transfer'])
                ->default('cash')
                ->after('status');
        });

        DB::statement("
            UPDATE transactions
            SET payment_method = ELT(
                1 + (id MOD 10),
                'cash','cash','cash','cash','cash','qris','qris','qris','debit','transfer'
            )
        ");
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });
    }
};
