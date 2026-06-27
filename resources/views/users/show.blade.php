@extends('layouts.app')

@section('header', 'نمایش کاربر')

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700">نام</label>
                         <p class="mt-1">{{ $user->name }}</p>
                    </div>

                    <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700">ایمیل</label>
                         <p class="mt-1">{{ $user->email }}</p>
                    </div>

                    <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700">نقش</label>
                         <p class="mt-1">{{ $user->role }}</p>
                    </div>

                    <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700">شماره دانشجویی</label>
                         <p class="mt-1">{{ $user->university_id ?? 'ندارد' }}</p>
                    </div>

                    <div class="flex items-center justify-end mt-4">
                         <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-900 mr-4">بازگشت</a>
                         <a href="{{ route('users.edit', $user) }}" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                         ویرایش
                         </a>
                    </div>
               </div>
          </div>
     </div>
</div>
@endsection