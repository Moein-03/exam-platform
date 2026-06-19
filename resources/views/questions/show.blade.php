<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsShow';
          window.pageProps = @json([
               'question' => $question,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>