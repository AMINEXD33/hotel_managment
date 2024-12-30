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
        Schema::create('paiment_attepmts', function (Blueprint $table) {
            $table->id();
            $table->string('paiment_id');
            $table->unsignedBigInteger('id_room');
            $table->dateTime("check_in");
            $table->dateTime("check_out");
            $table->unsignedBigInteger("total");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiment_attepmts');
    }
};
