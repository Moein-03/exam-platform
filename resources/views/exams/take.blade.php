@extends('layouts.app')

@section('header', 'شرکت در آزمون: ' . $exam->title)

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <div class="mb-6">
                         <h2 class="text-2xl font-bold">{{ $exam->title }}</h2>
                         <p class="text-gray-600 mt-2">{{ $exam->description }}</p>
                         <div class="mt-4 grid grid-cols-2 gap-4">
                         <div>
                              <span class="font-semibold">تاریخ:</span>
                              {{ $exam->exam_date }}
                         </div>
                         <div>
                              <span class="font-semibold">مدت زمان:</span>
                              {{ $exam->duration_min }} دقیقه
                         </div>
                         <div>
                              <span class="font-semibold">تعداد سوالات:</span>
                              {{ $exam->question_count }}
                         </div>
                         <div>
                              <span class="font-semibold">نمره کل:</span>
                              {{ $exam->total_score }}
                         </div>
                         </div>
                    </div>

                    <form method="POST" action="{{ route('exams.submit', $exam->slug) }}">
                         @csrf

                         @foreach($exam->questions as $index => $question)
                         <div class="border-b border-gray-200 py-4">
                              <h4 class="font-medium">سوال {{ $index + 1 }}: {{ $question->text }}</h4>
                              @if($question->type == 'multiple_choice')
                                   @foreach($question->options as $key => $option)
                                        <div class="mt-2">
                                             <input type="radio" name="answers[{{ $question->id }}]" value="{{ $key }}" id="q{{ $question->id }}_{{ $key }}">
                                             <label for="q{{ $question->id }}_{{ $key }}">{{ $option }}</label>
                                        </div>
                                   @endforeach
                              @elseif($question->type == 'true_false')
                                   <div class="mt-2">
                                        <input type="radio" name="answers[{{ $question->id }}]" value="true" id="q{{ $question->id }}_true">
                                        <label for="q{{ $question->id }}_true">درست</label>
                                   </div>
                                   <div class="mt-2">
                                        <input type="radio" name="answers[{{ $question->id }}]" value="false" id="q{{ $question->id }}_false">
                                        <label for="q{{ $question->id }}_false">نادرست</label>
                                   </div>
                              @elseif($question->type == 'essay')
                                   <div class="mt-2">
                                        <textarea name="answers[{{ $question->id }}]" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                                   </div>
                              @endif
                         </div>
                         @endforeach

                         <div class="flex items-center justify-end mt-6">
                         <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onclick="return confirm('آیا از ثبت پاسخ‌ها مطمئن هستید؟')">
                              ثبت پاسخ‌ها
                         </button>
                         </div>
                    </form>
               </div>
          </div>
     </div>
</div>
@endsection