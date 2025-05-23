<?php

use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/', [ScoreController::class, 'index'])->name('home');
Route::post('/lookup', [ScoreController::class, 'lookup'])->name('score.lookup');
Route::get('/statistics', [ScoreController::class, 'statistics'])->name('statistics');
Route::get('/api/statistics', [ScoreController::class, 'getStatistics'])->name('api.statistics');
Route::get('/top-khoi-a', [ScoreController::class, 'topKhoiA'])->name('top.khoi.a');
Route::get('/api/top-khoi-a', [ScoreController::class, 'getTopKhoiA'])->name('api.top.khoi.a');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
