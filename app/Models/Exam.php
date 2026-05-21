<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'exam_date', 'start_time', 'duration_min',
        'question_count', 'total_score', 'category', 'status',
        'question_selection_type', 'allow_download', 'detailed_feedback',
        'created_by','slug'
    ];

    protected $casts = [
        'exam_date' => 'date',
        'allow_download' => 'boolean',
        'detailed_feedback' => 'boolean',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_questions')->withPivot('order', 'score')->withTimestamps();
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'exam_users')->withPivot('started_at', 'finished_at', 'score', 'status')->withTimestamps();
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    // آزمون‌های فعال
    public function scopeActive($query)
    {
        return $query->where('status', 'فعال');
    }

    // بررسی در حال برگزاری بودن
    public function isOngoing()
    {
        $now = now();
        $start = $this->exam_date->setTimeFromTimeString($this->start_time);
        $end = $start->copy()->addMinutes($this->duration_min);
        return $now->between($start, $end);
    }

    // محاسبه نمره دانشجو در این آزمون
    public function calculateStudentScore($userId)
    {
        return $this->answers()->where('user_id', $userId)->where('is_correct', true)->join('questions', 'answers.question_id', '=', 'questions.id')->sum('questions.score');
    }
}
