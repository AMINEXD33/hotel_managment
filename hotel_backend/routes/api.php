<?php

use App\Http\Controllers\HotelsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\RoomsController;
use \App\Http\Controllers\HotelsPhotosController;
use \App\Http\Controllers\RoomsPhotosController;
use \App\Http\Controllers\PaypalController;
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
Route::post('/register', [ClientsController::class, 'createClient']);
Route::post('/modifyClient', [ClientsController::class, 'modifyClient'])->middleware('auth:sanctum');
Route::post('/modifyUser', [ClientsController::class, 'modifyUser'])->middleware('auth:sanctum');

Route::post('/deleteClient', [ClientsController::class, 'deleteClient'])->middleware('auth:sanctum');
Route::post('/deleteUser',[ClientsController::class, 'deleteUser'])->middleware('auth:sanctum');

Route::post('/changeUserAuthority', [ClientsController::class, 'changeUserAuthority']);
Route::get('/getAllClients', [ClientsController::class, 'getAllClients']);
Route::post('/getAllAdmins', [ClientsController::class, 'getAllAdmins']);
Route::get('/getAllUsers', [ClientsController::class, 'getAllUsers']);

Route::post('/getClientById', [ClientsController::class, 'getClientById']);
Route::post('/getAdminById', [ClientsController::class, 'getAdminById']);

Route::post('/getClientByEmail', [ClientsController::class, 'getClientByEmail']);
Route::post('/getAdminByEmail', [ClientsController::class, 'getAdminByEmail']);



// CRUD hotels
Route::post('/createHotel', [HotelsController::class, 'createHotel'])->middleware('auth:sanctum');
Route::post('/deleteHotel', [HotelsController::class, 'deleteHotel'])->middleware('auth:sanctum');
Route::post('/modifyHotel', [HotelsController::class, 'modifyHotel'])->middleware('auth:sanctum');

Route::get('/getAllHotelsLite', [HotelsController::class, 'getAllHotelsLite']);
Route::get('/getAllHotels', [HotelsController::class, 'getAllHotels']);
Route::post('/getHotelById', [HotelsController::class, 'getHotelById']);
Route::post('/getHotelByName', [HotelsController::class, 'getHotelByName']);
Route::post('/getHotelsByCity', [HotelsController::class, 'getHotelsByCity']);
Route::get('/getHotelsByAddressLike', [HotelsController::class, 'getHotelsByAddressLike']);
Route::get('/getAllCities', [HotelsController::class, 'getAllCities']);

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

Route::get("/getRoomsUser", [RoomsController::class, 'getRoomsUser'])->middleware('auth:sanctum');

// analitics functions
Route::get('/classedHotelsByReservationsCount', [ReservationsController::class, 'classedHotelsByReservationsCount'])->middleware('auth:sanctum');
Route::get('/classedHotelsByReservationsRating', [ReservationsController::class, 'classedHotelsByReservationsRating'])->middleware('auth:sanctum');
Route::post('/classedRoomsByReservationsCount', [ReservationsController::class, 'classedRoomsByReservationsCount'])->middleware('auth:sanctum');
Route::post('/classedRoomsByReservationsRating', [ReservationsController::class, 'classedRoomsByReservationsRating'])->middleware('auth:sanctum');

Route::post('/reservationsCountByYear', [ReservationsController::class, 'reservationsCountByYear'])->middleware('auth:sanctum');
Route::post('/reservationsCountByMonth', [ReservationsController::class, 'reservationsCountByMonth'])->middleware('auth:sanctum');

Route::post('/generateAnaliticsMounthlyRevenues', [ReservationsController::class, 'generateAnaliticsMounthlyRevenues'])->middleware('auth:sanctum');
Route::post('/generateAnaliticsYearlyRevenues', [ReservationsController::class, 'generateAnaliticsYearlyRevenues'])->middleware('auth:sanctum');

// utility
Route::get('/getAvailableYears', [ReservationsController::class, 'getAvailableYears'])->middleware('auth:sanctum');



// hotels photos
Route::post('/deleteHotelPhotoById', [HotelsPhotosController::class, 'deleteHotelPhotoById'])->middleware('auth:sanctum');


// rooms photos
Route::post('/getRoomPhotosById', [RoomsPhotosController::class, 'getRoomPhotosById'])->middleware('auth:sanctum');
Route::post('/deleteRoomPhotoById', [RoomsPhotosController::class, 'deleteRoomPhotoById'])->middleware('auth:sanctum');


// reservations
Route::get("/getAllReservations", [ReservationsController::class, 'getAllReservations'])->middleware('auth:sanctum');
Route::post("/cancelReservationAdmin", [ReservationsController::class, 'cancelReservationAdmin'])->middleware('auth:sanctum');



// PAYPAL
Route::post('/paypal/create-order', [PaypalController::class, 'createOrder'])->name('createOrder');
Route::post('/paypal/capture-order', [PaypalController::class, 'captureOrder'])->name('captureOrder')->middleware('auth:sanctum');


Route::get('/paypal/success', [PaypalController::class, 'successOrder'])->name('success.order')->middleware('auth:sanctum');
Route::get('/paypal/cancel', [PaypalController::class, 'cancelOrder'])->name('cancel.order')->middleware('auth:sanctum');

