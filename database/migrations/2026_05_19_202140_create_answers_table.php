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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('exam_id');
            $table->foreign('exam_id', 'fk_answers_exam_id')->references('id')->on('exams')->onDelete('cascade');
            
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id', 'fk_answers_user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id', 'fk_answers_question_id')->references('id')->on('questions')->onDelete('cascade');
            
            $table->text('selected_answer')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->integer('time_spent_seconds')->nullable();
            $table->timestamps();
            
            $table->unique(['exam_id', 'user_id', 'question_id']);
            $table->index(['exam_id', 'is_correct']);
            $table->index(['question_id', 'is_correct']);
            $table->index(['user_id', 'exam_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
