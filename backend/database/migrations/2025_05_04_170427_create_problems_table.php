<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Platform;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string("name");
            $table->string("url")->unique();
            $table->enum("difficulty", ['easy', 'medium', 'hard']);
            $table->foreignIdFor(Platform::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
