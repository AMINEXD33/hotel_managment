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
        Schema::create('rooms_statistiques', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_hotel');
            $table->unsignedBigInteger('id_room');
            $table->foreign('id_hotel')->references('id')->on('hotels')->onDelete('cascade');
            $table->foreign('id_room')->references('id')->on('rooms')->onDelete('cascade');
            $table->integer('total_reservations')->default(0);
            $table->float('avg_stars')->default(0.00);
            $table->float('min_stars')->default(0.00);
            $table->float('max_stars')->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms_statistiques');
    }
};
