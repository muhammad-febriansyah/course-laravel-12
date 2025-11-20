<?php

use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\KelasController as AdminKelasController;
use App\Http\Controllers\Mentor\DashboardController as MentorDashboardController;
use App\Http\Controllers\Mentor\KelasController as MentorKelasController;
use App\Http\Controllers\CertificateTemplateController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsCategoryController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\VisiMisiController;
use App\Presentation\Http\Controllers\Admin\UserController;
use App\Presentation\Http\Controllers\Front\AboutUsController as FrontAboutUsController;
use App\Presentation\Http\Controllers\Front\CheckoutController;
use App\Presentation\Http\Controllers\Front\CourseCatalogController;
use App\Presentation\Http\Controllers\Front\LandingPageController;
use App\Presentation\Http\Controllers\User\CourseLearnController;
use App\Presentation\Http\Controllers\User\LearnController;
use App\Presentation\Http\Controllers\User\ProfileController as UserProfileController;
use App\Presentation\Http\Controllers\User\PurchasedCourseController;
use App\Presentation\Http\Controllers\User\TransactionDetailController;
use App\Presentation\Http\Controllers\User\TransactionHistoryController;
use App\Presentation\Http\Controllers\User\VideoProgressController;
use App\Http\Controllers\User\CertificateController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home/lainnya', [HomeController::class, 'lainnya'])->name('home.lainnya');
Route::get('/blog', [HomeController::class, 'blog'])->name('home.blog');
Route::get('/blog/{slug}', [HomeController::class, 'blogShow'])->name('home.blog.show');
Route::get('/daftar', [HomeController::class, 'register'])->name('home.register');
Route::get('/tentang-kami', FrontAboutUsController::class)->name('about-us');
Route::get('/syarat-ketentuan', [HomeController::class, 'syaratKetentuan'])->name('home.terms');
Route::get('/kebijakan-privasi', [HomeController::class, 'kebijakanPrivasi'])->name('home.privacy');
Route::get('/faq', [HomeController::class, 'faq'])->name('home.faq');
Route::get('/cek-sertifikat', [HomeController::class, 'cekSertifikat'])->name('home.certificates');
Route::post('/api/certificates/verify', [\App\Http\Controllers\Api\CertificateVerificationController::class, 'verify'])->name('api.certificates.verify');
Route::get('/kelas', [HomeController::class, 'kelas'])->name('home.kelas');
Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('home.contact');
Route::get('/courses', [CourseCatalogController::class, 'index'])->name('courses.catalog');
Route::get('/courses/{slug}', [CourseCatalogController::class, 'show'])->name('courses.show');

