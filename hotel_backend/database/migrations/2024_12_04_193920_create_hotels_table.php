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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name', length: 200)->nullable(false);
            $table->string('address', length: 400)->nullable(false);
            $table->text('description')->nullable(false);;
            $table->string('email', length: 200)->nullable(false);
            $table->string("phone", length: 200)->nullable(false);
            $table->string("website", length: 200)->nullable(false);
            $table->string("city", length: 200)->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
