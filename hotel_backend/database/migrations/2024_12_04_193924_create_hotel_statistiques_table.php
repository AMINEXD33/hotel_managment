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
        Schema::create('hotel_statistiques', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_hotel');
            $table->unsignedBigInteger('rooms_stats_id');
            $table->foreign('id_hotel')->references('id')->on('hotels')->onDelete('cascade');
            $table->integer('total_revenues')->default(0);
            $table->foreign('rooms_stats_id')->references("id")->on("rooms_statistiques")->onDelete('cascade');
            $table->integer('total_hotels')->default(0);
            $table->float('average_stars')->default(0.00);
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
        Schema::dropIfExists('hotel_statistiques');
    }
};
