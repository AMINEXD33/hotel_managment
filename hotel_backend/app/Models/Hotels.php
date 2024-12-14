<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return Hotels::all();
    }

    static function getHotelById(int $id){
        return Hotels::query()->find($id);
    }

    static function getHotelsByName(string $name){
        return Hotels::query()->where('name', $name)->get();
    }

    static function getHotelsByCity(string $city){
        return Hotels::query()->where('city', $city)->get();
    }


    static function getHotelsByAddress(string $address){
        return Hotels::query()->where('address',"LIKE",  "%$address%")->get();
    }



    static function getHotelsByEmail(string $email){
        return Hotels::query()->where('email', $email)->get();
    }

    static function getHotelsSortedByName(){
        return Hotels::all()->sortBy('name');
    }

    static function getHotelsSortedByCreationDate(){
        return Hotels::all()->sortBy('created_at');
    }

}
