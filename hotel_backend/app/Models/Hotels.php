<?php

namespace App\Models;

use App\Models\HotelsPhotos;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Hotels extends Model
{
    /** @use HasFactory<\Database\Factories\HotelsFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'address',
        'description',
        'email',
        'phone',
        'website',
        'city',
    ];
    static function getAllHotels(){
        $data = [];
        $hotels = Hotels::query()
            ->leftJoin('hotels_photos', 'hotels_photos.hotel_id', '=', 'hotels.id')
            ->distinct()
            ->get(['hotels.*']);

        foreach ($hotels as $hotel) {
            $tmpdata = [];
            $tmpphotos = HotelsPhotos::query()->where('hotel_id', $hotel->id)->get();
            $tmpdata["photos"] = $tmpphotos;
            $tmpdata["hotel"] = $hotel;

            array_push($data, $tmpdata);
        }

        return $data;
    }

    static function getHotelById(int $id){
        $photos = HotelsPhotos::query()->where('hotel_id', $id)->get();
        $hotel = Hotels::query()->find($id);

        return [["photos"=>$photos, "hotel"=>$hotel]];
    }

    static function getHotelsByName(string $name){
        $data = [];
        $hotels = Hotels::query()
            ->leftJoin('hotels_photos', 'hotels_photos.hotel_id', '=', 'hotels.id')
            ->where('hotels.name', 'like', "%$name%")
            ->distinct()
            ->get(['hotels.*']);

        foreach ($hotels as $hotel) {
            $tmpdata = [];
            $tmpphotos = HotelsPhotos::query()->where('hotel_id', $hotel->id)->get();
            $tmpdata["photos"] = $tmpphotos;
            $tmpdata["hotel"] = $hotel;

            array_push($data, $tmpdata);
        }

        return $data;
    }

    static function getHotelsByCity(string $city){
        $data = [];
        $hotels = Hotels::query()
            ->leftJoin('hotels_photos', 'hotels_photos.hotel_id', '=', 'hotels.id')
            ->where('hotels.city', '=', $city)
            ->distinct()
            ->get(['hotels.*']);

        foreach ($hotels as $hotel) {
            $tmpdata = [];
            $tmpphotos = HotelsPhotos::query()->where('hotel_id', $hotel->id)->get();
            $tmpdata["photos"] = $tmpphotos;
            $tmpdata["hotel"] = $hotel;

            array_push($data, $tmpdata);
        }

        return $data;
    }


    static function getHotelsByAddress(string $address){
        return Hotels::query()->where('address',"LIKE",  "%$address%")->get();
    }



    static function getHotelsByEmail(string $email){
        return Hotels::query()
            ->join('hotels_photos', 'hotels_photos.id','=', 'hotels.id')
            ->where('email', $email)->get();

    }

    static function getHotelsSortedByName(){
        return Hotels::all()->sortBy('name');
    }

    static function getHotelsSortedByCreationDate(){
        return Hotels::all()->sortBy('created_at');
    }

}
