<?php

use App\Http\Controllers\HotelsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientsController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// some function to get reservations
Route::get('/hotelAliveReservation', [ClientsController::class, 'getAllReservationsForHotel'])->middleware('auth:sanctum');
Route::get('/hotelOldReservation', [ClientsController::class, 'getAllOldReservationsForHotel'])->middleware('auth:sanctum');

// some function to filter reservation using check_in date aliveReservations + oldReservations
Route::get('/hotelReservationsCheckinAfter', [ClientsController::class, 'getAllReservationsWithCheckInAfter'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckinBefore', [ClientsController::class, 'getAllReservationsWithCheckInBefore'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckinBetween', [ClientsController::class, 'getAllReservationsWithCheckInBetween'])->middleware('auth:sanctum');


// some function to filter reservation using check_out date aliveReservations + oldReservations
Route::get('/hotelReservationsCheckoutAfter', [ClientsController::class, 'getAllReservationsWithCheckOutAfter'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckoutBefore', [ClientsController::class, 'getAllReservationsWithCheckOutBefore'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckoutBetween', [ClientsController::class, 'getAllReservationsWithCheckOutBetween'])->middleware('auth:sanctum');


// CRUD  clients
Route::post('/createClient', [ClientsController::class, 'createClient'])->middleware('auth:sanctum');
Route::post('/modifyClient', [ClientsController::class, 'modifyClient'])->middleware('auth:sanctum');
Route::post('/deleteClient', [ClientsController::class, 'deleteClient'])->middleware('auth:sanctum');



Route::post('/login', [ClientsController::class, 'login']);
Route::get('/logout', [ClientsController::class, 'logout']);
