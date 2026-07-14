<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chatbot_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chatbot_id')->constrained()->cascadeOnDelete();
            $table->foreignId('chatbot_message_id')->nullable()->constrained('chatbot_messages')->nullOnDelete();
            $table->string('tool_name');
            $table->json('payload');      // argumen yang udah divalidasi, siap dieksekusi kalau dikonfirmasi
            $table->json('summary');      // versi ringkas buat ditampilin di kartu (label, bukan raw data)
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->json('result')->nullable(); // hasil eksekusi (misal item_id yang baru dibuat)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chatbot_actions');
    }
};
