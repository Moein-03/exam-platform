<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>برگزاری آزمون | پلتفرم آزمون</title>
     
     @viteReactRefresh
     @vite(['resources/js/app.jsx'])
</head>
<body>
     <div id="app"></div>

     <script>
          window.pageName = 'TakeExam';
          window.pageProps = @json($pageProps ?? []);
     </script>
</body>
</html>