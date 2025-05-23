<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_scores', function (Blueprint $table) {
            $table->id();
            $table->string('sbd')->unique()->comment('Số báo danh');
            $table->decimal('toan', 4, 2)->nullable()->comment('Điểm Toán');
            $table->decimal('ngu_van', 4, 2)->nullable()->comment('Điểm Ngữ văn');
            $table->decimal('ngoai_ngu', 4, 2)->nullable()->comment('Điểm Ngoại ngữ');
            $table->decimal('vat_li', 4, 2)->nullable()->comment('Điểm Vật lý');
            $table->decimal('hoa_hoc', 4, 2)->nullable()->comment('Điểm Hóa học');
            $table->decimal('sinh_hoc', 4, 2)->nullable()->comment('Điểm Sinh học');
            $table->decimal('lich_su', 4, 2)->nullable()->comment('Điểm Lịch sử');
            $table->decimal('dia_li', 4, 2)->nullable()->comment('Điểm Địa lý');
            $table->decimal('gdcd', 4, 2)->nullable()->comment('Điểm GDCD');
            $table->string('ma_ngoai_ngu')->nullable()->comment('Mã ngoại ngữ');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_scores');
    }
};
