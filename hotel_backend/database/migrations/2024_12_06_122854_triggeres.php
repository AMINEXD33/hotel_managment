<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $trigger_1 = database_path('../cutomMysqlFiles/triggeres/[before insert]reservations.sql');
        $trigger_2 = database_path('../cutomMysqlFiles/triggeres/[after insert]reservations.sql');
        $trigger_3 = database_path('../cutomMysqlFiles/triggeres/[after delete]reservations.sql');
        $triggeres = [$trigger_1, $trigger_2, $trigger_3];
        for ($index =0; $index < count($triggeres); $index++) {
            if (file_exists($triggeres[$index])) {
                $sql = file_get_contents($triggeres[$index]);
                # run the file in this migration
                DB::unprepared($sql);
            }else{
                throw  new Exception("file in path [".$triggeres[$index]."]not found");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // no need to delete the triggeres sinse deleting the tables will
        // take care of it
    }
};
