$(function () {

    'use strict';

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    let currentFilter = 'all';

    function renderTaskRow(task) {
        const completed = (task.completed === true || task.completed === 1 || task.completed === '1');
        const itemClass = completed ? 'is-completed' : '';
        const btnClass = completed ? 'btn-success' : 'btn-outline-secondary';
        const icon = completed ? '✓' : '○';

        return '' +
            '<li class="list-group-item d-flex align-items-center justify-content-between gap-2 task-item ' + itemClass + '"' +
                ' data-id="' + task.id + '" data-completed="' + (completed ? '1' : '0') + '">' +
                '<div class="d-flex align-items-center gap-2 grow task-main">' +
                    '<button type="button" class="btn btn-sm btn-toggle ' + btnClass + '" title="Toggle completion">' + icon + '</button>' +
                    '<span class="task-title">' + task.title + '</span>' +
                '</div>' +
                renderStandardActions() +
            '</li>';
    }

    function renderStandardActions() {
        return '' +
            '<div class="task-actions d-flex gap-1">' +
                '<button type="button" class="btn btn-sm btn-outline-primary btn-edit" title="Edit">✎</button>' +
                '<button type="button" class="btn btn-sm btn-outline-danger btn-delete" title="Delete">🗑</button>' +
            '</div>';
    }

    function applyFilter() {
        $('#task-list .task-item').each(function () {
            const completed = ($(this).attr('data-completed') === '1');
            let show = true;
            if (currentFilter === 'completed') show = completed;
            else
            $(this)
                .toggleClass('d-flex', show)
                .toggleClass('d-none', !show);
        });
        updateEmptyState();
    }

    function updateEmptyState() {
        const $list = $('#task-list');
        const $items = $list.find('.task-item');
        const visibleCount = $items.filter(function () { return $(this).is(':visible'); }).length;

        $list.find('#empty-state').remove();

        if ($items.length === 0) {
            $list.append('<li id="empty-state" class="list-group-item text-center text-muted py-4">No tasks</li>');
        } else if (visibleCount === 0) {
            const msg = (currentFilter === 'completed') ? 'No completed tasks' : 'No pending tasks';
            $list.append('<li id="empty-state" class="list-group-item text-center text-muted py-4">' + msg + '</li>');
        }
    }

    function updateRowState($li, task) {
        const completed = (task.completed === true || task.completed === 1 || task.completed === '1');
        $li.attr('data-completed', completed ? '1' : '0');
        $li.toggleClass('is-completed', completed);
        const $btn = $li.find('.btn-toggle');
        $btn.removeClass('btn-success btn-outline-secondary')
            .addClass(completed ? 'btn-success' : 'btn-outline-secondary')
            .text(completed ? '✓' : '○');
    }

    function renderEditActions() {
        return '' +
            '<div class="task-actions-edit d-flex gap-1">' +
                '<button type="button" class="btn btn-sm btn-success btn-save">Save</button>' +
                '<button type="button" class="btn btn-sm btn-outline-secondary btn-cancel">Cancel</button>' +
            '</div>';
    }

    $('#task-form').on('submit', function (e) {
        e.preventDefault();

        const $input = $('#task-title');
        const title = $input.val().trim();
        if (!title) return;

        const $btn = $('#btn-add');
        const originalText = $btn.text();
        $btn.prop('disabled', true).text('Loading...');

        $.ajax({
            url: '/',
            method: 'POST',
            data: { title: title },
            dataType: 'json'
        }).done(function (res) {
            $('#task-list').prepend(renderTaskRow(res.task));
            $input.val('').focus();
            applyFilter();
        }).fail(function (xhr) {
            // Handle error
        }).always(function () {
            $btn.prop('disabled', false).text(originalText);
        });
    });

    $('#task-list').on('click', '.btn-toggle', function () {
        const $li = $(this).closest('.task-item');
        const id = $li.data('id');
        const $btn = $(this);
        $btn.prop('disabled', true);

        $.ajax({
            url: '/' + id + '/toggle',
            method: 'POST',
            dataType: 'json'
        }).done(function (res) {
            updateRowState($li, res.task);
            applyFilter();
        }).fail(function (xhr) {
            // Handle error
        }).always(function () {
            $btn.prop('disabled', false);
        });
    });

    $('#task-list').on('click', '.btn-delete', function () {
        const $li = $(this).closest('.task-item');
        const id = $li.data('id');

        if (!confirm('Delete this task?')) return;

        $.ajax({
            url: '/' + id,
            method: 'DELETE',
            dataType: 'json'
        }).done(function () {
            $li.fadeOut(150, function () {
                $li.remove();
                updateEmptyState();
            });
        }).fail(function (xhr) {
            // Handle error
        });
    });

    $('#task-list').on('click', '.btn-edit', function () {
        const $li = $(this).closest('.task-item');
        if ($li.hasClass('editing')) return;
        $li.addClass('editing');

        const $title = $li.find('.task-title');
        const oldTitle = $title.text();

        const $input = $('<input type="text" class="form-control form-control-sm task-edit-input" maxlength="255">')
            .val(oldTitle)
            .data('old-title', oldTitle);
        $title.replaceWith($input);
        $li.find('.task-actions').replaceWith(renderEditActions());

        $input.focus();
        $input[0].setSelectionRange(0, oldTitle.length);
    });

    $('#task-list').on('click', '.btn-save', function () {
        const $li = $(this).closest('.task-item');
        const $input = $li.find('.task-edit-input');
        const id = $li.data('id');
        const newTitle = $input.val().trim();

        if (!newTitle) {
            $input.focus();
            return;
        }

        $.ajax({
            url: '/' + id,
            method: 'PUT',
            data: { title: newTitle },
            dataType: 'json'
        }).done(function (res) {
            $input.replaceWith($('<span class="task-title"></span>').text(res.task.title));
            $li.find('.task-actions-edit').replaceWith(renderStandardActions());
            $li.removeClass('editing');
        }).fail(function (xhr) {
            // Handle error
        });
    });

    $('#task-list').on('click', '.btn-cancel', function () {
        const $li = $(this).closest('.task-item');
        const $input = $li.find('.task-edit-input');
        const oldTitle = $input.data('old-title');
        $input.replaceWith($('<span class="task-title"></span>').text(oldTitle));
        $li.find('.task-actions-edit').replaceWith(renderStandardActions());
        $li.removeClass('editing');
    });

    $('.filter-tabs').on('click', 'button', function () {
        $('.filter-tabs button').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        applyFilter();
    });

    updateEmptyState();
});
