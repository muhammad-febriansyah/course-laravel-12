import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import user from '@/routes/user';
import {
    ArrowLeft,
    Clock,
    Award,
    AlertCircle,
    CheckCircle2,
    Trophy
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Answer {
    id: number;
    answer: string;
    point: number;
}

interface Quiz {
    id: number;
    question: string;
    image: string | null;
    point: number;
    answers: Answer[];
}

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
    quizzes: Quiz[];
    currentAttempt: number;
    remainingAttempts: number;
    previousAttempts: Attempt[];
}

export default function QuizPage({
    course,
    quizzes,
    currentAttempt,
    remainingAttempts,
    previousAttempts
}: Props) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug: Log quiz data
    console.log('Quiz data received:', quizzes);
    console.log('Current question index:', currentQuestionIndex);

    const currentQuestion = quizzes[currentQuestionIndex];
    console.log('Current question:', currentQuestion);
    console.log('Current question answers:', currentQuestion?.answers);
    const progress = ((currentQuestionIndex + 1) / quizzes.length) * 100;
    const isLastQuestion = currentQuestionIndex === quizzes.length - 1;
    const hasAnsweredCurrent = userAnswers[currentQuestion.id] !== undefined;

    const handleSelectAnswer = (quizId: number, answerId: number) => {
        setUserAnswers(prev => ({
            ...prev,
            [quizId]: answerId
        }));
    };

    const handleNext = () => {
        if (!hasAnsweredCurrent) {
            toast.error('Pilih jawaban terlebih dahulu!');
            return;
        }

        if (isLastQuestion) {
            handleSubmit();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Check if all questions are answered
        const unansweredCount = quizzes.filter(q => userAnswers[q.id] === undefined).length;

        if (unansweredCount > 0) {
            toast.error(`Masih ada ${unansweredCount} soal yang belum dijawab!`);
            return;
        }

        if (!confirm('Apakah Anda yakin ingin mengumpulkan quiz ini? Jawaban tidak dapat diubah setelah dikumpulkan.')) {
            return;
        }

        setIsSubmitting(true);

        const answers = Object.entries(userAnswers).map(([quizId, answerId]) => ({
            quiz_id: parseInt(quizId),
            answer_id: answerId
        }));

        router.post(user.quiz.submit.url(course.slug), { answers }, {
            onSuccess: () => {
                toast.success('Quiz berhasil diselesaikan!');
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat mengumpulkan quiz!');
                setIsSubmitting(false);
            }
        });
    };

    const totalMaxScore = quizzes.reduce((sum, q) => sum + q.point, 0);

    return (
        <>
            <Head title={`Quiz - ${course.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
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
                                        Quiz - Percobaan ke-{currentAttempt}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="hidden sm:flex">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {currentQuestionIndex + 1} / {quizzes.length}
                                </Badge>
                                <Badge variant="outline" className="hidden sm:flex">
                                    <Trophy className="mr-1 h-3 w-3" />
                                    Sisa: {remainingAttempts}x
                                </Badge>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-slate-200">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Info Alert */}
                        {currentQuestionIndex === 0 && (
                            <Card className="border-blue-200 bg-blue-50">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-blue-900">
                                                Informasi Quiz
                                            </p>
                                            <ul className="space-y-1 text-xs text-blue-800">
                                                <li>• Total {quizzes.length} soal dengan skor maksimal {totalMaxScore} poin</li>
                                                <li>• Anda memiliki {remainingAttempts}x kesempatan tersisa</li>
                                                <li>• Jawaban tidak dapat diubah setelah dikumpulkan</li>
                                                <li>• Pastikan semua soal sudah dijawab sebelum mengumpulkan</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Previous Attempts */}
                        {previousAttempts.length > 0 && currentQuestionIndex === 0 && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Award className="h-4 w-4 text-amber-600" />
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Percobaan Sebelumnya
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {previousAttempts.map((attempt) => (
                                            <div
                                                key={attempt.attempt_number}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                                            >
                                                <div>
                                                    <p className="text-xs font-medium text-slate-700">
                                                        Percobaan #{attempt.attempt_number}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {attempt.completed_at}
                                                    </p>
                                                </div>
                                                <Badge variant={attempt.score >= totalMaxScore * 0.7 ? 'default' : 'secondary'}>
                                                    {attempt.score} / {totalMaxScore * attempt.total_questions / quizzes.length}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Question Card */}
                        <Card className="border-2">
                            <CardContent className="p-6 sm:p-8">
                                <div className="space-y-6">
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                    Soal {currentQuestionIndex + 1}
                                                </span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {currentQuestion.point} poin
                                                </Badge>
                                            </div>
                                            <h2 className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
                                                {currentQuestion.question}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Question Image */}
                                    {currentQuestion.image && (
                                        <div className="overflow-hidden rounded-xl border border-slate-200">
                                            <img
                                                src={currentQuestion.image}
                                                alt="Question illustration"
                                                className="h-auto w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Answer Options */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-slate-700">
                                            Pilih Jawaban:
                                        </p>
                                        <div className="space-y-3">
                                            {currentQuestion.answers.map((answer, index) => {
                                                const isSelected = userAnswers[currentQuestion.id] === answer.id;
                                                const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

                                                return (
                                                    <button
                                                        key={answer.id}
                                                        onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                                                        className={cn(
                                                            "w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
                                                            "hover:border-blue-300 hover:bg-blue-50",
                                                            isSelected
                                                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                                                : "border-slate-200 bg-white"
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={cn(
                                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold transition-colors",
                                                                isSelected
                                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                                    : "border-slate-300 bg-white text-slate-600"
                                                            )}>
                                                                {isSelected ? (
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                ) : (
                                                                    <span className="text-sm">{optionLabel}</span>
                                                                )}
                                                            </div>
                                                            <p className="flex-1 pt-1 text-sm font-medium leading-relaxed text-slate-900">
                                                                {answer.answer}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={handlePrevious}
                                            disabled={currentQuestionIndex === 0}
                                            className="w-full sm:w-auto"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Sebelumnya
                                        </Button>

                                        <Button
                                            onClick={handleNext}
                                            disabled={!hasAnsweredCurrent || isSubmitting}
                                            className={cn(
                                                "w-full sm:w-auto",
                                                isLastQuestion && "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <>Mengumpulkan...</>
                                            ) : isLastQuestion ? (
                                                <>
                                                    Selesai & Kumpulkan
                                                    <Trophy className="ml-2 h-4 w-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Selanjutnya
                                                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Question Navigator */}
                        <Card>
                            <CardContent className="p-4">
                                <p className="mb-3 text-xs font-medium text-slate-700">
                                    Navigasi Soal:
                                </p>
                                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                                    {quizzes.map((quiz, index) => {
                                        const isAnswered = userAnswers[quiz.id] !== undefined;
                                        const isCurrent = index === currentQuestionIndex;

                                        return (
                                            <button
                                                key={quiz.id}
                                                onClick={() => setCurrentQuestionIndex(index)}
                                                className={cn(
                                                    "flex h-10 w-full items-center justify-center rounded-lg border-2 text-sm font-bold transition-all",
                                                    isCurrent
                                                        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                                                        : isAnswered
                                                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded border-2 border-emerald-600 bg-emerald-50" />
                                        <span>Terjawab ({Object.keys(userAnswers).length})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded border-2 border-slate-200 bg-white" />
                                        <span>Belum ({quizzes.length - Object.keys(userAnswers).length})</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
