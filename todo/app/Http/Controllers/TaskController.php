<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

/**
 * TaskController
 * Controller for managing tasks
 * All changes actions return JSON without refreshing the page
 * @package App\Http\Controllers
 */

class TaskController extends Controller
{
    /**
     * Display a listing of all tasks with small filter (all, completed, pending)
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'all');
        $query = Task::query();

        if ($filter === 'completed') {
            $query->where('completed', true);
        } elseif ($filter === 'pending') {
            $query->where('completed', false);
        }

        $tasks = $query->get();
        return view('tasks.index', compact('tasks', 'filter'));
    }


    /**
     * Store a new created task in storage - via POST (AJAX)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create($data)->fresh();

        return response()->json([
            'success' => true,
            'task' => $task,
        ], 201);
    }

    /**
     * Toggle the completed status of a task
     *
     * @param string $id
     * @return JsonResponse
     */
    public function toggle($id)
    {
        $task = Task::findOrFail($id);
        $task->completed = !$task->completed;
        $task->save();

        return response()->json([
            'success' => true,
            'task' => $task,
        ]);
    }

    /**
     * Update the specified task in storage - via PUT/PATCH (AJAX)
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task->update($data);

        return response()->json([
            'success' => true,
            'task' => $task,
        ]);
    }

    /**
      * Remove the specified task - via DELETE (AJAX)
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
