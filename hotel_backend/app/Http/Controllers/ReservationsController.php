<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StorereservationsRequest;
use App\Http\Requests\UpdatereservationsRequest;
use App\Models\reservations;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationsController extends Controller
{
    /**
     * A base function for all functions that will get reservations from the db
     * since most of the operations are based on procedures this function provides
     * the base for this kind of operations, but the function will not provide anything
     * if the user is not an admin
     * @param Request $request
     * @param string $procedure the target procedure
     * @param array $procedureArgs an array of args that are going to be passed to the procedure
     * @return JsonResponse
     */
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
            ], 500);
        }


        if (AuthorityCheckers::isAdmin($user)){
            return response()->json([
                'reservations' => [$reservations], 200
            ]);
        }
        return response()->json([
            'permission_error' => ["You don't have permission to take this action"],
            400
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
        $hotel = $request_data->get("hotel_id");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
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
        $hotel = $request_data->get("hotel_id");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],
                422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allOldReservationsInHotel", [$hotel]);
    }
    /**
     * A function that returns all reservations with a checkin that took place
     * after a specified date
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckInAfter(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $after = $request_data->get("after");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckInAfter", [$hotel, $after]);
    }

    /**
     * A function that returns all reservations with a checkin that took place
     * before a specified date
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckInBefore(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $before = $request_data->get("before");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckInBefore", [$hotel, $before]);
    }

    /**
     * A function that returns reservations with a checkin that took place
     * between two dates [left, right]
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckInBetween(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $left = $request_data->get("left");
        $right = $request_data->get("right");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWIthCheckInBetween", [$hotel, $left, $right]);
    }

    /**
     * A function that returns reservations with checkout that took
     * place after a specified date
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckOutAfter(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $after = $request_data->get("after");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBetween", [$hotel, $after]);
    }

    /**
     * a function that returns reservations with checkouts that took place
     * before a specified date
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckOutBefore(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $before = $request_data->get("before");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBefore", [$hotel, $before]);
    }

    /**
     * A function that returns reservations with checkouts that took place between
     * two dates [left , right]
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllReservationsWithCheckOutBetween(Request $request): JsonResponse
    {
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $left = $request_data->get("left");
        $right = $request_data->get("right");

        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"],422
            ]);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBetween", [$hotel, $left, $right]);
    }
}
