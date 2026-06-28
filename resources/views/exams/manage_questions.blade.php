<!-- @extends('layouts.app')

@section('header', 'مدیریت سوالات آزمون: ' . $exam->title)

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <form method="POST" action="{{ route('exams.attach_questions', $exam->slug) }}">
                         @csrf

                         <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700">انتخاب سوالات</label>
                         <div class="mt-2 space-y-2">
                              @foreach($questions as $question)
                                   <div class="flex items-center">
                                        <input type="checkbox" name="question_ids[]" value="{{ $question->id }}" 
                                             id="question_{{ $question->id }}"
                                             {{ in_array($question->id, $selectedQuestions) ? 'checked' : '' }}
                                             class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <label for="question_{{ $question->id }}" class="mr-2">{{ $question->text }}</label>
                                   </div>
                              @endforeach
                         </div>
                         @error('question_ids')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="flex items-center justify-end mt-4">
                         <a href="{{ route('exams.show', $exam->slug) }}" class="text-gray-600 hover:text-gray-900 mr-4">بازگشت</a>
                         <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              ذخیره سوالات
                         </button>
                         </div>
                    </form>
               </div>
          </div>
     </div>
</div>
@endsection
 -->
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>مدیریت سوالات آزمون | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'manage_questions';
          window.pageProps = @json($pageProps);
     </script>
</body>
</html>