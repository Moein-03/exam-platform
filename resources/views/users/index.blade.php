<!-- @extends('layouts.app')

@section('header', 'مدیریت کاربران')

@section('content')
<div class="py-12">
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
               <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                         <h2 class="text-xl font-semibold">لیست کاربران</h2>
                         <a href="{{ route('users.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                         ایجاد کاربر جدید
                         </a>
                    </div>

                    <table class="min-w-full divide-y divide-gray-200">
                         <thead>
                         <tr>
                              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
                              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش</th>
                              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                         </tr>
                         </thead>
                         <tbody class="bg-white divide-y divide-gray-200">
                         @foreach($users as $user)
                         <tr>
                              <td class="px-6 py-4 whitespace-nowrap">{{ $user->name }}</td>
                              <td class="px-6 py-4 whitespace-nowrap">{{ $user->email }}</td>
                              <td class="px-6 py-4 whitespace-nowrap">{{ $user->role }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm">
                                   <a href="{{ route('users.show', $user) }}" class="text-blue-600 hover:text-blue-900 ml-2">نمایش</a>
                                   <a href="{{ route('users.edit', $user) }}" class="text-yellow-600 hover:text-yellow-900 ml-2">ویرایش</a>
                                   <form action="{{ route('users.destroy', $user) }}" method="POST" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('آیا مطمئن هستید؟')">حذف</button>
                                   </form>
                              </td>
                         </tr>
                         @endforeach
                         </tbody>
                    </table>

                    <div class="mt-4">
                         {{ $users->links() }}
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
     <title>مدیریت کاربران | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'IndexUsers';
          window.pageProps = @json([
               'Accounts' => $Accounts,
               'user'  => auth()->user()
          ]);
     </script>
</body>
</html>