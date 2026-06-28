<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExamController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isTeacher()) {
            $exams = Exam::where('created_by', $user->id)->orderBy('created_at', 'desc')->paginate(10);

            $pageProps = [
                'isTeacher' => true,
                'exams' => $exams,
                'auth' => ['user' => $user]
            ];
        } else {
            $exams = Exam::active()->where('status', 'فعال')->orderBy('exam_date', 'desc')->paginate(10);

            $pageProps = [
                'isTeacher' => false,
                'exams' => $exams,
                'auth' => ['user' => $user]
            ];
        }

        return view('exams.index', ['pageProps' => $pageProps]);
    }

    public function create()
    {
        $this->authorizeTeacher();
        $user = auth()->user();
        if ($user->isTeacher()) {
            $pageProps = [
                'isTeacher' => true,
                'auth' => ['user' => $user]
            ];
            return view('exams.create', ['pageProps' => $pageProps]);
        }
    }

    public function store(Request $request)
    {
        $this->authorizeTeacher();
        $user = auth()->user();
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'required|date',
            'start_time' => 'required',
            'duration_min' => 'required|integer|min:1',
            'question_count' => 'required|integer|min:1',
            'total_score' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'question_selection_type' => 'required|in:manual,random',
            'allow_download' => 'boolean',
            'detailed_feedback' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();
        $validated['created_by'] = auth()->id();
        $validated['status'] = 'پیش‌نویس';

        if ($user->isTeacher()) {
            $exam = Exam::create($validated);
            if ($request->expectsJson()) {
                return response()->json(['slug' => $exam->slug], 201);
            }
            return redirect()->route('exams.show', $exam->slug)->with('success', 'آزمون با موفقیت ساخته شد.');
        }
    }

    public function show($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $user = auth()->user();
        $pageProps = [
            'exam' => $exam,
            'auth' => ['user' => $user]
        ];
        return view('exams.show', ['pageProps' => $pageProps]);
        abort(404, 'آزمون یافت نشد.');
    }

    public function edit(Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $pageProps = [
                'isTeacher' => true,
                'exam' => $exam,
                'auth' => ['user' => $user]
            ];
            return view('exams.edit', ['pageProps' => $pageProps]);
        }
    }

    public function update(Request $request, Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'required|date',
            'start_time' => 'required',
            'duration_min' => 'required|integer|min:1',
            'question_count' => 'required|integer|min:1',
            'total_score' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'question_selection_type' => 'required|in:manual,random',
            'allow_download' => 'boolean',
            'detailed_feedback' => 'boolean',
            'status' => 'in:پیش‌نویس,فعال,بسته شده',
        ]);

        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $exam->update($validated);
            if ($request->expectsJson()) {
                return response()->json(['slug' => $exam->slug], 200);
            }
            return redirect()->route('exams.show', $exam->slug)->with('success', 'آزمون به روز شد.');
        }
    }

    /* public function destroy(Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $exam->delete();
            return redirect()->route('exams.index')->with('success', 'آزمون حذف شد.');
        }
    } */

    public function destroy($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $this->authorizeOwner($exam);
        $user = auth()->user();
        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $exam->delete();
            
            if (request()->expectsJson()) {
                return response()->json(['message' => 'آزمون حذف شد']);
            }
            return redirect()->route('exams.index')->with('success', 'آزمون حذف شد.');
        }
    }  

    public function manageQuestions(Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        $questions = Question::where('created_by', auth()->id())->get();
        $selectedQuestions = $exam->questions()->pluck('question_id')->toArray();

        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $pageProps = [
                'isTeacher' => true,
                'exam' => $exam,
                'questions' => $questions,
                'selectedQuestions' => $selectedQuestions,
                'auth' => ['user' => $user]
            ];
            return view('exams.manage_questions', ['pageProps' => $pageProps]);
        }
    }

    public function attachQuestions(Request $request, Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        $request->validate([
            'questions' => 'required|array',
            'questions.*' => 'exists:questions,id'
        ]);

        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $exam->questions()->sync($request->questions);
            return redirect()->route('exams.show', $exam->slug)->with('success', 'سوالات با موفقیت به آزمون اضافه شد.');
        }
    }

    public function start(Exam $exam)
    {
        $user = auth()->user();
        if (!$user->isStudent()) abort(403);

        if ($exam->status !== 'فعال') abort(404);

        $examUser = $exam->students()->where('user_id', $user->id)->first();
        if (!$examUser) {
            $exam->students()->attach($user->id, [
                'status' => 'in_progress',
                'started_at' => now()
            ]);
            $examUser = $exam->students()->where('user_id', $user->id)->first();
        } elseif ($examUser->pivot->status === 'finished') {
            return redirect()->route('exams.results', $exam->slug)->with('info', 'شما قبلاً در این آزمون شرکت کرده‌اید.');
        }

        if ($exam->question_selection_type === 'random') {
            $randomQuestions = Question::inRandomOrder()->limit($exam->question_count)->get();
            $exam->questions()->sync($randomQuestions->pluck('id')->mapWithKeys(function ($id, $index) {
                return [$id => ['order' => $index + 1]];
            }));
        }

        $questions = $exam->questions()->orderBy('order')->get();
        $pageProps = [
            'isTeacher' => false,
            'exam' => $exam,
            'questions' => $questions,
            'auth' => ['user' => $user]
        ];
        return view('exams.take', ['pageProps' => $pageProps]);
    }

    public function submit(Request $request, Exam $exam)
    {
        $user = auth()->user();
        $examUser = $exam->students()->where('user_id', $user->id)->first();
        if (!$examUser || $examUser->pivot->status === 'finished') {
            abort(403, 'شما مجاز به ارسال پاسخ نیستید.');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|string'
        ]);

        // ذخیره پاسخ‌ها
        foreach ($request->answers as $questionId => $selectedAnswer) {
            $question = Question::find($questionId);
            $isCorrect = $question->isAnswerCorrect($selectedAnswer);
            Answer::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'user_id' => $user->id,
                    'question_id' => $questionId
                ],
                [
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $isCorrect,
                    'time_spent_seconds' => $request->input("time_$questionId", 0)
                ]
            );
        }

        // محاسبه نمره
        $totalScore = $exam->calculateStudentScore($user->id);
        $exam->students()->updateExistingPivot($user->id, [
            'finished_at' => now(),
            'score' => $totalScore,
            'status' => 'finished'
        ]);

        return redirect()->route('exams.results', $exam->slug)->with('success', 'پاسخ‌های شما ثبت شد. نمره شما محاسبه گردید.');
    }

    public function results(Exam $exam)
    {
        $user = auth()->user();
        $examUser = $exam->students()->where('user_id', $user->id)->first();
        if (!$examUser || $examUser->pivot->status !== 'finished') {
            abort(404);
        }
        $answers = Answer::where('exam_id', $exam->id)->where('user_id', $user->id)->with('question')->get();

        $pageProps = [
            'isTeacher' => true,
            'exam' => $exam,
            'answers' => $answers,
            'examUser' => $examUser,
            'score' => $examUser->pivot->score ?? 0,
            'auth' => ['user' => $user]
        ];
        return view('exams.results', ['pageProps' => $pageProps]);
    }

    private function authorizeTeacher()
    {
        if (!auth()->user()->isTeacher()) abort(403, 'فقط استادان مجاز هستند.');
    }

    private function authorizeOwner(Exam $exam)
    {
        $user = auth()->user();
        if (!$user->isTeacher() || $exam->created_by !== $user->id) {
            abort(403, 'شما اجازه دسترسی به این آزمون را ندارید.');
        }
    }
}