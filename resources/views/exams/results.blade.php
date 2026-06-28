<!-- @extends('layouts.app')

@section('header', 'نتیجه آزمون: ' . $exam->title)

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <div class="mb-6">
                         <h2 class="text-2xl font-bold">{{ $exam->title }}</h2>
                         <div class="mt-4 grid grid-cols-2 gap-4">
                         <div>
                              <span class="font-semibold">نمره شما:</span>
                              <span class="text-green-600 font-bold">{{ $score ?? 'نامشخص' }}</span>
                         </div>
                         <div>
                              <span class="font-semibold">نمره کل:</span>
                              {{ $exam->total_score }}
                         </div>
                         </div>
                    </div>

                    @if(isset($answers) && count($answers) > 0)
                         <div class="mt-6">
                         <h3 class="text-lg font-semibold mb-4">پاسخ‌های شما</h3>
                         @foreach($answers as $answer)
                              <div class="border-b border-gray-200 py-3">
                                   <p class="font-medium">{{ $answer->question->text }}</p>
                                   <p class="text-sm">
                                        <span class="font-semibold">پاسخ شما:</span>
                                        {{ $answer->answer_text }}
                                   </p>
                                   <p class="text-sm">
                                        <span class="font-semibold">وضعیت:</span>
                                        @if($answer->is_correct)
                                             <span class="text-green-600">درست</span>
                                        @else
                                             <span class="text-red-600">نادرست</span>
                                        @endif
                                   </p>
                                   @if($answer->score)
                                        <p class="text-sm">
                                             <span class="font-semibold">نمره:</span>
                                             {{ $answer->score }}
                                        </p>
                                   @endif
                              </div>
                         @endforeach
                         </div>
                    @endif

                    <div class="flex items-center justify-end mt-6">
                         <a href="{{ route('exams.index') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                         بازگشت به لیست آزمون‌ها
                         </a>
                    </div>
               </div>
          </div>
     </div>
</div>
@endsection -->

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>نتیجه آزمون | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'results';
          window.pageProps = @json($pageProps);
     </script>
</body>
</html>