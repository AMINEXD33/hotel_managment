<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\rooms>
 */
class RoomsFactory extends Factory
{
    /**
     * Define the model's default state.
     *$table->id();
     * $table->unsignedBigInteger('id_hotel');
     * $table->foreign("id_hotel")->references("id")->on("hotels")->onDelete("cascade");
     * $table->enum("type", ["single", "double", "triple", "quadruple"]);
     * $table->enum("suites", ["normal", "junior", "executive", "presidential"]);
     * $table->float("price")->nullable(false);
     * $table->boolean("available")->default(true);
     * $table->integer("beds")->nullable(false);
     * $table->integer("baths")->nullable(false);
     * $table->text("description")->nullable(false);
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "type" => $this->faker->randomElement(["single", "double"]),
            "suites" => $this->faker->randomElement(["normal", "junior"]),
            "price" => $this->faker->randomFloat(2, 10, 100),
            "available" => true,
            "beds" => 2,
            "baths" => 2,
            "description" => $this->faker->paragraph(),
        ];
    }
}
