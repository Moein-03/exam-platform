<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth'])->group(function () {

    // داشبورد
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // منابع آزمون‌ها
    Route::resource('exams', ExamController::class)->except(['show']);
    Route::get('/exams/{exam:slug}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/exams/{exam:slug}/manage-questions', [ExamController::class, 'manageQuestions'])->name('exams.manage_questions');
    Route::post('/exams/{exam:slug}/attach-questions', [ExamController::class, 'attachQuestions'])->name('exams.attach_questions');
    Route::get('/exams/{exam:slug}/start', [ExamController::class, 'start'])->name('exams.start');
    Route::post('/exams/{exam:slug}/submit', [ExamController::class, 'submit'])->name('exams.submit');
    Route::get('/exams/{exam:slug}/results', [ExamController::class, 'results'])->name('exams.results');

    // منابع سوالات
    Route::resource('questions', QuestionController::class);

    // (اختیاری) نمایش پاسخ‌های یک آزمون
    Route::get('/exams/{exam}/answers', [AnswerController::class, 'index'])->name('answers.index');
});

require __DIR__.'/auth.php';