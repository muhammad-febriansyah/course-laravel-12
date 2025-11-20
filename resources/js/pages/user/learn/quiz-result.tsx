import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import user from '@/routes/user';
import {
    ArrowLeft,
    Trophy,
    Award,
    RotateCcw,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Star
} from 'lucide-react';

interface Course {
    id: number;
    title: string;
    slug: string;
}

interface Attempt {
    attempt_number: number;
    score: number;
    total_questions: number;
    completed_at: string;
}

interface Props {
    course: Course;
    attempt: Attempt;
    canRetake?: boolean;
    remainingAttempts?: number;
    allAttempts?: Attempt[];
    maxAttemptsReached?: boolean;
}

export default function QuizResultPage({
    course,
    attempt,
    canRetake = false,
    remainingAttempts = 0,
    allAttempts = [],
    maxAttemptsReached = false
}: Props) {
    // Calculate percentage and grade
    // Each question is worth 10 points
    const maxScorePerQuestion = 10;
    const maxPossibleScore = attempt.total_questions * maxScorePerQuestion;
    const percentage = (attempt.score / maxPossibleScore) * 100;

    const getGrade = (percent: number) => {
        if (percent >= 90) return { grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-600' };
        if (percent >= 80) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-600' };
        if (percent >= 70) return { grade: 'B', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-600' };
        if (percent >= 60) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-600' };
        return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-600' };
    };

    const gradeInfo = getGrade(percentage);
    const isPassing = percentage >= 60;

    // Find highest score
    const highestScore = allAttempts.length > 0
        ? Math.max(...allAttempts.map(a => a.score))
        : attempt.score;

    const isNewHighScore = attempt.score >= highestScore;

    return (
        <>
            <Head title={`Hasil Quiz - ${course.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={user.learn.course.url(course.slug)}>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                                        {course.title}
                                    </h1>
                                    <p className="text-xs text-slate-500">
                                        Hasil Quiz
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Result Card */}
                        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur">
                            <CardContent className="p-6 sm:p-8 lg:p-10">
                                <div className="space-y-8">
                                    {/* Icon & Status */}
                                    <div className="text-center">
                                        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 ${gradeInfo.bg} ${gradeInfo.border} sm:h-24 sm:w-24`}>
                                            {isPassing ? (
                                                <Trophy className={`h-12 w-12 ${gradeInfo.color}`} />
                                            ) : (
                                                <XCircle className="h-12 w-12 text-red-600" />
                                            )}
                                        </div>
                                        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                            {isPassing ? 'Selamat! Quiz Selesai!' : 'Quiz Selesai'}
                                        </h2>
                                        <p className="text-slate-600">
                                            {isPassing
                                                ? 'Anda telah menyelesaikan quiz dengan baik!'
                                                : 'Jangan menyerah! Coba lagi untuk hasil lebih baik.'}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Score Display */}
                                    <div className="space-y-6">
                                        {/* Main Score */}
                                        <div className="text-center">
                                            <div className={`mx-auto mb-4 inline-flex items-center gap-4 rounded-2xl border-2 px-6 py-5 shadow-lg ${gradeInfo.bg} ${gradeInfo.border} sm:px-8 sm:py-6`}>
                                                <div className="text-center">
                                                    <span className={`block text-5xl font-bold ${gradeInfo.color} sm:text-6xl md:text-7xl`}>
                                                        {attempt.score}
                                                    </span>
                                                    <div className="mt-1">
                                                        <p className="text-sm font-medium text-slate-600">
                                                            dari {maxPossibleScore} poin
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {isNewHighScore && allAttempts.length > 1 && (
                                                <Badge variant="default" className="mb-3 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-sm">
                                                    <Star className="mr-1.5 h-4 w-4" />
                                                    Skor Tertinggi Baru!
                                                </Badge>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-stretch justify-center gap-3">
                                                <div className={`flex min-w-[9rem] flex-col justify-center rounded-xl border-2 px-4 py-3 text-center ${gradeInfo.bg} ${gradeInfo.border} sm:min-w-[10rem]`}>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-600">Persentase</p>
                                                        <p className={`text-2xl font-bold ${gradeInfo.color}`}>
                                                            {percentage.toFixed(1)}%
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex min-w-[9rem] flex-col justify-center rounded-xl border-2 px-4 py-3 text-center ${gradeInfo.bg} ${gradeInfo.border} sm:min-w-[10rem]`}>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-600">Nilai</p>
                                                        <p className={`text-2xl font-bold ${gradeInfo.color}`}>
                                                            {gradeInfo.grade}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex min-w-[9rem] flex-col justify-center rounded-xl border-2 px-4 py-3 text-center ${gradeInfo.bg} ${gradeInfo.border} sm:min-w-[10rem]`}>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-600">Benar</p>
                                                        <p className={`text-2xl font-bold ${gradeInfo.color}`}>
                                                            {attempt.score / 10} / {attempt.total_questions}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                        <Award className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-600">
                                                            Percobaan
                                                        </p>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            #{attempt.attempt_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-600">
                                                            Total Soal
                                                        </p>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            {attempt.total_questions}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                            <p className="text-xs font-medium text-slate-600">
                                                Diselesaikan pada
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {attempt.completed_at}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        {canRetake && !maxAttemptsReached ? (
                                            <div className="space-y-3">
                                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                                                    <p className="text-sm font-medium text-blue-900">
                                                        Anda memiliki <span className="font-bold">{remainingAttempts}x</span> kesempatan lagi
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link href={user.learn.course.url(course.slug)}>
                                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                                            Kembali ke Kelas
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link href={user.quiz.index.url(course.slug)}>
                                                            <RotateCcw className="mr-2 h-4 w-4" />
                                                            Coba Lagi
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {maxAttemptsReached && (
                                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
                                                        <p className="text-sm font-medium text-amber-900">
                                                            Anda telah mencapai batas maksimal 3x percobaan
                                                        </p>
                                                    </div>
                                                )}
                                                <Button
                                                    className="w-full"
                                                    asChild
                                                >
                                                    <Link href={user.learn.course.url(course.slug)}>
                                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                                        Kembali ke Kelas
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* All Attempts History */}
                        {allAttempts.length > 0 && (
                            <Card className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 shrink-0 text-indigo-600" />
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Riwayat Percobaan
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {allAttempts.map((attemptItem) => {
                                            const attemptPercentage = (attemptItem.score / (attemptItem.total_questions * maxScorePerQuestion)) * 100;
                                            const attemptGrade = getGrade(attemptPercentage);
                                            const isCurrent = attemptItem.attempt_number === attempt.attempt_number;
                                            const isHighest = attemptItem.score === highestScore;

                                            return (
                                                <div
                                                    key={attemptItem.attempt_number}
                                                    className={`flex items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all ${
                                                        isCurrent
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-slate-200 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${attemptGrade.bg} border-2 ${attemptGrade.border} sm:h-12 sm:w-12`}>
                                                            <span className={`text-base font-bold ${attemptGrade.color} sm:text-lg`}>
                                                                #{attemptItem.attempt_number}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                    Percobaan #{attemptItem.attempt_number}
                                                                </p>
                                                                {isCurrent && (
                                                                    <Badge variant="default" className="shrink-0 text-xs">
                                                                        Terbaru
                                                                    </Badge>
                                                                )}
                                                                {isHighest && allAttempts.length > 1 && (
                                                                    <Badge variant="default" className="shrink-0 bg-amber-500 text-xs">
                                                                        <Star className="mr-1 h-3 w-3" />
                                                                        Tertinggi
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="truncate text-xs text-slate-500">
                                                                {attemptItem.completed_at}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <p className={`text-lg font-bold ${attemptGrade.color} sm:text-xl`}>
                                                            {attemptItem.score}
                                                        </p>
                                                        <p className="text-xs text-slate-500 whitespace-nowrap">
                                                            {attemptPercentage.toFixed(1)}% ({attemptGrade.grade})
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
