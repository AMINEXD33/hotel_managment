<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use \Illuminate\Support\Facades\Log;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $procedures = [
            database_path('../cutomMysqlFiles/procedures/addReservation.sql'),
            database_path('../cutomMysqlFiles/procedures/deleteReservation.sql'),
            database_path('../cutomMysqlFiles/procedures/generateAnalitics.sql'),
            database_path('../cutomMysqlFiles/procedures/generateAnaliticsMounthlyRevenues.sql'),
            database_path('../cutomMysqlFiles/procedures/generateAnaliticsYearlyRevenues.sql'),
            database_path("../cutomMysqlFiles/procedures/allActiveReservationsInHotel.sql"),
            database_path("../cutomMysqlFiles/procedures/allOldReservationsInHotel.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWithCheckInAfter.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWithCheckInBefore.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWithCheckOutAfter.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWithCheckOutBefore.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWithCheckOutBetween.sql"),
            database_path("../cutomMysqlFiles/procedures/allReservationsWIthCheckInBetween.sql"),

        ];
        foreach ($procedures as $procedure) {
            if (file_exists($procedure)) {
                $sql = file_get_contents($procedure);
                Log::info("Executing SQL: " . $sql);
                # run the file in this migration
                DB::unprepared($sql);
            }else{
                throw  new Exception("file in path [".$procedure."]not found");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $drop_statments = database_path('../cutomMysqlFiles/procedures/dropall.sql');
        if (file_exists($drop_statments)) {
            $sql = file_get_contents($drop_statments);
            Log::info("Executing SQL: " . $sql);
            # run the file in this migration
            DB::unprepared($sql);
        }else{
            throw  new Exception("file in path [".$drop_statments."]not found");
        }
    }
};
