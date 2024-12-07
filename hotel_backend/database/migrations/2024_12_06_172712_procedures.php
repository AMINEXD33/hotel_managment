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
        $procedure_1 = database_path('../cutomMysqlFiles/procedures/addReservation.sql');
        $procedure_2 = database_path('../cutomMysqlFiles/procedures/deleteReservation.sql');
        $procedure_3 = database_path('../cutomMysqlFiles/procedures/generateAnalitics.sql');
        $procedure_4 = database_path('../cutomMysqlFiles/procedures/generateAnaliticsMounthlyRevenues.sql');
        $procedure_5 = database_path('../cutomMysqlFiles/procedures/generateAnaliticsYearlyRevenues.sql');
        $procedures = [$procedure_1, $procedure_2, $procedure_3, $procedure_4, $procedure_5];
        for ($index =0; $index < count($procedures); $index++) {
            if (file_exists($procedures[$index])) {
                $sql = file_get_contents($procedures[$index]);
                Log::info("Executing SQL: " . $sql);
                # run the file in this migration
                DB::unprepared($sql);
            }else{
                throw  new Exception("file in path [".$procedures[$index]."]not found");
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
