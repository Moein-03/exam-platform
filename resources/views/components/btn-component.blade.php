@props([
    'type' => 'button',
    'href' => null,
    'variant' => 'primary',
    'size' => 'md',
])

@if($href)
    <a href="{{ $href }}" class="inline-block rounded-lg font-medium transition duration-200 
        {{ $size === 'sm' ? 'px-3 py-1 text-sm' : ($size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base') }}
        {{ $variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '' }}
        {{ $variant === 'secondary' ? 'bg-gray-600 hover:bg-gray-700 text-white' : '' }}
        {{ $variant === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : '' }}
        {{ $variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : '' }}
    ">
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" class="inline-block rounded-lg font-medium transition duration-200 
        {{ $size === 'sm' ? 'px-3 py-1 text-sm' : ($size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base') }}
        {{ $variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '' }}
        {{ $variant === 'secondary' ? 'bg-gray-600 hover:bg-gray-700 text-white' : '' }}
        {{ $variant === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : '' }}
        {{ $variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : '' }}
    ">
        {{ $slot }}
    </button>
@endif