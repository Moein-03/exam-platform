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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('exam_date')->index();
            $table->time('start_time');
            $table->integer('duration_min');
            $table->integer('question_count');
            $table->float('total_score');
            $table->string('category')->nullable()->index();
            $table->string('status')->default('پیش‌نویس')->index();
            $table->string('question_selection_type')->default('manual')->index();
            $table->boolean('allow_download')->default(false);
            $table->boolean('detailed_feedback')->default(true);
            
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by', 'fk_exams_created_by')->references('id')->on('users')->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};