<!-- @extends('layouts.app')

@section('header', 'ویرایش کاربر')

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <form method="POST" action="{{ route('users.update', $user) }}">
                         @csrf
                         @method('PUT')

                         <div class="mb-4">
                         <label for="name" class="block text-sm font-medium text-gray-700">نام</label>
                         <input type="text" name="name" id="name" value="{{ old('name', $user->name) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                         @error('name')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="mb-4">
                         <label for="email" class="block text-sm font-medium text-gray-700">ایمیل</label>
                         <input type="email" name="email" id="email" value="{{ old('email', $user->email) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                         @error('email')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="mb-4">
                         <label for="password" class="block text-sm font-medium text-gray-700">رمز عبور جدید (اختیاری)</label>
                         <input type="password" name="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                         @error('password')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="mb-4">
                         <label for="password_confirmation" class="block text-sm font-medium text-gray-700">تکرار رمز عبور جدید</label>
                         <input type="password" name="password_confirmation" id="password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                         </div>

                         <div class="mb-4">
                         <label for="role" class="block text-sm font-medium text-gray-700">نقش</label>
                         <select name="role" id="role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                              <option value="student" {{ $user->role == 'student' ? 'selected' : '' }}>دانشجو</option>
                              <option value="teacher" {{ $user->role == 'teacher' ? 'selected' : '' }}>استاد</option>
                         </select>
                         @error('role')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="mb-4">
                         <label for="university_id" class="block text-sm font-medium text-gray-700">شماره دانشجویی</label>
                         <input type="text" name="university_id" id="university_id" value="{{ old('university_id', $user->university_id) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                         @error('university_id')
                              <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                         @enderror
                         </div>

                         <div class="flex items-center justify-end mt-4">
                         <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-900 mr-4">بازگشت</a>
                         <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              به‌روزرسانی
                         </button>
                         </div>
                    </form>
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
     <title>ویرایش کاربر | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'EditUser';
          window.pageProps = @json([
               'Accounts' => $Accounts,
               'user'  => auth()->user()
          ]);
     </script>
</body>
</html>