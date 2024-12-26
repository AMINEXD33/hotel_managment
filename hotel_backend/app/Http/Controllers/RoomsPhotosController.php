<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\Storerooms_photosRequest;
use App\Http\Requests\Updaterooms_photosRequest;
use App\Models\HotelsPhotos;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Rooms_photos;
class RoomsPhotosController extends Controller
{
    public function deleteRoomPhotoById(Request $request): JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        $photoId = $request->get('photo_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$photoId){
            return response()->json(["message" => "No photo_id was provided"], 400);
        }

        $photo = Rooms_photos::query()->find($photoId);
        if (!$photo){
            return response()->json(["message" => "No photo with such id"], 400);
        }
        $err_queue = [];
        try{
            if (file_exists($photo->photo)) {
                unlink($photo->photo); // Delete the file
            }else{
                $err_queue[] = "File does not exist";
            }
            $photo->delete();
        }catch (\Exception $e){
            return response()->json(["error" => "can't delete this photo"], 400);
        }
        return response()->json(["message"=>"photo was deleted !", "deleted"=>$err_queue], 200);
    }

    public function getRoomPhotosById(Request $request): JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        $roomId = $request->get('room_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$roomId){
            return response()->json(["message" => "No room_id was provided"], 400);
        }
        try{
            $photo = Rooms_photos::query()->where("room_id",$roomId)->get();
        }catch (\Exception $e){
            return response()->json(["error" => "can't get photos", "accual_error"=>$e->getMessage()], 400);
        }

        return response()->json($photo, 200);
    }
}
