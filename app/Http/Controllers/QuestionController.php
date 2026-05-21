<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeTeacher();
        $questions = Question::where('created_by', auth()->id())->orderBy('created_at', 'desc')->paginate(10);

        return view('questions.index', compact('questions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeTeacher();
        return view('questions.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeTeacher();
        $validated = $request->validate([
            'text' => 'required|string',
            'type' => 'required|in:multiple_choice,true_false,essay',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'score' => 'required|numeric|min:0',
            'explanation' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();
        Question::create($validated);
        return redirect()->route('questions.index')->with('success', 'سوال با موفقیت ایجاد شد.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        $this->authorizeOwner($question);
        return view('questions.show', compact('question'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        $this->authorizeOwner($question);
        return view('questions.edit', compact('question'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        $this->authorizeOwner($question);
        $validated = $request->validate([
            'text' => 'required|string',
            'type' => 'required|in:multiple_choice,true_false,essay',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'score' => 'required|numeric|min:0',
            'explanation' => 'nullable|string',
        ]);

        $question->update($validated);
        return redirect()->route('questions.index')->with('success', 'سوال به روز شد.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        $this->authorizeOwner($question);
        $question->delete();
        return redirect()->route('questions.index')->with('success', 'سوال حذف شد.');
    }

    private function authorizeTeacher()
    {
        if (!auth()->user()->isTeacher())
            abort(403);
    }

    private function authorizeOwner(Question $question)
    {
        $user = auth()->user();
        if (!$user->isTeacher() || $question->created_by !== $user->id) {
            abort(403);
        }
    }
}
