<?php

namespace App\Http\Controllers;
use App\Models\HotelsPhotos;
use App\Http\Controllers\utils\AuthorityCheckers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;



class HotelsPhotosController extends Controller
{
    public function deleteHotelPhotoById(Request $request): JsonResponse{
        $session_id = Auth::id();
        $user = User::query()->find($session_id);
        $photoId = $request->get('photo_id');
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["message" => "Unauthorized"], 401);
        }
        if (!$photoId){
            return response()->json(["message" => "No photo id was provided"], 400);
        }
        $photo = HotelsPhotos::query()->find($photoId);
        if (!$photo){
            return response()->json(["message" => "No photo with such id"], 400);
        }
        try{
            $photo->delete();
        }catch (\Exception $e){
            return response()->json(["error" => "can't delete this photo"], 400);
        }
        return response()->json(["message"=>"photo was deleted !"], 200);
    }
}
