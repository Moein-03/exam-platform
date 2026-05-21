<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'type',
        'options',
        'correct_answer',
        'score',
        'explanation',
        'created_by'
    ];

    protected $casts = [
        'options' => 'array',
        'score' => 'float',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_questions')->withPivot('order', 'score');
    }

    public function feedback()
    {
        return $this->hasOne(QuestionFeedback::class);
    }

    // سوالات چندگزینه‌ای
    public function scopeMultipleChoice($query)
    {
        return $query->where('type', 'multiple_choice');
    }

    // بررسی صحت پاسخ
    public function isAnswerCorrect($userAnswer)
    {
        return strtolower(trim($userAnswer)) === strtolower(trim($this->correct_answer));
    }

    // برای خلاصه سوال
    public function getExcerptAttribute()
    {
        return strlen($this->text) > 100 ? substr($this->text, 0, 100) . '...' : $this->text;
    }
}
