<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $function_1 = database_path('../cutomMysqlFiles/functions/isRoomAvailable.sql');
        $function_2 = database_path('../cutomMysqlFiles/functions/returnEverythingSpentByCustomer.sql');
        $function_3 = database_path('../cutomMysqlFiles/functions/returnSingleReservationCost.sql');
        $function_4 = database_path('../cutomMysqlFiles/functions/returnTotalOfActiveReservations.sql');
        $function_5 = database_path('../cutomMysqlFiles/functions/returnTotalOfReservationsByMonth.sql');
        
        
        $functions = [$function_1, $function_2, $function_3, $function_4, $function_5];
        for ($index =0; $index < count($functions); $index++) {
            if (file_exists($functions[$index])) {
                $sql = file_get_contents($functions[$index]);
                Log::info("Executing SQL: " . $sql);
                # run the file in this migration
                DB::unprepared($sql);
            }else{
                throw  new Exception("file in path [".$functions[$index]."]not found");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $cleanup = database_path('../cutomMysqlFiles/functions/deleteAllFunctions.sql');
        if (file_exists($cleanup)){
            $sql = file_get_contents($cleanup);
            Log::info("Executing SQL: " . $sql);
            # run the file in this migration
            DB::unprepared($sql);
        }else{
            throw  new Exception("file in path [".$cleanup."]not found");

        }
    }
};
