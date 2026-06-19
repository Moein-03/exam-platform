<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsEdit';
          window.pageProps = @json([
               'questions' => $questions,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>