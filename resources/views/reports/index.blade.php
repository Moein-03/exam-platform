<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>گزارشات | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'ReportsIndex';
          window.pageProps = @json([
               'exams' => $exams,
               'totalExams' => $totalExams,
               'totalStudents' => $totalStudents,
               'avgScore' => $avgScore,
               'difficultQuestions' => $difficultQuestions,
               'user' => auth()->user()
          ]);
     </script>
</body>
</html>