Route::middleware(['auth', 'verified'])->group(function () {
    // Default dashboard - redirect based on role
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->role === 'mentor') {
            return redirect()->route('mentor.dashboard');
        } else {
            return app(\App\Presentation\Http\Controllers\User\DashboardController::class)($request);
        }
    })->name('dashboard');

    // Admin Dashboard & Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', \App\Presentation\Http\Controllers\User\DashboardController::class)
            ->name('dashboard');

        Route::resource('users', UserController::class);

        // Website Settings
        Route::get('pengaturan', [SettingController::class, 'index'])->name('settings.index');
        Route::post('pengaturan', [SettingController::class, 'update'])->name('settings.update');

        // Mentor Earnings
        Route::get('mentor-earnings', [\App\Http\Controllers\Admin\MentorEarningsController::class, 'index'])->name('mentor-earnings.index');
        Route::get('mentor-earnings/export/pdf', [\App\Http\Controllers\Admin\MentorEarningsController::class, 'exportPdf'])->name('mentor-earnings.export');
        Route::get('mentor-earnings/{mentor}', [\App\Http\Controllers\Admin\MentorEarningsController::class, 'show'])->name('mentor-earnings.show');
        Route::get('mentor-earnings/{mentor}/export/pdf', [\App\Http\Controllers\Admin\MentorEarningsController::class, 'exportMentorPdf'])->name('mentor-earnings.export-detail');

        // Features Management
        Route::resource('features', FeatureController::class)->except(['show', 'create', 'edit']);

        // Categories
        Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
        Route::post('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');

        // Levels
        Route::resource('levels', \App\Http\Controllers\LevelController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Types
        Route::resource('types', \App\Http\Controllers\TypeController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // FAQs
        Route::resource('faqs', \App\Presentation\Http\Controllers\Admin\FaqController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Benefits
        Route::resource('benefits', \App\Http\Controllers\BenefitController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Promo Codes
        Route::resource('promo-codes', \App\Http\Controllers\PromoCodeController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Blog / News
        Route::resource('news', NewsController::class)
            ->only(['index', 'show', 'store', 'update', 'destroy']);
        Route::resource('news-categories', NewsCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Certificate Templates
        Route::resource('certificates', CertificateTemplateController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::post('certificates/{certificate}/preview', [CertificateTemplateController::class, 'preview'])
            ->name('certificates.preview');

        // Term Conditions
        Route::get('term-conditions', [\App\Http\Controllers\TermConditionController::class, 'index'])->name('term-conditions.index');
        Route::post('term-conditions', [\App\Http\Controllers\TermConditionController::class, 'update'])->name('term-conditions.update');

        // Kebijakan Privasi
        Route::get('kebijakan-privasi', [\App\Http\Controllers\KebijakanPrivasiController::class, 'index'])->name('kebijakan-privasi.index');
        Route::post('kebijakan-privasi', [\App\Http\Controllers\KebijakanPrivasiController::class, 'update'])->name('kebijakan-privasi.update');

        // About Us
        Route::get('about-us', [\App\Http\Controllers\AboutUsController::class, 'index'])->name('about-us.index');
        Route::post('about-us', [\App\Http\Controllers\AboutUsController::class, 'update'])->name('about-us.update');
        Route::get('visi-misi', [VisiMisiController::class, 'index'])->name('visi-misi.index');
        Route::post('visi-misi', [VisiMisiController::class, 'update'])->name('visi-misi.update');

        // Transactions (Admin - Read Only + Approve/Reject)
        Route::get('transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
        Route::get('transactions/{transaction}', [\App\Http\Controllers\TransactionController::class, 'show'])->name('transactions.show');
        Route::post('transactions/{transaction}/approve', [\App\Http\Controllers\TransactionController::class, 'approve'])->name('transactions.approve');
        Route::post('transactions/{transaction}/reject', [\App\Http\Controllers\TransactionController::class, 'reject'])->name('transactions.reject');

        // Kelas (Admin can manage all)
        // Force parameter name to {kelas} so implicit model binding works with $kelas
        Route::resource('kelas', AdminKelasController::class)
            ->only(['index', 'show'])
            ->parameters(['kelas' => 'kelas']);
        Route::post('kelas/{kelas}/approve', [AdminKelasController::class, 'approve'])->name('kelas.approve');
        Route::post('kelas/{kelas}/reject', [AdminKelasController::class, 'reject'])->name('kelas.reject');
    });

    // Mentor Dashboard & Routes
    Route::middleware(['role:mentor'])->prefix('mentor')->name('mentor.')->group(function () {
        Route::get('dashboard', [MentorDashboardController::class, 'index'])->name('dashboard');
        Route::resource('kelas', MentorKelasController::class)
            ->parameters(['kelas' => 'kelas']);

        // All Discussions - Global view for mentor
        Route::get('diskusi', [\App\Http\Controllers\Mentor\DiscussionController::class, 'indexAll'])
            ->name('diskusi.index');
        Route::get('diskusi/{discussion}', [\App\Http\Controllers\Mentor\DiscussionController::class, 'showGlobal'])
            ->name('diskusi.show');
        Route::post('diskusi/{discussion}/reply', [\App\Http\Controllers\Mentor\DiscussionController::class, 'reply'])
            ->name('diskusi.reply');

        // Student Management
        Route::get('kelas/{kela}/students', [\App\Http\Controllers\Mentor\StudentController::class, 'index'])
            ->name('kelas.students.index');
        Route::get('kelas/{kela}/students/{enrollment}', [\App\Http\Controllers\Mentor\StudentController::class, 'show'])
            ->name('kelas.students.show');

        // Discussions/Q&A per kelas
        Route::get('kelas/{kela}/discussions', [\App\Http\Controllers\Mentor\DiscussionController::class, 'index'])
            ->name('kelas.discussions.index');
        Route::get('kelas/{kela}/discussions/{discussion}', [\App\Http\Controllers\Mentor\DiscussionController::class, 'show'])
            ->name('kelas.discussions.show');
        Route::post('kelas/{kela}/discussions/{discussion}/reply', [\App\Http\Controllers\Mentor\DiscussionController::class, 'reply'])
            ->name('kelas.discussions.reply');
        Route::post('kelas/{kela}/discussions/{discussion}/resolve', [\App\Http\Controllers\Mentor\DiscussionController::class, 'resolve'])
            ->name('kelas.discussions.resolve');
        Route::post('kelas/{kela}/discussions/{discussion}/unresolve', [\App\Http\Controllers\Mentor\DiscussionController::class, 'unresolve'])
            ->name('kelas.discussions.unresolve');
        Route::delete('kelas/{kela}/discussions/{discussion}', [\App\Http\Controllers\Mentor\DiscussionController::class, 'destroy'])
            ->name('kelas.discussions.destroy');

        // Reviews
        Route::get('kelas/{kela}/reviews', [\App\Http\Controllers\Mentor\ReviewController::class, 'index'])
            ->name('kelas.reviews.index');
        Route::post('kelas/{kela}/reviews/{review}/publish', [\App\Http\Controllers\Mentor\ReviewController::class, 'publish'])
            ->name('kelas.reviews.publish');
        Route::post('kelas/{kela}/reviews/{review}/unpublish', [\App\Http\Controllers\Mentor\ReviewController::class, 'unpublish'])
            ->name('kelas.reviews.unpublish');
        Route::delete('kelas/{kela}/reviews/{review}', [\App\Http\Controllers\Mentor\ReviewController::class, 'destroy'])
            ->name('kelas.reviews.destroy');
    });

    // Legacy redirects for updated admin routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('news', fn() => redirect()->route('admin.news.index'))->name('legacy.news.index');
        Route::get('news-categories', fn() => redirect()->route('admin.news-categories.index'))->name('legacy.news-categories.index');
        Route::get('certificates', fn() => redirect()->route('admin.certificates.index'))->name('legacy.certificates.index');
    });

    // User Routes (for regular users)
    Route::get('checkout/{slug}', [CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('checkout/{slug}', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::middleware(['role:user'])->prefix('dashboard')->name('user.')->group(function () {
        Route::get('learn', LearnController::class)->name('learn');
        Route::get('learn/{slug}', [CourseLearnController::class, 'show'])->name('learn.course');

        // Video progress tracking
        Route::post('videos/{video}/complete', [VideoProgressController::class, 'markAsComplete'])->name('videos.complete');
        Route::post('videos/{video}/watch-time', [VideoProgressController::class, 'updateWatchTime'])->name('videos.watch-time');

        // Discussions
        Route::get('learn/{slug}/discussion', [\App\Http\Controllers\User\DiscussionController::class, 'index'])->name('learn.discussion');
        Route::post('learn/{slug}/discussion', [\App\Http\Controllers\User\DiscussionController::class, 'store'])->name('discussion.store');
        Route::post('learn/{slug}/discussion/{discussion}/reply', [\App\Http\Controllers\User\DiscussionController::class, 'reply'])->name('discussion.reply');

        // Quiz
        Route::get('learn/{slug}/quiz', [\App\Http\Controllers\User\QuizController::class, 'index'])->name('quiz.index');
        Route::post('learn/{slug}/quiz', [\App\Http\Controllers\User\QuizController::class, 'submit'])->name('quiz.submit');
        Route::get('learn/{slug}/quiz/result', [\App\Http\Controllers\User\QuizController::class, 'result'])->name('quiz.result');

        Route::get('purchases', PurchasedCourseController::class)->name('purchases');

        // Certificates
        Route::get('certificates', [CertificateController::class, 'index'])->name('certificates.index');
        Route::get('certificates/{slug}/download', [CertificateController::class, 'download'])->name('certificates.download');

        Route::get('transactions', TransactionHistoryController::class)->name('transactions');
        Route::get('transactions/{transaction}', \App\Presentation\Http\Controllers\User\TransactionDetailController::class)
            ->name('transactions.show');
        Route::get('profile', UserProfileController::class)->name('profile');
    });
});

// Tripay Webhook Callback (No Auth)
Route::post('tripay/callback', [\App\Http\Controllers\TransactionController::class, 'callback'])
    ->name('tripay.callback')
    ->withoutMiddleware([VerifyCsrfToken::class]);

// Google OAuth Routes
Route::get('auth/google', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'callback'])->name('auth.google.callback');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
