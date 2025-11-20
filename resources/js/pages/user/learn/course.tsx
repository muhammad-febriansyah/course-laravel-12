import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import user from '@/routes/user';
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    PlayCircle,
    Award,
    Menu,
    X,
    ArrowLeft,
    MessageCircle,
    Trophy
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Video {
    id: number;
    title: string;
    slug: string;
    video: string;
    embedUrl: string;
    isCompleted?: boolean;
    watchDuration?: number;
    lastWatchedAt?: string | null;
}

interface Section {
    id: number;
    title: string;
    videos: Video[];
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    category: {
        id: number;
        name: string;
    } | null;
    level: {
        id: number;
        name: string;
    } | null;
    mentor: {
        id: number;
        name: string;
    } | null;
}

interface Enrollment {
    id: number;
    progress: number;
    videosCompleted: number;
    quizzesCompleted: number;
    status: string;
}

interface CourseLearnPageProps {
    course: Course;
    sections: Section[];
    enrollment: Enrollment;
    firstVideo: Video | null;
}

export default function CourseLearnPage({
    course,
    sections,
    enrollment,
    firstVideo
}: CourseLearnPageProps) {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(firstVideo);
    const [expandedSections, setExpandedSections] = useState<number[]>(
        sections.map((s) => s.id)
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleSection = (sectionId: number) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleVideoSelect = (video: Video) => {
        setSelectedVideo(video);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const totalVideos = sections.reduce((sum, section) => sum + section.videos.length, 0);
    const completedVideos = enrollment.videosCompleted || 0;
    const allVideosCompleted = totalVideos > 0 && completedVideos === totalVideos;

    const findNextVideo = (currentVideo: Video): Video | null => {
        let foundCurrent = false;

        // Loop through all sections and videos
        for (const section of sections) {
            for (const video of section.videos) {
                // If we found the current video in previous iteration, return this one
                if (foundCurrent) {
                    return video;
                }
                // Mark that we found the current video
                if (video.id === currentVideo.id) {
                    foundCurrent = true;
                }
            }
        }

        // No next video found (current video is the last one)
        return null;
    };

    const handleMarkComplete = () => {
        if (!selectedVideo) return;

        // Find next video before making request
        const nextVideo = findNextVideo(selectedVideo);

        router.post(`/dashboard/videos/${selectedVideo.id}/complete`, {}, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: (page) => {
                toast.success('Video berhasil ditandai selesai!');

                // Check if all videos are now completed
                const updatedSections = (page.props.sections as Section[]) || sections;
                const allVideos = updatedSections.flatMap(s => s.videos);
                const completedCount = allVideos.filter(v => v.isCompleted).length;
                const totalVideos = allVideos.length;
                const allCompleted = completedCount === totalVideos;

                // Auto-play next video if exists
                if (nextVideo) {
                    setTimeout(() => {
                        setSelectedVideo(nextVideo);

                        // Scroll to top smoothly
                        const mainContent = document.getElementById('main-content');
                        if (mainContent) {
                            mainContent.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }
                    }, 500);
                } else {
                    // This is the last video
                    if (allCompleted) {
                        // All videos completed: quiz button / completion UI already reacts to updated props
                    }
                }
            },
            onError: (errors) => {
                toast.error('Gagal menandai video selesai!');
            },
        });
    };

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    // Detect scroll for glass effect on navbar
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        const handleScroll = () => {
            setIsScrolled(mainContent.scrollTop > 10);
        };

        mainContent.addEventListener('scroll', handleScroll);
        return () => mainContent.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title={`Belajar - ${course.title}`} />

            <div className="flex h-screen flex-col bg-slate-50">
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Course Content (Left) */}
                    <aside
                        className={cn(
                            'fixed inset-y-0 left-0 z-40 w-80 transform border-r bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="relative z-40 flex h-full flex-col bg-white">
                            {/* Sidebar Header */}
                            <div className="shrink-0 border-b px-5 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="flex items-center gap-2 text-base font-semibold leading-tight text-slate-900">
                                            <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                                            <span>Materi Kelas</span>
                                        </h3>
                                        <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
                                            {sections.length} Section • {totalVideos} Video
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 lg:hidden"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Course Sections */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="space-y-2 p-4">
                                    {sections.map((section, sectionIndex) => (
                                        <Card key={section.id} className="overflow-hidden border-slate-200 shadow-sm">
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className="flex w-full items-center justify-between gap-3 bg-slate-50/80 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                                    {expandedSections.includes(section.id) ? (
                                                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-600" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-slate-500">
                                                            Section {sectionIndex + 1}
                                                        </div>
                                                        <div className="mt-1 truncate text-sm font-semibold leading-tight text-slate-900">
                                                            {section.title}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="shrink-0 px-2 py-0.5 text-[10px] font-medium leading-tight">
                                                    {section.videos.length}
                                                </Badge>
                                            </button>

                                            {expandedSections.includes(section.id) && (
                                                <CardContent className="space-y-0 p-0">
                                                    {section.videos.map((video, videoIndex) => {
                                                        const isActive = selectedVideo?.id === video.id;
                                                        return (
                                                            <button
                                                                key={video.id}
                                                                onClick={() => handleVideoSelect(video)}
                                                                className={cn(
                                                                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-all',
                                                                    isActive
                                                                        ? 'bg-primary/10 text-primary'
                                                                        : 'hover:bg-slate-50'
                                                                )}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold leading-none',
                                                                        isActive
                                                                            ? 'bg-primary text-white'
                                                                            : 'bg-slate-100 text-slate-600'
                                                                    )}
                                                                >
                                                                    {isActive ? (
                                                                        <PlayCircle className="h-4 w-4" />
                                                                    ) : (
                                                                        videoIndex + 1
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className={cn(
                                                                        "truncate text-xs font-medium leading-snug",
                                                                        isActive ? "text-primary" : "text-slate-700"
                                                                    )}>
                                                                        {video.title}
                                                                    </div>
                                                                </div>
                                                                <CheckCircle2
                                                                    className={cn(
                                                                        'h-4 w-4 shrink-0',
                                                                        video.isCompleted
                                                                            ? 'text-emerald-500 fill-emerald-500'
                                                                            : 'text-slate-300'
                                                                    )}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Video Player */}
                    <main id="main-content" className="flex flex-1 flex-col overflow-y-auto bg-white touch-pan-y overscroll-contain">
                        {/* Sticky Header with Glass Effect */}
                        <header className={cn(
                            "sticky top-0 z-20 border-b transition-all duration-300",
                            isScrolled
                                ? "bg-white/80 backdrop-blur-lg shadow-sm"
                                : "bg-white"
                        )}>
                            <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6 lg:py-4">
                                <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-4">
                                    {/* Mobile Menu Toggle */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 lg:hidden"
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    >
                                        {isSidebarOpen ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Menu className="h-5 w-5" />
                                        )}
                                    </Button>

                                    {/* Back Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="shrink-0 text-slate-600 hover:text-slate-900"
                                    >
                                        <Link href="/dashboard/learn">
                                            <ArrowLeft className="h-4 w-4 lg:mr-2" />
                                            <span className="hidden lg:inline">Kembali</span>
                                        </Link>
                                    </Button>

                                    <Separator orientation="vertical" className="h-6 shrink-0" />

                                    {/* Course Title */}
                                    <div className="hidden min-w-0 md:block">
                                        <h1 className="truncate text-sm font-semibold leading-tight text-slate-900 lg:text-base">
                                            {course.title}
                                        </h1>
                                        {course.mentor && (
                                            <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground">
                                                {course.mentor.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Info & Actions */}
                                <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                                    {/* Discussion Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="shrink-0"
                                    >
                                        <Link href={`/dashboard/learn/${course.slug}/discussion`}>
                                            <MessageCircle className="h-4 w-4 lg:mr-2" />
                                            <span className="hidden lg:inline">Diskusi</span>
                                        </Link>
                                    </Button>

                                    {/* Quiz Button - Only show when all videos completed */}
                                    {allVideosCompleted && (
                                        <Button
                                            size="sm"
                                            asChild
                                            className="shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg hover:from-emerald-700 hover:to-emerald-600"
                                        >
                                            <Link href={user.quiz.index.url(course.slug)}>
                                                <Trophy className="h-4 w-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Quiz</span>
                                            </Link>
                                        </Button>
                                    )}

                                    <div className="hidden items-center gap-2 sm:flex">
                                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 lg:w-32">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                                style={{ width: `${enrollment.progress || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold leading-none text-slate-700 lg:text-sm">
                                            {Math.round(enrollment.progress || 0)}%
                                        </span>
                                    </div>
                                    <Badge className="shrink-0 bg-emerald-50 px-2 py-1 text-xs font-medium leading-none text-emerald-700 hover:bg-emerald-100">
                                        <Award className="mr-1 h-3 w-3" />
                                        <span className="hidden sm:inline">{completedVideos} / </span>
                                        {totalVideos}
                                    </Badge>
                                </div>
                            </div>

                            {/* Mobile Course Title */}
                            <div className="border-t px-4 py-3 md:hidden">
                                <h2 className="truncate text-sm font-semibold leading-tight text-slate-900">{course.title}</h2>
                            </div>
                        </header>

                        <div className="space-y-0">
                            {/* Video Player Container */}
                            <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
                                {selectedVideo ? (
                                    <iframe
                                        src={selectedVideo.embedUrl}
                                        title={selectedVideo.title}
                                        className="absolute inset-0 h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-white">
                                        <PlayCircle className="h-16 w-16 opacity-50 lg:h-20 lg:w-20" />
                                        <p className="text-center text-sm leading-relaxed lg:text-base">
                                            Pilih video dari sidebar untuk memulai belajar
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Video Info & Actions */}
                            <div className="bg-white">
                            {selectedVideo ? (
                                <div className="space-y-6 p-5 lg:space-y-8 lg:p-8">
                                    {/* Video Title */}
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-semibold leading-tight text-slate-900 lg:text-2xl lg:leading-tight">
                                            {selectedVideo.title}
                                        </h2>
                                        {course.description && (
                                            <p className="text-sm leading-relaxed text-muted-foreground lg:text-base lg:leading-relaxed">
                                                {course.description}
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Course Info */}
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {course.category && (
                                            <div className="rounded-lg border bg-slate-50 p-4">
                                                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-muted-foreground">
                                                    Kategori
                                                </div>
                                                <div className="mt-2 text-sm font-semibold leading-tight text-slate-900">
                                                    {course.category.name}
                                                </div>
                                            </div>
                                        )}
                                        {course.level && (
                                            <div className="rounded-lg border bg-slate-50 p-4">
                                                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-muted-foreground">
                                                    Level
                                                </div>
                                                <div className="mt-2 text-sm font-semibold leading-tight text-slate-900">
                                                    {course.level.name}
                                                </div>
                                            </div>
                                        )}
                                        <div className="rounded-lg border bg-slate-50 p-4">
                                            <div className="text-xs font-medium uppercase leading-tight tracking-wide text-muted-foreground">
                                                Progress Kamu
                                            </div>
                                            <div className="mt-2 text-sm font-semibold leading-tight text-slate-900">
                                                {completedVideos} dari {totalVideos} video
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Mark Complete Button at Bottom */}
                                    <div className="flex justify-end">
                                        <Button
                                            size="lg"
                                            onClick={handleMarkComplete}
                                            disabled={selectedVideo.isCompleted}
                                            className={cn(
                                                "rounded-lg px-6 py-3 font-semibold leading-none",
                                                selectedVideo.isCompleted
                                                    ? "bg-slate-400 cursor-not-allowed"
                                                    : "bg-emerald-600 hover:bg-emerald-700"
                                            )}
                                        >
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            {selectedVideo.isCompleted ? 'Sudah Selesai' : 'Tandai Selesai'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center p-8">
                                    <div className="max-w-sm space-y-4 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                            <BookOpen className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold leading-tight text-slate-900">
                                                Selamat Datang!
                                            </h3>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                Pilih video dari sidebar untuk memulai pembelajaran
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
