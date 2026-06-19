<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'ExamsCreate';
          window.pageProps = @json([
               'exams' => $exams,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>