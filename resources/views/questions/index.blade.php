@extends('layouts.app')

@section('content')
     <div id="app"></div>

     <script>
          window.pageName = 'QuestionsIndex';
          window.pageProps = @json([
               'questions' => $questions,
               'user' => auth()->user()
          ]);
     </script>
@endsection