<!DOCTYPE html>
<html>
<head>
    <title>{{ $exam->title }}</title>
</head>
<body>
    <h1>{{ $exam->title }}</h1>
    <p>{{ $exam->description }}</p>
    <p>تاریخ: {{ $exam->exam_date }}</p>
    <p>زمان شروع: {{ $exam->start_time }}</p>
    <p>مدت (دقیقه): {{ $exam->duration_min }}</p>
    <p>تعداد سوالات: {{ $exam->question_count }}</p>
    <p>وضعیت: {{ $exam->status }}</p>
</body>
</html>