<?php

namespace App\Http\Controllers;

use App\Http\Controllers\utils\AuthorityCheckers;
use App\Http\Requests\StorereservationsRequest;
use App\Http\Requests\UpdatereservationsRequest;
use App\Models\historique_reservations;
use App\Models\Reservations;
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

        $expectedArgs = "";
        if (count($procedureArgs) > 0){
            $expectedArgs = "?";
        }
        for ($index = 0; $index < count($procedureArgs) - 1; $index++) {
            $expectedArgs .= ",?";
        }
        # get all reservations
        try{
            $reservations = DB::select("CALL $procedure($expectedArgs)", $procedureArgs);
        }catch(\Exception $exception){
            return response()->json([
                'error' => "the query is not right",
                'message' => $exception->getMessage()
            ], 500);
        }


        if (AuthorityCheckers::isAdmin($user)){
            return response()->json([
                'reservations' => $reservations
            ], 200);
        }
        return response()->json([
            'permission_error' => ["You don't have permission to take this action"],

        ], 400);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
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

            ],422);
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
                'error' => ["no hotel_id was specified"]
            ],422);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutAfter", [$hotel, $after]);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
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
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "allReservationsWithCheckOutBetween", [$hotel, $left, $right]);
    }


    public function classedHotelsByReservationsCount(Request $request): JsonResponse{
        return $this->reservationsAdminBasse($request, "classHotelsByReservationsCount", []);
    }
    public function classedHotelsByReservationsRating(Request $request): JsonResponse{
        return $this->reservationsAdminBasse($request, "classHotelsByReservationsRatings", []);
    }
    public function classedRoomsByReservationsCount(Request $request): JsonResponse{
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "classRoomsByReservationCount", [$hotel]);
    }
    public function classedRoomsByReservationsRating(Request $request): JsonResponse{
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "classRoomsByReservationStars", [$hotel]);
    }

    public function reservationsCountByYear(Request $request): JsonResponse{
        $request_data = $request->json();
        $year = $request_data->get("year");
        if (!$year){
            return response()->json([
                'error' => ["no year was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "reservationsCountByYear", [$year]);

    }
    public function reservationsCountByMonth(Request $request): JsonResponse{
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $year = $request_data->get("year");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        else if (!$year){
            return response()->json([
                'error' => ["no year was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "reservationsCountByMonth", [$hotel, $year]);
    }

    public function getAvailableYears(Request $request):JsonResponse{
        return $this->reservationsAdminBasse($request, "getAvailableYears", []);
    }


    public function generateAnaliticsMounthlyRevenues(Request $request): JsonResponse{
        $request_data = $request->json();
        $hotel = $request_data->get("hotel_id");
        $year = $request_data->get("year");
        if (!$hotel){
            return response()->json([
                'error' => ["no hotel_id was specified"]
            ], 422);
        }
        else if (!$year){
            return response()->json([
                'error' => ["no year was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "generateAnaliticsMounthlyRevenues", [$hotel, $year]);
    }


    public function generateAnaliticsYearlyRevenues(Request $request): JsonResponse{
        $request_data = $request->json();
        $year = $request_data->get("year");
        if (!$year){
            return response()->json([
                'error' => ["no year was specified"]
            ], 422);
        }
        return $this->reservationsAdminBasse($request, "generateAnaliticsYearlyRevenues", [$year]);
    }


    public function getAllReservations(Request $request): JsonResponse{
        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $currentReservations = Reservations::query()
            ->select(DB::raw("hotels.name as hotel_name, reservations.*, 'current' as type"))
            ->join("rooms", "reservations.id_room", "=", "rooms.id")
            ->join("hotels", "rooms.id_hotel", "=", "hotels.id");

        $historicReservations = historique_reservations::query()
            ->select(DB::raw("hotels.name as hotel_name, historique_reservations.*, 'old' as type"))
            ->join("rooms", "historique_reservations.id_room", "=", "rooms.id")
            ->join("hotels", "rooms.id_hotel", "=", "hotels.id");

        $reservations = $currentReservations
            ->unionAll($historicReservations)
            ->orderBy("type")
            ->get();
        return response()->json($reservations, 200);
    }


    public function cancelReservationAdmin(Request $request): JsonResponse{
        $isuserAdmin = AuthorityCheckers::isUserAdmin();
        if (!$isuserAdmin){
            return response()->json(["error" => "Unauthorized"], 401);
        }
        $reservationId = $request->json()->get('reservation_id');
        $reservation = Reservations::query()->find($reservationId);
        if (!$reservation){
            return response()->json(["error" => "Reservation not found"], 404);
        }
        $customer = User::query()->find($reservation->id_customer);
        if (!$customer){
            return response()->json(["error" => "Customer not found"], 404);
        }
        // do something here , send an email or what ever

        ////
        try{
            $reservation->delete();
        }catch (\Exception $e){
            return response()->json(["error" => $e->getMessage()], 500);
        }
        return response()->json(["success" => "Reservation has been cancelled"], 200);
    }
}
