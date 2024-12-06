<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreclientsRequest;
use App\Http\Requests\UpdateclientsRequest;
use App\Models\clients;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientsController extends Controller
{

    public function getClients(Request $request)
    {
        return response()->json([
            'clients' => ['amin', "asdas", "dfadfsdf"]
        ]);
    }


    public function login(Request $request){
        function hash_password($password){
            return password_hash($password, PASSWORD_DEFAULT);
        }
        $validateUser = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required'
            ]
        );
        if ($validateUser->fails()) {
            return response()->json(["error"=>$validateUser->errors()]);
        }
        # GET THE USER WITH this account
        $user = User::where("email", "=",$request->get("email"), "AND","password","=", hash_password($request->get("password")))->first();
        if (!$user) {
            return response()->json(["error"=>"ux0"]);
        }

        return response()->json(["damn you email is "=>$user]);
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
