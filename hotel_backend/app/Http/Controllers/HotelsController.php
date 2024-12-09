<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StorehotelsRequest;
use App\Http\Requests\UpdatehotelsRequest;
use App\Models\Hotels;
use App\Models\User;
use Database\Factories\HotelsFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class HotelsController extends Controller
{
    public function createHotel(Request $request):JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        $data = $request->json()->all();
        $validationRules = [
            'name' => 'required|string',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'website' => 'nullable|url',
            'city' => 'required|string',
        ];
        $validator = Validator::make($data, $validationRules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        try{
            $hotel = Hotels::factory()->create($validator->validated());
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't create hotel"], 500);
        }
        return response()->json($hotel, 200);
    }

    public function modifyHotel(Request $request):JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        $data = $request->json()->all();
        $hotel_id = $request->json()->get('hotel_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$hotel_id){
            return response()->json(["error"=>"hotel_id is required"], 400);
        }
        $validationRules = [
            'name' => 'string',
            'address' => 'string',
            'description' => 'nullable|string',
            'email' => 'email',
            'phone' => 'numeric',
            'website' => 'url',
            'city' => 'string',
        ];
        $validator = Validator::make($data, $validationRules);
        $targetHotel = Hotels::query()->find($hotel_id);
        if (!$targetHotel){
            return response()->json(["error"=>"no hotel with such id"], 400);
        }
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        try{
            print_r($validator->validated());
            $targetHotel->update($validator->validated());
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't modify hotel"], 500);
        }
        return response()->json(["message" => $validator->validated()], 200);
    }

    public function deleteHotel(Request $request):JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        $hotel_id = $request->json()->get('hotel_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$hotel_id){
            return response()->json(["error"=>"hotel_id is required"], 400);
        }

        $hotel = Hotels::query()->find($hotel_id);
        if (!$hotel){
            return response()->json(["error"=>"no hotel with such id"], 400);
        }
        try{
            $hotel->delete();
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't delete hotel"], 500);
        }
        return response()->json(["message" => "Hotel deleted successfully"], 200);
    }

    public function getAllHotels(Request $request):JsonResponse{
        return  response()->json(Hotels::getAllHotels(), 200);
    }

    public function getHotelById(Request $request):JsonResponse{
        $hotel_id = $request->json()->get('hotel_id');
        if (!$hotel_id){
            return response()->json(["error"=>"hotel_id is required"], 400);
        }
        try{
            Hotels::getHotelById($hotel_id);
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't get hotel"], 500);
        }

        return  response()->json(Hotels::getHotelById($hotel_id), 200);
    }

    public function getHotelByName(Request $request):JsonResponse{
        $hotel_name = $request->json()->get('hotel_name');
        if (!$hotel_name){
            return response()->json(["error"=>"hotel_name is required"], 400);
        }
        return  response()->json(Hotels::getHotelsByName($hotel_name), 200);
    }

    public function getHotelsByCity(Request $request):JsonResponse{
        $hotel_city = $request->json()->get('hotel_city');
        if (!$hotel_city){
            return response()->json(["error"=>"hotel_city is required"], 400);
        }
        return  response()->json(Hotels::getHotelsByCity($hotel_city), 200);
    }

    public function getHotelsByAddressLike(Request $request):JsonResponse{
        $hotel_address = $request->json()->get('hotel_address');
        if (!$hotel_address){
            return response()->json(["error"=>"hotel_address is required"], 400);
        }
        return response()->json(Hotels::getHotelsByAddress($hotel_address), 200);
    }

}
