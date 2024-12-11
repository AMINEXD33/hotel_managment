<?php

use App\Http\Controllers\HotelsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\RoomsController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// some function to get reservations
Route::get('/hotelAliveReservation', [ReservationsController::class, 'getAllReservationsForHotel'])->middleware('auth:sanctum');
Route::get('/hotelOldReservation', [ReservationsController::class, 'getAllOldReservationsForHotel'])->middleware('auth:sanctum');

// some function to filter reservation using check_in date aliveReservations + oldReservations
Route::get('/hotelReservationsCheckinAfter', [ReservationsController::class, 'getAllReservationsWithCheckInAfter'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckinBefore', [ReservationsController::class, 'getAllReservationsWithCheckInBefore'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckinBetween', [ReservationsController::class, 'getAllReservationsWithCheckInBetween'])->middleware('auth:sanctum');


// some function to filter reservation using check_out date aliveReservations + oldReservations
Route::get('/hotelReservationsCheckoutAfter', [ReservationsController::class, 'getAllReservationsWithCheckOutAfter'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckoutBefore', [ReservationsController::class, 'getAllReservationsWithCheckOutBefore'])->middleware('auth:sanctum');
Route::get('/hotelReservationsCheckoutBetween', [ReservationsController::class, 'getAllReservationsWithCheckOutBetween'])->middleware('auth:sanctum');


// CRUD  clients
Route::post('/createClient', [ClientsController::class, 'createClient']);
Route::post('/modifyClient', [ClientsController::class, 'modifyClient'])->middleware('auth:sanctum');
Route::post('/deleteClient', [ClientsController::class, 'deleteClient'])->middleware('auth:sanctum');

Route::post('/getAllClients', [ClientsController::class, 'getAllClients']);
Route::post('/getAllAdmins', [ClientsController::class, 'getAllAdmins']);

Route::post('/getClientById', [ClientsController::class, 'getClientById']);
Route::post('/getAdminById', [ClientsController::class, 'getAdminById']);

Route::post('/getClientByEmail', [ClientsController::class, 'getClientByEmail']);
Route::post('/getAdminByEmail', [ClientsController::class, 'getAdminByEmail']);



// CRUD hotels
Route::post('/createHotel', [HotelsController::class, 'createHotel'])->middleware('auth:sanctum');
Route::post('/deleteHotel', [HotelsController::class, 'deleteHotel'])->middleware('auth:sanctum');
Route::post('/modifyHotel', [HotelsController::class, 'modifyHotel'])->middleware('auth:sanctum');

Route::get('/getAllHotels', [HotelsController::class, 'getAllHotels']);
Route::get('/getHotelById', [HotelsController::class, 'getHotelById']);
Route::get('/getHotelByName', [HotelsController::class, 'getHotelByName']);
Route::get('/getHotelsByCity', [HotelsController::class, 'getHotelsByCity']);
Route::get('/getHotelsByAddressLike', [HotelsController::class, 'getHotelsByAddressLike']);


// CRUD rooms
Route::post('/createRoom', [RoomsController::class, 'createRoom']);
Route::post('/deleteRoom', [RoomsController::class, 'deleteRoom']);
Route::post('/updateRoom', [RoomsController::class, 'updateRoom']);

Route::get('/getAllRooms', [RoomsController::class, 'getAllRooms']);
Route::get('/getRoomById', [RoomsController::class, 'getRoomById']);
Route::get('/getAllReservedRooms', [RoomsController::class, 'getAllReservedRooms']);
Route::get('/getAllUnReservedRooms', [RoomsController::class, 'getAllUnReservedRooms']);

Route::post('/login', [ClientsController::class, 'login']);
Route::get('/logout', [ClientsController::class, 'logout']);
Route::get('/checkauth', [ClientsController::class, 'checkauth'])->middleware('auth:sanctum');


