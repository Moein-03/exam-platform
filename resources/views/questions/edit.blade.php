<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsEdit';
          window.pageProps = @json([
               'question' => $question,
               'user'  => auth()->user()
          ]);
     </script>
</x-layouts.app>