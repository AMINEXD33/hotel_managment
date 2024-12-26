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

    static function getAllRooms(){
        $data = [];
        $rooms = Rooms::query()
            ->leftJoin("rooms_photos", "rooms.id", "=", "rooms_photos.room_id")
            ->distinct()
            ->get(["rooms.*"]);
        foreach ($rooms as $room){
            $tmpdata = [];
            $tmpphotos = Rooms_photos::query()->where("room_id", $room->id)->get();
            $tmpdata["photos"] = $tmpphotos;
            $tmpdata["room"] = $room;
            $data[] = $tmpdata;
        }
        return $data;
    }
}
