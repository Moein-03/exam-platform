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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('exam_id');
            $table->foreign('exam_id', 'fk_exam_questions_exam_id')->references('id')->on('exams')->onDelete('cascade');
            
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id', 'fk_exam_questions_question_id')->references('id')->on('questions')->onDelete('cascade');
            
            $table->integer('order')->default(0);
            $table->float('score')->nullable();
            $table->timestamps();
            
            $table->unique(['exam_id', 'question_id']);
            $table->index(['exam_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};
