
@php $done = $task->completed ? '1' : '0'; @endphp
<li class="list-group-item d-flex align-items-center justify-content-between gap-2 task-item {{ $task->completed ? 'is-completed' : '' }}"
    data-id="{{ $task->id }}" data-completed="{{ $done }}">

    <div class="d-flex align-items-center gap-2 flex-grow-1 task-main">
        <button type="button" class="btn btn-sm btn-toggle {{ $task->completed ? 'btn-success' : 'btn-outline-secondary' }}"
                title="Mark as {{ $task->completed ? 'pending' : 'completed' }}">
            @if ($task->completed) ✓ @else ○ @endif
        </button>

        <span class="task-title">{{ $task->title }}</span>
    </div>

    <div class="task-actions d-flex gap-1">
        <button type="button" class="btn btn-sm btn-outline-primary btn-edit" title="Edit">✎</button>
        <button type="button" class="btn btn-sm btn-outline-danger btn-delete" title="Delete">🗑</button>
    </div>
</li>
