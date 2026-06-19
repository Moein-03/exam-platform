<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsIndex';
          window.pageProps = @json([
               'question' => $question,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>