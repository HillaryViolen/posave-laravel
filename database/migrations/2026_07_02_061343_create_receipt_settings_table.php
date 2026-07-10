    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('receipt_settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->string('logo')->nullable();
                $table->string('address')->nullable();
                $table->string('province')->nullable();
                $table->string('city')->nullable();
                $table->string('zip')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        public function down(): void
        {
            Schema::dropIfExists('receipt_settings');
        }
    };
