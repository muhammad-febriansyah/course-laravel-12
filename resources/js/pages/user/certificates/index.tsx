import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';
import { Award, Download, Trophy, CheckCircle2 } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    instructor: {
        name: string;
    };
    completed_at: string;
    quiz_score: number;
    quiz_total: number;
}

interface Props {
    completedCourses: Course[];
}

export default function CertificatesIndex({ completedCourses }: Props) {
    const handleDownload = (slug: string) => {
        router.get(`/dashboard/certificates/${slug}/download`);
    };

    const getScorePercentage = (score: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((score / total) * 100);
    };

    const getGradeColor = (percentage: number) => {
        if (percentage >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-600';
        if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-600';
        if (percentage >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-600';
        if (percentage >= 60) return 'text-amber-600 bg-amber-50 border-amber-600';
        return 'text-red-600 bg-red-50 border-red-600';
    };

    return (
        <>
            <Head title="Sertifikat Saya" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    Sertifikat Saya
                                </h1>
                                <p className="text-slate-600">
                                    Koleksi sertifikat kelas yang telah Anda selesaikan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    {completedCourses.length > 0 && (
                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="border-2 border-blue-200 bg-blue-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                                            <Trophy className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">
                                                Total Sertifikat
                                            </p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {completedCourses.length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Certificates Grid */}
                    {completedCourses.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {completedCourses.map((course) => {
                                const percentage = getScorePercentage(course.quiz_score, course.quiz_total);
                                const gradeColor = getGradeColor(percentage);

                                return (
                                    <Card
                                        key={course.id}
                                        className="group overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <CardContent className="p-0">
                                            {/* Thumbnail */}
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Award className="h-16 w-16 text-white opacity-50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <Badge className="bg-white/90 text-emerald-600 backdrop-blur-sm">
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                        Selesai
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        Instruktur: {course.instructor.name}
                                                    </p>
                                                </div>

                                                {/* Score */}
                                                <div className={`rounded-lg border-2 p-3 ${gradeColor}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-medium opacity-80">
                                                                Skor Quiz
                                                            </p>
                                                            <p className="text-xl font-bold">
                                                                {course.quiz_score} / {course.quiz_total}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-medium opacity-80">
                                                                Persentase
                                                            </p>
                                                            <p className="text-xl font-bold">
                                                                {percentage}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Completion Date */}
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">
                                                        Selesai: {course.completed_at}
                                                    </span>
                                                </div>

                                                {/* Download Button */}
                                                <Button
                                                    onClick={() => handleDownload(course.slug)}
                                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Sertifikat
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                    <Award className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900">
                                    Belum Ada Sertifikat
                                </h3>
                                <p className="mb-6 max-w-md text-slate-600">
                                    Anda belum menyelesaikan kelas apapun. Selesaikan semua video dan quiz untuk mendapatkan sertifikat!
                                </p>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <a href="/dashboard/learn">
                                        Mulai Belajar
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
