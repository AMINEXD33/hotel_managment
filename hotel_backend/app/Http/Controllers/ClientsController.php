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
use App\Http\Controllers\utils\AuthorityCheckers;


class ClientsController extends Controller
{

    /**
     * A function to log in any user
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse{
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

    /**
     * A function to log out any user
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request):JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * A function that creates a new client
     * @param Request $request
     * @return JsonResponse
     */
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

    public function getAllClients(Request $request): JsonResponse{
        $session_client_id = auth()->id();
        $user = User::query()->find($session_client_id);
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["error" => "you don't have permission"], 403);
        }
        return response()->json(User::all()->where("is_admin", false), 200);
    }

    public function getAllAdmins(Request $request): JsonResponse{
        $check = AuthorityCheckers::isUserAdmin();
        if (!$check){
            return response()->json(["error" => "you don't have permission"], 403);
        }
        return response()->json(User::all()->where("is_admin", true), 200);
    }

    public function getClientById(Request $request): JsonResponse{
        $check = AuthorityCheckers::isUserAdmin();
        if (!$check){
            return response()->json(["error" => "you don't have permission"], 403);
        }

        $request_data = $request->json();
        $client_id = $request_data->get("client_id");

        if (!$client_id){
            return response()->json(["error" => "client_id required"], 400);
        }
        # a client has is_admin false, so even if we search for a valid id and it happens to be an admin
        # we don't want that result
        $client = User::query()->where("is_admin", false)->where("id", $client_id)->first();
        echo "here";
        if (!$client){
            return response()->json(["error" => "no client with such id"], 400);
        }
        return response()->json($client, 200);
    }

    public function getAdminById(Request $request): JsonResponse{
        $check = AuthorityCheckers::isUserAdmin();
        if (!$check){
            return response()->json(["error" => "you don't have permission"], 403);
        }

        $request_data = $request->json();
        $admin_id = $request_data->get("admin_id");

        if (!$admin_id){
            return response()->json(["error" => "admin_id required"], 400);
        }
        # an admin has is_admin true, so even if we search for a valid id ,and it happens to be a normal user
        # we don't want that result
        $admin = User::query()->where("is_admin", true)->where("id", $admin_id)->first();
        echo "here";
        if (!$admin){
            return response()->json(["error" => "no admin with such id"], 400);
        }
        return response()->json($admin, 200);
    }

    public function getClientByEmail(Request $request): JsonResponse{
        $check = AuthorityCheckers::isUserAdmin();
        if (!$check){
            return response()->json(["error" => "you don't have permission"], 403);
        }
        $request_data = $request->json();
        $email = $request_data->get("email");
        $client = User::query()->where("is_admin", false)->where("email", $email)->first();
        return response()->json($client, 200);
    }
    public function getAdminByEmail(Request $request): JsonResponse{
        $check = AuthorityCheckers::isUserAdmin();
        if (!$check){
            return response()->json(["error" => "you don't have permission"], 403);
        }
        $request_data = $request->json();
        $email = $request_data->get("email");
        $admin = User::query()->where("is_admin", true)->where("email", $email)->first();
        return response()->json($admin, 200);
    }

}
