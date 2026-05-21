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
        Schema::create('exam_users', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('exam_id');
            $table->foreign('exam_id', 'fk_exam_users_exam_id')->references('id')->on('exams')->onDelete('cascade');
            
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id', 'fk_exam_users_user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->float('score')->nullable();
            $table->string('status')->default('not_started');
            $table->timestamps();
            
            $table->unique(['exam_id', 'user_id']);
            $table->index(['exam_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_users');
    }
};
