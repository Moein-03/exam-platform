<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>آزمون آنلاین</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>

    <script>
        window.pageName = 'HomePage';
        /* window.pageProps = {
            auth: {
                user: {{ auth()->check() ? json_encode(auth()->user()->only('id', 'name', 'email', 'role')) : 'null' }}
            }
        }; */
        window.pageProps = @json($pageProps ?? []);
    </script>
</body>
</html>