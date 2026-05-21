<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'user_id',
        'question_id',
        'selected_answer',
        'is_correct',
        'time_spent_seconds'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    // برای نمایش خلاصه پاسخ
    public function getShortAnswerAttribute()
    {
        return strlen($this->selected_answer) > 50 ? substr($this->selected_answer, 0, 50) . '...' : $this->selected_answer;
    }
}
