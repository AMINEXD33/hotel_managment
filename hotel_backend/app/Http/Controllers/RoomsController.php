<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StoreroomsRequest;
use App\Http\Requests\UpdateroomsRequest;
use App\Models\HotelsPhotos;
use App\Models\Rooms;
use App\Models\Rooms_photos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class RoomsController extends Controller
{
    public function createRoom(Request $request):JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        try{
            $request->validate([
                "id_hotel"=>"required|integer",
                "type"=>"required|in:single,double,triple,quadruple",
                "suites"=>"required|in:normal,junior,executive,presidential",
                "price"=>"numeric|required|min:1",
                "beds"=>"integer|min:1|required",
                "baths"=>"integer|min:1|required",
                "description"=>"nullable|string",
            ]);
        }catch(ValidationException $exception){
            return response()->json([
                'message' => 'Validation failed!',
                'errors' => $exception->errors(),
            ], 422);
        }

        try{
            $validated_data = [
                "id_hotel"=>$request->input('id_hotel'),
                "type"=>$request->input('type'),
                "suites"=>$request->input('suites'),
                "price"=>$request->input('price'),
                "beds"=>$request->input('beds'),
                "baths"=>$request->input('baths'),
                "description"=>$request->input('description'),
            ];
            $room = Rooms::query()->create($validated_data);
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't create room"], 500);
        }

       if ($request->file('photos')) {
           // try and save the uploaded photos if so
           try {
               $request->validate([
                   'photos.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
               ]);
           } catch (ValidationException $exception) {
               return response()->json([
                   'message' => 'photos validation failed! but the room was created',
                   'error' => $exception->errors(),
               ], 222);
           }

           try {
               DB::beginTransaction();
               $photos = $request->file('photos');
               $photoPaths = [];
               $dbAction = [];
               foreach ($photos as $photo) {
                   $path = $photo->store('/', 'public');
                   $photoPaths[] = $path;
               }
               foreach ($photoPaths as $photoPath) {
                    $dbAction[] = ["photo" => $photoPath, "room_id" => $room->id, "hotel_id" => $room->id_hotel];
               }
               DB::table("rooms_photos")->insert($dbAction);
               DB::commit();
           } catch (\Exception $exception) {
               DB::rollBack();
               return response()->json(["error" => "can't save photos", 'message' => $exception], 500);
           }
       }
        return response()->json($room, 200);
    }

    public function updateRoom(Request $request):JsonResponse{
        $room_id = $request->input("room_id");
        if (!$room_id){
            return response()->json(["error" => "room_id is required"], 404);
        }

        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $room = Rooms::query()->find($room_id);
        if (!$room){
            return response()->json(["error" => "no room with such id"], 404);
        }

        try{
            $validated_data = [
                "id_hotel"=>$request->input('id_hotel'),
                "type"=>$request->input('type'),
                "suites"=>$request->input('suites'),
                "price"=>$request->input('price'),
                "beds"=>$request->input('beds'),
                "baths"=>$request->input('baths'),
                "description"=>$request->input('description'),
            ];
            $roomupdate = $room->update($validated_data);
        }catch (\Exception $exception){
            return response()->json(["error"=>"can't create room"], 500);
        }

        if ($request->file('photos')) {
            // try and save the uploaded photos if so
            try {
                $request->validate([
                    'photos.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
                ]);
            } catch (ValidationException $exception) {
                return response()->json([
                    'message' => 'photos validation failed! but the room was updated',
                    'error' => $exception->errors(),
                ], 222);
            }
            try{
                DB::beginTransaction();
                $photos = $request->file('photos');
                $photoPaths = [];
                $dbAction = [];
                foreach ($photos as $photo) {
                    $path = $photo->store('/', 'public');
                    $photoPaths[] = $path;
                }
                foreach ($photoPaths as $photoPath) {
                    $dbAction[] = ["photo" => $photoPath, "room_id" => $room->id, "hotel_id" => $room->id_hotel];
                }
                DB::table("rooms_photos")->insert($dbAction);
                DB::commit();
            } catch (\Exception $exception) {
                DB::rollBack();
                return response()->json(["error" => "can't save photos", 'message' => $exception], 500);
            }
        }
        return response()->json(["success" => "room updated"], 200);
    }


    public function deleteRoom(Request $request):JsonResponse{
        $room_id = $request->json()->get("room_id");
        if (!$room_id){
            return response()->json(["error" => "room_id is required"], 404);
        }
        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $room = Rooms::query()->find($room_id);

        if (!$room){
            return response()->json(["error" => "no room with such id"], 404);
        }
        try{
            $room->delete();
        }catch (\Exception $exception){
            return response()->json(["error" => "can't delete room"], 401);
        }

        try{
            $roomPhotos = Rooms_photos::all()->where('room_id', $room_id);
            foreach ($roomPhotos as $roomPhoto){
                $roomPhoto->delete();
                if (file_exists($roomPhoto->photo)) {
                    unlink($roomPhoto->photo); // Delete the file
                }
            }
        }catch (\Exception $exception){
            return response()->json(["error" => "can't delete room photos but the room was deleted !"], 401);
        }
        return response()->json(["success" => "room deleted"], 200);
    }


    public function getAllRooms(Request $request):JsonResponse{


        return response()->json(Rooms::all(), 200);
    }

    public function getRoomById(Request $request):JsonResponse{
        $room_id = $request->json()->get("room_id");
        if (!$room_id){
            return response()->json(["error" => "room_id is required"], 404);
        }
        $room = Rooms::query()->find($room_id);
        if (!$room){
            return response()->json(["error" => "no room with such id"], 404);
        }
        return response()->json($room, 200);
    }

    public function getAllReservedRooms(Request $request):JsonResponse{

        return response()->json(Rooms::getAllRooms(), 200);
    }

    public function getAllUnReservedRooms(Request $request):JsonResponse{
        return response()->json(Rooms::all()->where("available", true), 200);
    }

    public function getRoomsUser(Request $request):JsonResponse{
        $rooms = Rooms::query()
            ->join("hotels", "hotels.id", "=", "id_hotel")
            ->select("rooms.*", "hotels.name", "hotels.address", "hotels.phone", "hotels.email", "hotels.city")
            ->get();
        $data = [];
        $room_photos = [];
        foreach ($rooms as $room){
            $room_photos = Rooms_photos::query()->where('room_id', $room->id)->get();
            $hotel_photos = HotelsPhotos::query()->where('hotel_id', $room->id_hotel)->get();
            $tmp = [];
            $tmp['room'] = $room;
            $tmp['room_photos'] = $room_photos;
            $tmp['hotel_photos'] = $hotel_photos;
            $data[] = $tmp;
        }
        return response()->json($data, 200);
    }



}
