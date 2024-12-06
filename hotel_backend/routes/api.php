<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientsController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/users', [ClientsController::class, 'getClients'])->middleware('auth:sanctum');;
Route::post('/login', [ClientsController::class, 'login']);
