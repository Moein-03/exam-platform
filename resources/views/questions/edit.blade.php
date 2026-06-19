@extends('layouts.app')

@section('content')
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsEdit';
          window.pageProps = @json([
               'question' => $question,
               'user' => auth()->user()
          ]);
     </script>
@endsection