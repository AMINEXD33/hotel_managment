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
        Schema::create('historique_reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_room');
            $table->unsignedBigInteger('id_customer');
            $table->foreign("id_room")->references("id")->on("rooms")->noActionOnDelete();
            $table->foreign("id_customer")->references("id")->on("users")->noActionOnDelete();
            $table->dateTime("check_in")->nullable(false);
            $table->dateTime("check_out")->nullable(false);
            $table->text("check_out_note")->nullable(true);
            $table->text("check_in_note")->nullable(true);
            $table->float("room_stars")->nullable(true);
            $table->float("total_price")->default(0);
            $table->float("hotel_stars")->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_reservations');
    }
};
