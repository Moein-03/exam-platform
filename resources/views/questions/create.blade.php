<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsCreate';
          window.pageProps = @json([
               'question' => $question,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>