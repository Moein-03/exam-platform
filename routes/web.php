<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BtnTaklifController;
use App\Http\Controllers\TaskController;
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
    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/exams/create', [ExamController::class, 'create'])->name('exams.create');
    Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/exams/{exam:slug}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/exams/{exam:slug}/edit', [ExamController::class, 'edit'])->name('exams.edit');
    Route::put('/exams/{exam:slug}', [ExamController::class, 'update'])->name('exams.update');
    Route::delete('/exams/{exam:slug}', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::get('/exams/{exam:slug}/start', [ExamController::class, 'start'])->name('exams.take');
    Route::post('/exams/{exam:slug}/submit', [ExamController::class, 'submit'])->name('exams.submit');
    Route::post('/exams/{exam:slug}/end', [ExamController::class, 'endExam'])->name('exams.end');
    Route::get('/exams/{exam:slug}/result', [ExamController::class, 'showResult'])->name('exams.result');
    Route::get('/my-results', [ExamController::class, 'myResults'])->name('exams.my_results');
    Route::get('/results', [ExamController::class, 'allResults'])->name('results');

    
    // مدیریت آزمون
    Route::get('/exams/{exam:slug}/manage-exam', [ExamController::class, 'manageExam'])->name('exams.manage_exam');
    Route::post('/exams/{exam:slug}/manage-exam', [ExamController::class, 'updateExamManagement'])->name('exams.update_management');

    // برگزاری آزمون توسط استاد
    Route::post('/exams/{exam:slug}/conduct', [ExamController::class, 'conductExam'])->name('exams.conduct');
    // پایان آزمون (برای تایمر)
    Route::post('/exams/{exam:slug}/end', [ExamController::class, 'endExam'])->name('exams.end');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/my-results', [ExamController::class, 'myResults'])->name('my-results');

    // منابع سوالات
    Route::resource('questions', QuestionController::class);

    // نمایش پاسخ‌های یک آزمون
    Route::get('/exams/{exam}/answers', [AnswerController::class, 'index'])->name('answers.index');
});

Route::get('/buttonTaklif', [BtnTaklifController::class, 'index'])->name("buttonTaklif.index");

require __DIR__.'/auth.php';