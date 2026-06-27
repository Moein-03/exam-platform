@extends('layouts.app')

@section('header', 'پاسخ‌های آزمون: ' . $exam->title)

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <div class="mb-6">
                         <h2 class="text-2xl font-bold">{{ $exam->title }}</h2>
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
                              </div>
                         @endforeach
                         </div>
                    @else
                         <p class="text-gray-500">هیچ پاسخی برای این آزمون یافت نشد.</p>
                    @endif

                    <div class="flex items-center justify-end mt-6">
                         <a href="{{ route('exams.index') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                         بازگشت
                         </a>
                    </div>
               </div>
          </div>
     </div>
</div>
@endsection