@extends('layouts.app')

@section('content')
    <div class="row justify-content-center">
        <div class="col-lg-8">

            <div class="text-center mb-4">
                <h1 class="h3 mb-1">Todo List</h1>
            </div>

            <form id="task-form" class="row g-2 mb-3 align-items-center" autocomplete="off">
                <div class="col flex-grow-1">
                    <input type="text" name="title" id="task-title" class="form-control form-control-lg" placeholder="Task title..." maxlength="255" required>
                </div>
                <div class="col-auto">
                    <button type="submit" class="btn btn-primary btn-lg" id="btn-add">+ Add Task</button>
                </div>
            </form>

            <div class="btn-group w-100 mb-3 filter-tabs" role="group" aria-label="Filter tasks">
                <button type="button" class="btn btn-outline-primary active" data-filter="all">All</button>
                <button type="button" class="btn btn-outline-primary" data-filter="pending">Pending</button>
                <button type="button" class="btn btn-outline-primary" data-filter="completed">Completed</button>
            </div>

            <ul id="task-list" class="list-group">
                @forelse ($tasks as $task)
                    @include('tasks.templates.task-item', ['task' => $task])
                @empty
                    <li class="list-group-item text-center text-muted py-4" id="empty-state">
                        No tasks yet
                    </li>
                @endforelse
            </ul>

        </div>
    </div>
@endsection

