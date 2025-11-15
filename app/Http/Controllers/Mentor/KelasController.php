<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rules\In;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:mentor');
    }

    public function index()
    {
        $mentor = auth()->user();

        $kelas = Kelas::with(['category:id,name', 'type:id,name', 'level:id,name'])
            ->where('user_id', $mentor->id)
            ->withCount([
                'transactions as total_sales' => fn ($query) => $query->paid(),
            ])
            ->withSum([
                'transactions as total_revenue' => fn ($query) => $query->paid(),
            ], 'total')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Kelas $kelas) {
                $kelas->total_revenue = (float) ($kelas->total_revenue ?? 0);
                return $kelas;
            });

        return Inertia::render('kelas/index', [
            'kelas' => $kelas,
            'categories' => Category::select('id', 'name')->get(),
            'types' => Type::select('id', 'name')->get(),
            'levels' => Level::select('id', 'name')->get(),
            'canManage' => true,
            'isMentor' => true,
            'canReview' => false,
            'basePath' => '/mentor/kelas',
        ]);
    }

    public function create()
    {
        return Inertia::render('kelas/create', [
            'categories' => Category::select('id', 'name')->get(),
            'types' => Type::select('id', 'name')->get(),
            'levels' => Level::select('id', 'name')->get(),
            'basePath' => '/mentor/kelas',
        ]);
    }

    public function store(Request $request)
    {
        $mentor = auth()->user();

        $validated = $this->validateRequest($request);
        $validated['discount'] = $validated['discount'] ?? 0;
        DB::beginTransaction();

        try {
            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('kelas', 'public');
            }

            $validated['user_id'] = $mentor->id;
            $validated['slug'] = Str::slug($validated['title']);
            $validated['status'] = $validated['status'] ?? Kelas::STATUS_PENDING;

            $kelas = Kelas::create($validated);

            $this->syncSections($kelas, $validated['sections'] ?? []);
            $this->syncQuizzes($kelas, $validated['quizzes'] ?? []);

            DB::commit();

            return redirect()->route('mentor.kelas.index')
                ->with('success', 'Kelas telah disimpan dan menunggu persetujuan admin.');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Gagal menyimpan kelas: ' . $e->getMessage(),
            ]);
        }
    }

    public function show(Kelas $kelas)
    {
        $this->authorizeOwnership($kelas);

        $kelas->load([
            'category:id,name',
            'type:id,name',
            'level:id,name',
            'user:id,name,email',
            'sections.videos',
            'quizzes.quizAnswers',
            'transactions' => fn ($query) => $query->paid()->with('user:id,name'),
        ]);

        return Inertia::render('kelas/show', [
            'kelas' => $kelas,
            'canManage' => true,
            'canReview' => false,
            'basePath' => '/mentor/kelas',
        ]);
    }

    public function edit(Kelas $kelas)
    {
        $this->authorizeOwnership($kelas);

        $kelas->load(['sections.videos', 'quizzes.quizAnswers']);

        return Inertia::render('kelas/edit', [
            'kelas' => $kelas,
            'categories' => Category::select('id', 'name')->get(),
            'types' => Type::select('id', 'name')->get(),
            'levels' => Level::select('id', 'name')->get(),
            'basePath' => '/mentor/kelas',
        ]);
    }

    public function update(Request $request, Kelas $kelas)
    {
        $this->authorizeOwnership($kelas);

        $validated = $this->validateRequest($request, true);
        $validated['discount'] = $validated['discount'] ?? 0;

        DB::beginTransaction();

        try {
            if ($request->hasFile('image')) {
                if ($kelas->image) {
                    Storage::disk('public')->delete($kelas->image);
                }
                $validated['image'] = $request->file('image')->store('kelas', 'public');
            }

            $validated['slug'] = Str::slug($validated['title']);

            $kelas->update($validated);

            $this->syncSections($kelas, $validated['sections'] ?? []);
            $this->syncQuizzes($kelas, $validated['quizzes'] ?? []);

            DB::commit();

            return redirect()->route('mentor.kelas.index')
                ->with('success', 'Kelas berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Gagal memperbarui kelas: ' . $e->getMessage(),
            ]);
        }
    }

    public function destroy(Kelas $kelas)
    {
        $this->authorizeOwnership($kelas);

        if ($kelas->image) {
            Storage::disk('public')->delete($kelas->image);
        }

        $kelas->delete();

        return redirect()->route('mentor.kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }

    protected function validateRequest(Request $request, bool $isUpdate = false): array
    {
        $statusRule = $isUpdate
            ? Rule::in([Kelas::STATUS_DRAFT, Kelas::STATUS_PENDING, Kelas::STATUS_APPROVED, Kelas::STATUS_REJECTED])
            : Rule::in([Kelas::STATUS_DRAFT, Kelas::STATUS_PENDING]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'type_id' => ['required', 'exists:types,id'],
            'level_id' => ['required', 'exists:levels,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'benefit' => ['nullable', 'string'],
            'desc' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'status' => ['required', $statusRule],
            'image' => [$isUpdate ? 'nullable' : 'required', File::image()->max(2 * 1024)],
            'sections' => ['nullable', 'array'],
            'sections.*.id' => ['nullable', 'exists:sections,id'],
            'sections.*.title' => ['required', 'string', 'max:255'],
            'sections.*.videos' => ['nullable', 'array'],
            'sections.*.videos.*.id' => ['nullable', 'exists:videos,id'],
            'sections.*.videos.*.title' => ['required', 'string', 'max:255'],
            'sections.*.videos.*.video' => ['required', 'url'],
            'quizzes' => ['nullable', 'array'],
            'quizzes.*.id' => ['nullable', 'exists:quizzes,id'],
            'quizzes.*.question' => ['required', 'string'],
            'quizzes.*.answer' => ['required'],
            'quizzes.*.image' => ['nullable', File::image()->max(2 * 1024)],
            'quizzes.*.point' => ['required', 'integer', 'min:0'],
        ]);
    }

    protected function syncSections(Kelas $kelas, array $sections): void
    {
        $existingIds = [];

        foreach ($sections as $sectionData) {
            $section = isset($sectionData['id'])
                ? $kelas->sections()->where('id', $sectionData['id'])->firstOrFail()
                : $kelas->sections()->create(['title' => $sectionData['title']]);

            $section->update(['title' => $sectionData['title']]);
            $existingIds[] = $section->id;

            $videoIds = [];
            foreach ($sectionData['videos'] ?? [] as $videoData) {
                $video = isset($videoData['id'])
                    ? $section->videos()->where('id', $videoData['id'])->firstOrFail()
                    : $section->videos()->create([
                        'title' => $videoData['title'],
                        'video' => $videoData['video'],
                    ]);

                $video->update([
                    'title' => $videoData['title'],
                    'video' => $videoData['video'],
                ]);

                $videoIds[] = $video->id;
            }

            $section->videos()->whereNotIn('id', $videoIds)->delete();
        }

        $kelas->sections()->whereNotIn('id', $existingIds)->delete();
    }

    protected function syncQuizzes(Kelas $kelas, array $quizzes): void
    {
        $existingIds = [];

        foreach ($quizzes as $quizData) {
            if (isset($quizData['image']) && $quizData['image'] instanceof \Illuminate\Http\UploadedFile) {
                $quizData['image'] = $quizData['image']->store('quizzes', 'public');
            }

            $payload = Arr::except($quizData, ['answer', 'answers']);

            $quiz = isset($quizData['id'])
                ? $kelas->quizzes()->where('id', $quizData['id'])->firstOrFail()
                : $kelas->quizzes()->create($payload);

            $quiz->update($payload);
            $existingIds[] = $quiz->id;

            $this->syncQuizAnswers($quiz, $quizData['answer'] ?? null, (int) ($quizData['point'] ?? $quiz->point ?? 0));
        }

        $kelas->quizzes()->whereNotIn('id', $existingIds)->delete();
    }

    private function syncQuizAnswers(Quiz $quiz, $answerPayload, int $defaultPoint): void
    {
        $answerIds = [];

        if (is_array($answerPayload) && isset($answerPayload['options'], $answerPayload['correct'])) {
            foreach ((array) $answerPayload['options'] as $option) {
                $isCorrect = $option === $answerPayload['correct'];

                $answer = $quiz->quizAnswers()->updateOrCreate(
                    ['answer' => $option],
                    ['point' => $isCorrect ? $defaultPoint : 0],
                );

                $answerIds[] = $answer->id;
            }
        } elseif (is_string($answerPayload) && $answerPayload !== '') {
            $answer = $quiz->quizAnswers()->updateOrCreate(
                ['answer' => $answerPayload],
                ['point' => $defaultPoint],
            );

            $answerIds[] = $answer->id;
        }

        if (! empty($answerIds)) {
            $quiz->quizAnswers()->whereNotIn('id', $answerIds)->delete();
        } elseif ($answerPayload === null) {
            $quiz->quizAnswers()->delete();
        }
    }

    protected function authorizeOwnership(Kelas $kelas): void
    {
        abort_if($kelas->user_id !== auth()->id(), 403);
    }
}
