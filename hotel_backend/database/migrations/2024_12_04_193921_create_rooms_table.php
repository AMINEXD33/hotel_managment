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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_hotel');
            $table->foreign("id_hotel")->references("id")->on("hotels")->onDelete("cascade");
            $table->enum("type", ["single", "double", "triple", "quadruple"]);
            $table->enum("suites", ["normal", "junior", "executive", "presidential"]);
            $table->float("price")->nullable(false);
            $table->boolean("available")->default(true);
            $table->integer("beds")->nullable(false);
            $table->integer("baths")->nullable(false);
            $table->text("description")->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
