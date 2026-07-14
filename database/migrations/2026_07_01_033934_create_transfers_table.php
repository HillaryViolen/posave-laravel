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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('transfer_number')->unique();
            $table->foreignId('sender_branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('receiver_branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('requested_by_branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->enum('status', ['waiting', 'success', 'rejected'])->default('waiting');
            $table->text('rejection_note')->nullable();
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
