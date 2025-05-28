<?php

use App\Enums\Language;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\User;
use App\Models\Problem;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solutions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Problem::class)->constrained()->cascadeOnDelete();
            $table->enum("status", ['solved', 'attempted', 'unsolved'])->default("unsolved");
            $table->enum("language", array_column(Language::cases(), 'value'))->nullable();
            $table->text("code")->nullable(true);
            $table->string("sol_url")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_problems');
    }
};
