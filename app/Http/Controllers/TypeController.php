<?php

namespace App\Http\Controllers;

use App\Http\Requests\Type\StoreTypeRequest;
use App\Http\Requests\Type\UpdateTypeRequest;
use App\Models\Type;
use App\Services\TypeService;
use Inertia\Inertia;

class TypeController extends Controller
{
    public function __construct(
        protected TypeService $typeService,
    ) {
    }

    public function index()
    {
        return Inertia::render('types/index', [
            'types' => $this->typeService->list(),
        ]);
    }

    public function store(StoreTypeRequest $request)
    {
        $this->typeService->create($request->validated());

        return back()->with('success', 'Tipe kelas berhasil ditambahkan.');
    }

    public function update(UpdateTypeRequest $request, Type $type)
    {
        $this->typeService->update($type, $request->validated());

        return back()->with('success', 'Tipe kelas berhasil diperbarui.');
    }

    public function destroy(Type $type)
    {
        $this->typeService->delete($type);

        return back()->with('success', 'Tipe kelas berhasil dihapus.');
    }
}
