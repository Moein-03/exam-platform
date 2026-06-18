<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>تمرین چهارم</title>
     @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100 p-8">
     <div class="flex gap-4 flex-wrap">
          <x-btn-component variant="primary">دکمه اصلی</x-btn-component>
          <x-btn-component variant="secondary">ثانویه</x-btn-component>
          <x-btn-component variant="success">موفق</x-btn-component>
          <x-btn-component variant="danger">حذف</x-btn-component>
          <x-btn-component variant="primary" size="sm">کوچک</x-btn-component>
          <x-btn-component variant="primary" size="lg">بزرگ</x-btn-component>
          <x-btn-component href="/" variant="primary">لینک به خانه</x-btn-component>
     </div>
</body>
</html>