<?php

namespace App\Http\Controllers;

use App\Http\Requests\Level\StoreLevelRequest;
use App\Http\Requests\Level\UpdateLevelRequest;
use App\Models\Level;
use App\Services\LevelService;
use Inertia\Inertia;

class LevelController extends Controller
{
    public function __construct(
        protected LevelService $levelService,
    ) {
    }

    public function index()
    {
        return Inertia::render('levels/index', [
            'levels' => $this->levelService->list(),
        ]);
    }

    public function store(StoreLevelRequest $request)
    {
        $this->levelService->create($request->validated());

        return back()->with('success', 'Level berhasil ditambahkan.');
    }

    public function update(UpdateLevelRequest $request, Level $level)
    {
        $this->levelService->update($level, $request->validated());

        return back()->with('success', 'Level berhasil diperbarui.');
    }

    public function destroy(Level $level)
    {
        $this->levelService->delete($level);

        return back()->with('success', 'Level berhasil dihapus.');
    }
}
