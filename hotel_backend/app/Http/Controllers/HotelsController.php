<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StorehotelsRequest;
use App\Http\Requests\UpdatehotelsRequest;
use App\Models\Hotels;
use App\Models\HotelsPhotos;
use App\Models\User;
use Database\Factories\HotelsFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use function Laravel\Prompts\error;


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
        $hotel_id = $request->input('hotel_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$hotel_id){
            return response()->json(["error"=>"hotel_id is required"], 400);
        }
        try{
            $request->validate([
                'name' => 'string',
                'address' => 'string',
                'description' => 'nullable|string',
                'email' => 'email',
                'phone' => 'numeric',
                'website' => 'url',
                'city' => 'string',
            ]);
        }catch (ValidationException $exception){
            return response()->json([
                'message' => 'Validation failed!',
                'errors' => $exception->errors(),
            ], 422);
        }
        $targetHotel = Hotels::query()->find($hotel_id);
        if (!$targetHotel){
            return response()->json(["error"=>"no hotel with such id"], 400);
        }

        try{
            $targetHotel->update($request->only(['name', 'address', 'description', 'email', 'phone', 'website', 'city']));
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't modify hotel"], 500);
        }

        // try and save the uploaded photos if so
        try {
            $request->validate([
                'photos.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);
        }catch (ValidationException $exception){
            return response()->json([
                'message' => 'photos validation failed! but the data was updated',
                'error'=>$exception->errors(),
            ], 222);
        }
        $photos = $request->file('photos');
        $photoPaths = [];
        DB::beginTransaction();
        try{
            $dbAction = [];
            foreach ($photos as $photo) {
                $path = $photo->store('/', 'public');
                $photoPaths[] = $path;
            }
            foreach ($photoPaths as $photoPath){
                $dbAction[] = ["photo" => $photoPath, "hotel_id" => $targetHotel->id];
            }
            DB::table("hotels_photos")->insert($dbAction);
            DB::commit();
        }catch (\Exception $exception){
            DB::rollBack();
            return response()->json(["error"=>"can't save photos", 'error'=>$exception], 500);
        }
        return response()->json(["message" => "data was modified correctly"], 200);
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

    public function getAllHotelsLite(Request $request):JsonResponse{
        return  response()->json(Hotels::select(["id", "name"])->get(), 200);
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
        $data =  Hotels::getHotelById($hotel_id);
        return  response()->json($data, 200);
    }

    public function getHotelByName(Request $request):JsonResponse{
        $hotel_name = $request->json()->get('hotel_name');
        if (!$hotel_name){
            return response()->json(["error"=>"hotel_name is required"], 400);
        }
        $data =  Hotels::getHotelsByName($hotel_name);
        return  response()->json($data, 200);
    }

    public function getHotelsByCity(Request $request):JsonResponse{
        $hotel_city = $request->json()->get('hotel_city');
        if (!$hotel_city){
            return response()->json(["error"=>"hotel_city is required"], 400);
        }
        $data = Hotels::getHotelsByCity($hotel_city);
        return  response()->json($data, 200);
    }

    public function getHotelsByAddressLike(Request $request):JsonResponse{
        $hotel_address = $request->json()->get('hotel_address');
        if (!$hotel_address){
            return response()->json(["error"=>"hotel_address is required"], 400);
        }
        return response()->json(Hotels::getHotelsByAddress($hotel_address), 200);
    }

    public function getAllCities(Request $request):JsonResponse{
        $data = Hotels::all(["city"])->unique(['city']);
        return  response()->json($data, 200);
    }

}
