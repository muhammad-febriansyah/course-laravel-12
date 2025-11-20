<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO Meta Tags --}}
        <meta name="description" content="{{ $settings['desc'] ?? 'Platform pembelajaran online terbaik' }}">
        <meta name="keywords" content="{{ $settings['keyword'] ?? 'kursus online, belajar online, pelatihan' }}">
        <meta name="author" content="{{ $settings['site_name'] ?? config('app.name') }}">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $settings['site_name'] ?? config('app.name', 'Laravel') }}">
        <meta property="og:description" content="{{ $settings['desc'] ?? 'Platform pembelajaran online terbaik' }}">
        @if(!empty($settings['thumbnail']))
        <meta property="og:image" content="{{ $settings['thumbnail'] }}">
        @endif

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $settings['site_name'] ?? config('app.name', 'Laravel') }}">
        <meta name="twitter:description" content="{{ $settings['desc'] ?? 'Platform pembelajaran online terbaik' }}">
        @if(!empty($settings['thumbnail']))
        <meta name="twitter:image" content="{{ $settings['thumbnail'] }}">
        @endif

        {{-- Inline style to set the HTML background color --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }
        </style>

        <title inertia>{{ $settings['site_name'] ?? config('app.name', 'Laravel') }}</title>

        @if(!empty($settings['favicon']))
            <link rel="icon" href="{{ $settings['favicon'] }}" sizes="any">
            <link rel="apple-touch-icon" href="{{ $settings['favicon'] }}">
        @else
            <link rel="icon" href="/favicon.ico" sizes="any">
            <link rel="icon" href="/favicon.svg" type="image/svg+xml">
            <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        @endif

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
