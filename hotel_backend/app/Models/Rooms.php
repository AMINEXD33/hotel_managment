<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    /** @use HasFactory<\Database\Factories\RoomsFactory> */
    use HasFactory;
    protected  $fillable = [
            "id_hotel",
            "type",
            "suites",
            "price",
            "beds",
            "baths",
            "description"
    ];
}
