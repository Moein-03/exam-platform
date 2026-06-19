<x-layouts.app>
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsCreate';
          window.pageProps = @json([
               'user' => auth()->user()
          ]);
     </script>
</x-layouts.app>