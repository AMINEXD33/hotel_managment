<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreclientsRequest;
use App\Http\Requests\UpdateclientsRequest;
use App\Models\clients;
use App\Models\Reservations;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ClientsController extends Controller
{
    /** a function to check if a user is admin
     * @param User $user
     * @return bool
     */
    private function isAdmin(User $user):bool{
        if ($user->is_admin == 1){
            return true;
        }
        return false;
    }

    /** a function to check if a user is a normal user
     * @param User $user
     * @return bool
     */
    private function isUser(User $user):bool{
        if ($user->is_admin == 0){
            return true;
        }
        return false;
    }
    private function reservationsAdminBasse (Request $request, string $procedure, array $procedureArgs): JsonResponse {
        $userId = auth()->id();
        # we can add redis caching here
        $user = User::query()->find($userId);
        # expected args
        $expectedArgs = "?";

        for ($index = 0; $index < count($procedureArgs) - 1; $index++) {
            $expectedArgs .= ",?";
        }
        # get all reservations
        try{
            $reservations = DB::select("CALL $procedure($expectedArgs)", $procedureArgs);
        }catch(\Exception $exception){
            return response()->json([
                'error' => "the query is not right",
                'query'=>"CALL $procedure($expectedArgs)"
            ]);
        }


        if ($this->isAdmin($user)){
            return response()->json([
                'reservations' => [$reservations]
            ]);
        }
        return response()->json([
            'permission_error' => ["You don't have permission to take this action"],
        ]);
    }

    /**
     * get all active reservations in a hotel
     * @param Request $request the request
     * that means if it's meant for admins  or users or both admins|users
     * @return JsonResponse
     */
    public function getAllReservationsForHotel(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allActiveReservationsInHotel", [$hotel]);
    }
    /**
     * get all old (old means that they are removed from reservations table into historic)
     * reservations  in a hotel
     * @param Request $request the request
     * that means if it's meant for admins  or users or both admins|users
     * @return JsonResponse
     */
    public function getAllOldReservationsForHotel(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allOldReservationsInHotel", [$hotel]);
    }

    public function getAllReservationsWithCheckInAfter(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $after = $request_data->get("after");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckInAfter", [$hotel, $after]);
    }

    public function getAllReservationsWithCheckInBefore(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $before = $request_data->get("before");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckInBefore", [$hotel, $before]);
    }

    public function getAllReservationsWithCheckInBetween(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $left = $request_data->get("left");
        $right = $request_data->get("right");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWIthCheckInBetween", [$hotel, $left, $right]);
    }

    public function getAllReservationsWithCheckOutAfter(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $after = $request_data->get("after");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBetween", [$hotel, $after]);
    }

    public function getAllReservationsWithCheckOutBefore(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $before = $request_data->get("before");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBefore", [$hotel, $before]);
    }

    public function getAllReservationsWithCheckOutBetween(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel");
        $left = $request_data->get("left");
        $right = $request_data->get("right");

        if (!$hotel){
            return response()->json([
                'error' => ["no hotel was specified"],
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBetween", [$hotel, $left, $right]);
    }
    public function login(Request $request){
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $request->session()->regenerate();
            return response()->json([
                'response' => 'success',
            ]);
        }
        return response()->json(['error' => 'Unauthorized'], 401);
    }


    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function createClient(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $data = [
            $request_data->get("name"),
            $request_data->get("lastname"),
            $request_data->get("password"),
            $request_data->get("email"),
            $request_data->get("photo"),
        ];
        foreach ($data as $pieceOfData) {
            if (!$pieceOfData){
                return response()->json(["error" => ["please send all necessary data"]], 400);
            }
        }
        try{
            User::factory()->create([
                'name'=>$data[0],
                'lastname'=>$data[1],
                'password'=>Hash::make($data[2]),
                'email'=>$data[3],
                'photo'=>$data[4],
            ]);
        }catch (\Exception $e){
            return response()->json(["error" => "can't create a client with this data"], 400);
        }
        return response()->json(["msg" => "Client created successfully"], 200);
    }

    /**
     * A function to modify a Client's information
     * it only allows clients to modify their own information
     * if the request is coming from an admin then an admin can
     * modify with no limits
     * @param Request $request
     * @return JsonResponse
     */
    public function modifyClient(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $client_id = $request_data->get("client_id");
        $session_client_id = auth()->id();
        if (!$client_id){
            return response()->json(["error" => "client_id required"], 400);
        }
        $data = [
            "name" => $request_data->get("name"),
            "lastname" => $request_data->get("lastname"),
            "password" => $request_data->get("password"),
            "email" => $request_data->get("email"),
            "photo" => $request_data->get("photo"),
        ];

        $verified_data = [];
        foreach ($data as $key=>$value) {
            if ($value && $key == "password"){
                $verified_data[$key] = Hash::make($value);
            }
            else if ($value){
                $verified_data[$key] = $value;
            }
        }

        $sessionClient = User::query()->find($session_client_id);
        $client = User::query()->find($client_id);
        // we only catch the case where the modifier is not an admin and, it's not the
        // user itself that is trying to make a change
        echo "session_id = $session_client_id client_id = $client->id";
        if (!$client){
            return response()->json(["error" => "no client with such id"], 400);
        }
        if (($sessionClient->id != $client->id) and !($sessionClient->is_admin)){
            return response()->json(["error" => "you're not allowed to modify this user"], 400);
        }
        if (count($verified_data) > 0){
            try{
                $query = $client->newQuery()->where('id', $client->id)->update($verified_data);
            }catch (\Exception $e){
                return response()->json(["error" => "can't modify client with this data".$e], 400);
            }
        }
        return response()->json(["msg" => "Client modified successfully"], 200);
    }

    /**
     * A function that deletes a user
     *  it only allows clients to delete their own information
     *  if the request is coming from an admin then an admin can
     *  modify with no limits
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteClient(Request $request): JsonResponse{
        $request_data = $request->json();
        $client_id = $request_data->get("client_id");
        $session_client_id = auth()->id();
        if (!$client_id){
            return response()->json(["error" => "client_id required"], 400);
        }
        $sessionClient = User::query()->find($session_client_id);
        $client = User::query()->find($client_id);
        if (!$client){
            return response()->json(["error" => "no client with such id"], 400);
        }
        if (($sessionClient->id != $client->id) and !($sessionClient->is_admin)){
            return response()->json(["error" => "you're not allowed to delete this user"], 400);
        }
        try{
            $client->delete();
        }catch (\Exception $e){
            return response()->json(["error" => "can't delete a client for some reason"], 400);
        }
        return response()->json(["msg" => "Client deleted successfully"], 200);
    }
}
