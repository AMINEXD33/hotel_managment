<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservations extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationsFactory> */
    use HasFactory;
    protected $fillable = [
        "check_out_note",
        "room_stars",
        "hotel_stars"
    ];
}
