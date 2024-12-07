<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hotels;
use App\Models\Rooms;
class HotelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hotels::factory()->create(['id' => 1]);
        Hotels::factory()->create(['id' => 2]);

        Rooms::factory()->create(['id'=>'1','id_hotel' => 1]);
        Rooms::factory()->create(['id'=>'2','id_hotel' => 1]);
        Rooms::factory()->create(['id'=>'3','id_hotel' => 1]);


        Rooms::factory()->create(['id'=>'4','id_hotel' => 2]);
        Rooms::factory()->create(['id'=>'5','id_hotel' => 2]);
        Rooms::factory()->create(['id'=>'6','id_hotel' => 2]);


    }
}
