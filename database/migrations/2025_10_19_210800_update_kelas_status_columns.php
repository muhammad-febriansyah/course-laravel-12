<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('kelas')) {
            return;
        }

        Schema::table('kelas', function (Blueprint $table) {
            $table->string('status_text', 20)->default('pending')->after('image');
            $table->timestamp('approved_at')->nullable()->after('status_text');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');
            $table->text('rejected_reason')->nullable()->after('rejected_at');
        });

        $statusMap = [
            0 => 'pending',
            1 => 'approved',
            2 => 'rejected',
        ];

        $kelas = DB::table('kelas')->select('id', 'status')->get();
        foreach ($kelas as $item) {
            $status = $statusMap[$item->status] ?? 'pending';
            DB::table('kelas')->where('id', $item->id)->update(['status_text' => $status]);
        }

        Schema::table('kelas', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->renameColumn('status_text', 'status');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('kelas')) {
            return;
        }

        Schema::table('kelas', function (Blueprint $table) {
            $table->integer('status_old')->default(0)->after('image');
        });

        $statusMap = [
            'pending' => 0,
            'approved' => 1,
            'rejected' => 2,
        ];

        $kelas = DB::table('kelas')->select('id', 'status')->get();
        foreach ($kelas as $item) {
            $status = $statusMap[$item->status] ?? 0;
            DB::table('kelas')->where('id', $item->id)->update(['status_old' => $status]);
        }

        Schema::table('kelas', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->renameColumn('status_old', 'status');
            $table->dropColumn(['approved_at', 'rejected_at', 'rejected_reason']);
        });
    }
};
