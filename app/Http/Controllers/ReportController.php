<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamUser;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user->isTeacher()) {
            abort(403);
        }

        $exams = Exam::where('created_by', $user->id)->get();

        $totalExams = $exams->count();
        $totalStudents = ExamUser::whereIn('exam_id', $exams->pluck('id'))->distinct('user_id')->count();

        $avgScore = DB::table('exam_users')
            ->whereIn('exam_id', $exams->pluck('id'))
            ->where('status', 'finished')
            ->avg('score');

        $difficultQuestions = DB::table('answers')
            ->select('question_id', DB::raw('COUNT(CASE WHEN is_correct = 0 THEN 1 END) as wrong_answers'))
            ->whereIn('exam_id', $exams->pluck('id'))
            ->groupBy('question_id')
            ->orderBy('wrong_answers', 'desc')
            ->limit(5)
            ->get();

        $pageProps = [
            'exams' => $exams,
            'totalExams' => $totalExams,
            'totalStudents' => $totalStudents,
            'avgScore' => $avgScore,
            'difficultQuestions' => $difficultQuestions,
            'auth' => ['user' => $user]
        ];

        return view('reports.index', ['pageProps' => $pageProps]);
    }
}