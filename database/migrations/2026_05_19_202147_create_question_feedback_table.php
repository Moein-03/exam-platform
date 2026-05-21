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
        Schema::create('question_feedback', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id', 'fk_question_feedback_question_id')->references('id')->on('questions')->onDelete('cascade');
            
            $table->text('feedback_text');
            $table->string('resource_link')->nullable();
            $table->string('video_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_feedback');
    }
};
