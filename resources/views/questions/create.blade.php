@extends('layouts.app')

@section('content')
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsCreate';
          window.pageProps = @json([
               'user' => auth()->user()
          ]);
     </script>
@endsection