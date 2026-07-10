<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
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
            $exams = $user->examsAsStudent()
                ->where(function($query) {
                    $query->whereIn('exam_users.status', ['in_progress', 'finished'])
                        ->orWhere('exams.status', '!=', 'پیش‌نویس');
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10);
            
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
            'isTeacher' => $user->isTeacher(),
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
        abort(403, 'شما اجازه ویرایش این آزمون را ندارید.');
    }

    public function update(Request $request, $slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $this->authorizeOwner($exam);
        $user = auth()->user();

        if ($exam->status !== 'پیش‌نویس') {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'فقط آزمون‌های با وضعیت پیش‌نویس قابل ویرایش هستند.'
                ], 403);
            }
            return redirect()->back()->with('error', 'فقط آزمون‌های با وضعیت پیش‌نویس قابل ویرایش هستند.');
        }

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
                return response()->json([
                    'slug' => $exam->slug,
                    'message' => 'آزمون با موفقیت به روز شد.',
                    'exam' => $exam
                ], 200);
            }
            return redirect()->route('exams.show', $exam->slug)->with('success', 'آزمون به روز شد.');
        }
    }

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

    /* public function update(Request $request, Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();

        if ($exam->status !== 'پیش‌نویس') {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'فقط آزمون‌های با وضعیت پیش‌نویس قابل ویرایش هستند.'
                ], 403);
            }
            return redirect()->back()->with('error', 'فقط آزمون‌های با وضعیت پیش‌نویس قابل ویرایش هستند.');
        }

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
                return response()->json([
                    'slug' => $exam->slug,
                    'message' => 'آزمون با موفقیت به روز شد.',
                    'exam' => $exam
                ], 200);
            }
            return redirect()->route('exams.show', $exam->slug)->with('success', 'آزمون به روز شد.');
        }
    }

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
    }   */

   /*  public function manageQuestions(Exam $exam)
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
    } */

    public function manageExam(Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();
        
        $students = User::where('role', 'student')->get();
        $selectedStudents = $exam->students()->pluck('user_id')->toArray();
        $allQuestions = Question::where('created_by', $user->id)->get();
        $selectedQuestions = $exam->questions()->pluck('question_id')->toArray();
        
        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $pageProps = [
                'isTeacher' => true,
                'exam' => $exam,
                'students' => $students,
                'selectedStudents' => $selectedStudents,
                'allQuestions' => $allQuestions,
                'selectedQuestions' => $selectedQuestions,
                'auth' => ['user' => $user]
            ];
            
            return view('exams.manage', ['pageProps' => $pageProps]);
        }
    }

    public function updateExamManagement(Request $request, Exam $exam)
    {
        $this->authorizeOwner($exam);
        $user = auth()->user();

        $request->validate([
            'students' => 'array',
            'students.*' => 'exists:users,id',
            'questions' => 'array',
            'questions.*' => 'exists:questions,id',
        ]);

        if ($user->isTeacher() && $exam->created_by == $user->id) {
            $selectedQuestions = $request->questions ?? [];
            $totalSelectedScore = Question::whereIn('id', $selectedQuestions)->sum('score');

            if ($totalSelectedScore != $exam->total_score) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'error' => 'مجموع نمرات سوالات انتخاب‌شده باید برابر با نمره کل آزمون (' . $exam->total_score . ') باشد. مجموع فعلی: ' . $totalSelectedScore
                    ], 422);
                }
                return redirect()->back()->withErrors([
                    'questions' => 'مجموع نمرات سوالات انتخاب‌شده باید برابر با نمره کل آزمون (' . $exam->total_score . ') باشد. مجموع فعلی: ' . $totalSelectedScore
                ])->withInput();
            }

            $exam->students()->sync($request->students ?? []);
            $exam->questions()->sync($request->questions ?? []);
            $exam->update(['status' => 'فعال']);

            if ($request->expectsJson()) {
                return response()->json(['message' => 'آزمون با موفقیت فعال شد و دانشجوها و سوالات به آن اضافه شدند.']);
            }
            return redirect()->route('exams.show', $exam->slug)->with('success', 'آزمون با موفقیت فعال شد و دانشجوها و سوالات به آن اضافه شدند.');
        }
    }

    /* public function start(Exam $exam)
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
    } */

    /**
     * برگزاری آزمون توسط استاد (تغییر وضعیت به درحال برگزاری)
     */
    public function conductExam($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $this->authorizeOwner($exam);
        
        if ($exam->status !== 'فعال') {
            return response()->json(['error' => 'فقط آزمون‌های فعال قابل برگزاری هستند.'], 403);
        }
        
        $date = explode(' ', $exam->exam_date)[0];
        
        $now = Carbon::now('Asia/Tehran');
        $examDateTime = Carbon::parse($date . ' ' . $exam->start_time, 'Asia/Tehran');
        
        $diffSeconds = $now->diffInSeconds($examDateTime, false);
        
        // اگر بیش از ۵ دقیقه (۳۰۰ ثانیه) از زمان آزمون گذشته باشد → خطا
        if ($diffSeconds > 500) {
            return response()->json([
                'error' => 'زمان برگزاری آزمون گذشته است. زمان فعلی: ' . $now->format('Y-m-d H:i') .
                        ' | زمان آزمون: ' . $examDateTime->format('Y-m-d H:i')
            ], 403);
        }
        
        // اگر بیش از ۶۰ ثانیه به زمان آزمون مانده باشد → خطا
        if ($diffSeconds < -60) {
            return response()->json([
                'error' => 'زمان برگزاری آزمون فرا نرسیده است. زمان فعلی: ' . $now->format('Y-m-d H:i') .
                        ' | زمان آزمون: ' . $examDateTime->format('Y-m-d H:i')
            ], 403);
        }
        
        // تغییر وضعیت
        $exam->update(['status' => 'درحال برگزاری']);
        
        return response()->json([
            'message' => 'آزمون با موفقیت برگزار شد.',
            'status' => 'درحال برگزاری'
        ]);
    }
    /* public function conductExam($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $this->authorizeOwner($exam);
        
        if ($exam->status !== 'فعال') {
            return response()->json(['error' => 'فقط آزمون‌های فعال قابل برگزاری هستند.'], 403);
        }
        
        // تغییر وضعیت بدون بررسی زمان
        $exam->update(['status' => 'درحال برگزاری']);
        
        return response()->json([
            'message' => 'آزمون با موفقیت برگزار شد.',
            'status' => 'درحال برگزاری'
        ]);
    } */

    /**
     * شروع آزمون توسط دانشجو
     */
    public function start(Exam $exam)
    {
        $user = auth()->user();
        if (!$user->isStudent()) abort(403);

        // دانشجو فقط در وضعیت 'درحال برگزاری' می‌تواند شروع کند
        if ($exam->status !== 'درحال برگزاری') {
            abort(403, 'آزمون در حال حاضر قابل شروع نیست.');
        }

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

        // اگر نوع انتخاب سوال تصادفی است
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

    /**
     * ثبت پاسخ‌های دانشجو
     */
    public function submit(Request $request, Exam $exam)
    {
        $user = auth()->user();
        $examUser = $exam->students()->where('user_id', $user->id)->first();
        if (!$examUser || $examUser->pivot->status === 'finished') {
            return response()->json(['error' => 'شما مجاز به ارسال پاسخ نیستید.'], 403);
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|string'
        ]);

        foreach ($request->answers as $questionId => $selectedAnswer) {
            $question = Question::find($questionId);
            if (!$question) continue;
            
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
        $totalScore = Answer::where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->where('is_correct', true)
            ->join('questions', 'answers.question_id', '=', 'questions.id')
            ->sum('questions.score');

        $exam->students()->updateExistingPivot($user->id, [
            'finished_at' => now(),
            'score' => $totalScore ?? 0,
            'status' => 'finished'
        ]);

        if ($exam->status === 'درحال برگزاری') {
            $exam->update(['status' => 'اتمام آزمون']);
        }

        return response()->json(['message' => 'پاسخ‌های شما ثبت شد.']);
    }
    /* public function submit(Request $request, Exam $exam)
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

        // اگر وضعیت آزمون 'درحال برگزاری' است، به 'اتمام آزمون' تغییر بده
        if ($exam->status === 'درحال برگزاری') {
            $exam->update(['status' => 'اتمام آزمون']);
        }

        return redirect()->route('exams.results', $exam->slug)->with('success', 'پاسخ‌های شما ثبت شد. نمره شما محاسبه گردید.');
    } */

    /**
     * پایان آزمون (توسط تایمر یا دانشجو)
     */
    public function endExam($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $user = auth()->user();
        
        if (!$user->isTeacher() && !$exam->students()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'شما مجاز نیستید.'], 403);
        }
        
        if ($exam->status === 'درحال برگزاری') {
            $exam->update(['status' => 'اتمام آزمون']);
            return response()->json(['message' => 'آزمون به پایان رسید.', 'status' => 'اتمام آزمون']);
        }
        
        return response()->json(['message' => 'وضعیت آزمون برای پایان مناسب نیست.'], 400);
    }
    /* public function endExam($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $this->authorizeOwner($exam);
        
        if ($exam->status === 'درحال برگزاری') {
            $exam->update(['status' => 'اتمام آزمون']);
            return response()->json(['message' => 'آزمون به پایان رسید.', 'status' => 'اتمام آزمون']);
        }
        
        return response()->json(['message' => 'وضعیت آزمون برای پایان مناسب نیست.'], 400);
    } */

   /*  public function results(Exam $exam)
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
    } */

    public function showResult($slug)
    {
        $exam = Exam::where('slug', $slug)->firstOrFail();
        $user = auth()->user();
        
        // دانشجو: فقط اگر در این آزمون شرکت کرده و به پایان رسانده باشد
        if ($user->isStudent()) {
            $examUser = $exam->students()->where('user_id', $user->id)->first();
            if (!$examUser || $examUser->pivot->status !== 'finished') {
                abort(403, 'شما به این نتیجه دسترسی ندارید.');
            }
            $answers = Answer::where('exam_id', $exam->id)->where('user_id', $user->id)->with('question')->get();
            $score = $examUser->pivot->score ?? 0;

            $pageProps = [
                'isTeacher' => false,
                'exam' => $exam,
                'answers' => $answers,
                'score' => $score,
                'auth' => ['user' => $user]
            ];
        }
        // استاد: فقط اگر مالک آزمون باشد
        elseif ($user->isTeacher()) {
            if ($exam->created_by !== $user->id) {
                abort(403, 'شما به این نتیجه دسترسی ندارید.');
            }
            // برای استاد، تمام پاسخ‌های دانشجوها را می‌گیریم (می‌توانیم همه را نمایش دهیم)
            $answers = Answer::where('exam_id', $exam->id)->with('question', 'user')->get();
            $score = null; // استاد نمره کلی ندارد

            $pageProps = [
                'isTeacher' => true,
                'exam' => $exam,
                'answers' => $answers,
                'score' => $score,
                'auth' => ['user' => $user]
            ];
        } else {
            abort(403);
            $pageProps = [];
        }
        
        return view('exams.result', ['pageProps' => $pageProps]);
    }

    public function myResults()
    {
        $user = auth()->user();

        if (!$user->isStudent()) {
            abort(403, 'فقط دانشجویان دسترسی دارند.');
        }

        $exams = $user->examsAsStudent()
            ->wherePivot('status', 'finished')
            ->withPivot('score', 'finished_at')
            ->orderBy('exam_date', 'desc')
            ->paginate(10);
        
        $pageProps = [
            'isTeacher' => false,
            'exams' => $exams,
            'auth' => ['user' => $user]
        ];
        
        return view('exams.my_results', ['pageProps' => $pageProps]);
    }

    /**
     * نمایش همه نتایج آزمون‌های استاد (فقط برای داشبورد)
     */
    public function allResults()
    {
        $user = auth()->user();
        if (!$user->isTeacher()) {
            abort(403, 'فقط استادان دسترسی دارند.');
        }
        
        // تمام آزمون‌های این استاد به همراه دانشجوهایی که شرکت کرده‌اند
        $exams = Exam::where('created_by', $user->id)
            ->with(['students' => function($query) {
                $query->wherePivot('status', 'finished')
                    ->withPivot('score', 'finished_at');
            }])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $pageProps = [
            'isTeacher' => true,
            'exams' => $exams,
            'auth' => ['user' => $user]
        ];
        
        return view('results', ['pageProps' => $pageProps]);
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