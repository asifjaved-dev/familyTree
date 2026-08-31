<?php

use App\Http\Controllers\PersonController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PersonController::class, 'home'])->name('home');

Route::get('/dashboard', [PersonController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::put('/tree', [PersonController::class, 'sync'])->name('tree.sync');

    Route::get('/familylist', [PersonController::class, 'list'])->name('familylist');
});

require __DIR__.'/auth.php';
