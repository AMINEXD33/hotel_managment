<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreclientsRequest;
use App\Http\Requests\UpdateclientsRequest;
use App\Models\clients;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
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

    public function getClients(Request $request, $auth="admins")
    {
        $userId = auth()->id();
        # we can add redis caching here
        $user = User::query()->find($userId);
        if ($this->isAdmin($user)){
            return response()->json([
                'clients' => ['amin', "asdas", "dfadfsdf"]
            ]);
        }
        return response()->json([
            'permission_error' => ["You don't have permission to take this action"],
        ]);
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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreclientsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(clients $clients)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(clients $clients)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateclientsRequest $request, clients $clients)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(clients $clients)
    {
        //
    }
}
