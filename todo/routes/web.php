<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TaskController::class, 'index'])->name('tasks.index');
Route::post('/', [TaskController::class, 'store'])->name('tasks.store');
Route::get('/{id}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
Route::put('/{id}', [TaskController::class, 'update'])->name('tasks.update');
Route::delete('/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
Route::post('/{id}/toggle', [TaskController::class, 'toggle'])->name('tasks.toggle');
