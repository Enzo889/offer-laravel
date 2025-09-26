<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/marketplace', function () {
    return Inertia::render('marketplace/index');
})->name('marketplace.index');

Route::get('/marketplace/{id}', function ($id) {
    return Inertia::render('marketplace/[id]/index', [
        'id' => $id, // Enviamos el ID como prop
    ]);
})->name('marketplace.show');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
