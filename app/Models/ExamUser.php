<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamUser extends Model
{
    use HasFactory;

    protected $table = 'exam_users';

    protected $fillable = [
        'exam_id',
        'user_id',
        'started_at',
        'finished_at',
        'score',
        'status'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'score' => 'float',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // شروع آزمون
    public function start()
    {
        $this->update(['started_at' => now(), 'status' => 'in_progress']);
    }

    // پایان آزمون و محاسبه نمره
    public function finish()
    {
        $score = $this->exam->calculateStudentScore($this->user_id);
        $this->update(['finished_at' => now(), 'score' => $score, 'status' => 'finished']);
    }
}
