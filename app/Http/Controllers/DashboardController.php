<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
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
            $avgScore = $user->createdExams()->with('students')->get()->flatMap->students->avg('pivot.score');
            
            $props = [
                'role' => 'teacher',
                'examsCount' => $examsCount,
                'questionsCount' => $questionsCount,
                'avgScore' => $avgScore,
            ];
        } else {
            $examsTaken = $user->examsAsStudent()->wherePivot('status', 'finished')->count();
            $avgScore = $user->examsAsStudent()->wherePivot('status', 'finished')->avg('pivot.score');
            
            $props = [
                'role' => 'student',
                'examsTaken' => $examsTaken,
                'avgScore' => $avgScore,
            ];
        }
        
        // ویو بلید را با props مناسب صدا می‌زنیم
        return view('dashboard', ['pageProps' => $props]);
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
