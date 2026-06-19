@extends('layouts.app')

@section('content')
     <div id="app"></div>

     <script>
          window.pageName = 'ExamShow';
          window.pageProps = @json([
               'exams' => $exam,
               'user' => auth()->user()
          ]);
     </script>
@endsection