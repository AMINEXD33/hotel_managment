<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StoreroomsRequest;
use App\Http\Requests\UpdateroomsRequest;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RoomsController extends Controller
{
    public function createRoom(Request $request):JsonResponse{
        $validation_rules = [
            "id_hotel"=>"required|integer",
            "type"=>"required|in:single,double,triple,quadruple",
            "suites"=>"required|in:normal,junior,executive,presidential",
            "price"=>"integer|required|min:1",
            "beds"=>"integer|min:1|required",
            "baths"=>"integer|min:1|required",
            "description"=>"nullable|string",
        ];
        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $validator = Validator::make($request->all(), $validation_rules);
        if ($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        try{
            Rooms::factory()->create($validator->validated());
        }catch (\Exception $exception){
            return response()->json(["error" => "can't create room with such data"], 401);
        }
        return response()->json(["success" => "room created"], 200);
    }

    public function updateRoom(Request $request):JsonResponse{
        $room_id = $request->json()->get("room_id");
        if (!$room_id){
            return response()->json(["error" => "room_id is required"], 404);
        }
        $validation_rules = [
            "id_hotel"=>"integer",
            "type"=>"in:single,double,triple,quadruple",
            "suites"=>"in:normal,junior,executive,presidential",
            "price"=>"integer|min:1",
            "beds"=>"integer|min:1",
            "baths"=>"integer|min:1",
            "description"=>"nullable|string",
        ];
        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $room = Rooms::query()->find($room_id);
        if (!$room){
            return response()->json(["error" => "no room with such id"], 404);
        }
        $validator = Validator::make($request->all(), $validation_rules);
        if ($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        try{
            $room->update($validator->validated());
        }catch (\Exception $exception){
            return response()->json(["error" => "can't update room with such data", "ss"=>$exception->getMessage()], 401);
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
        return response()->json(Rooms::all()->where("available", false), 200);
    }

    public function getAllUnReservedRooms(Request $request):JsonResponse{
        return response()->json(Rooms::all()->where("available", true), 200);
    }
}
