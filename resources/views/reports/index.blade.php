<x-layouts.app>
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
</x-layouts.app>