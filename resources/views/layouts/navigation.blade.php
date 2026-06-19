<nav class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex items-center">
                    <a href="{{ url('/') }}" class="text-xl font-bold text-gray-800">
                        پلتفرم آزمون
                    </a>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                @auth
                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-600">
                            {{ Auth::user()->name }}
                        </span>
                        
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="text-sm text-red-600 hover:text-red-700">
                                خروج
                            </button>
                        </form>
                    </div>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-medium text-gray-700 hover:text-gray-900">
                        ورود
                    </a>
                @endauth
            </div>
        </div>
    </div>
</nav>