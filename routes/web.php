<?php

/* use Inertia\Inertia; */
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\BtnTaklifController;

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


Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/login', [UserController::class, 'showLogin'])->name('login');
Route::get('/register', [UserController::class, 'showRegister'])->name('register');

Route::post('/login', [UserController::class, 'login']);

Route::resource('users', UserController::class)->except(['showLogin', 'showRegister']);

Route::middleware(['auth'])->group(function () {

    // داشبورد
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // منابع آزمون‌ها
    Route::resource('exams', ExamController::class)->except(['show']);
    Route::get('/exams/{exam:slug}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/exams/{exam:slug}/manage-questions', [ExamController::class, 'manageQuestions'])->name('exams.manage_questions');
    Route::post('/exams/{exam:slug}/attach-questions', [ExamController::class, 'attachQuestions'])->name('exams.attach_questions');
    Route::get('/exams/{exam}/take', [ExamController::class, 'start'])->name('exams.take');
    Route::get('/exams/{exam:slug}/start', [ExamController::class, 'start'])->name('exams.start');
    Route::post('/exams/{exam:slug}/submit', [ExamController::class, 'submit'])->name('exams.submit');
    Route::get('/exams/{exam:slug}/results', [ExamController::class, 'results'])->name('exams.results');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/my-results', [ExamController::class, 'myResults'])->name('my.results');

    // منابع سوالات
    Route::resource('questions', QuestionController::class);

    // نمایش پاسخ‌های یک آزمون
    Route::get('/exams/{exam}/answers', [AnswerController::class, 'index'])->name('answers.index');
});

Route::get('/buttonTaklif', [BtnTaklifController::class, 'index'])->name("buttonTaklif.index");

require __DIR__.'/auth.php';