<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/* use Inertia\Inertia; */

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->isTeacher()) {
            $examsCount = Exam::where('created_by', $user->id)->count();
            $questionsCount = Question::where('created_by', $user->id)->count();

            $avgScore = DB::table('exam_users')
                ->where('status', 'finished')
                ->whereIn('exam_id', function ($query) use ($user) {
                    $query->select('id')
                          ->from('exams')
                          ->where('created_by', $user->id);
                })
                ->avg('score');

            return view('dashboard.teacher', compact('examsCount', 'questionsCount', 'avgScore'));

        } else {
            $examsTaken = $user->examsAsStudent()
                ->wherePivot('status', 'finished')
                ->count();

            $avgScore = DB::table('exam_users')
                ->where('user_id', $user->id)
                ->where('status', 'finished')
                ->avg('score');

            return view('dashboard.student', compact('examsTaken', 'avgScore'));
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}