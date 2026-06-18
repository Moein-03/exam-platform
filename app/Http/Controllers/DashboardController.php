<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
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

            $pageProps = [
                'isTeacher' => true,
                'examsCount' => $examsCount,
                'questionsCount' => $questionsCount,
                'avgScore' => $avgScore ?? 0,
            ];

        } else {
            $examsTaken = $user->examsAsStudent()
                ->wherePivot('status', 'finished')
                ->count();

            $avgScore = DB::table('exam_users')
                ->where('user_id', $user->id)
                ->where('status', 'finished')
                ->avg('score');

            $pageProps = [
                'isTeacher' => false,
                'examsTaken' => $examsTaken,
                'avgScore' => $avgScore ?? 0,
            ];
        }

        return view('dashboard', [
            'pageProps' => $pageProps
        ]);
    }
}