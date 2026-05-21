<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'feedback_text',
        'resource_link',
        'video_link'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    // برای ویدیو سوال در آپارات
    public function getEmbeddedVideoAttribute()
    {
        if (!$this->video_link) return null;

        if (str_contains($this->video_link, 'aparat.com')) {
            preg_match('/aparat\.com\/v\/([a-zA-Z0-9]+)/', $this->video_link, $matches);
            $videoId = $matches[1] ?? null;
            if ($videoId) {
                return "<iframe src='https://www.aparat.com/video/video/embed/videohash/{$videoId}' width='100%' height='200' frameborder='0' allowfullscreen></iframe>";
            }
        }

        // در غیر این صورت خود لینک را برگردان
        return $this->video_link;
    }

    // برای ویدیو (مثل یوتیوب)
    /* public function getEmbeddedVideoAttribute()
    {
        if (!$this->video_link) return null;
        parse_str(parse_url($this->video_link, PHP_URL_QUERY), $params);
        $videoId = $params['v'] ?? null;
        if ($videoId) {
            return "<iframe width='100%' height='200' src='https://www.youtube.com/embed/{$videoId}' frameborder='0' allowfullscreen></iframe>";
        }
        return $this->video_link;
    } */
}
