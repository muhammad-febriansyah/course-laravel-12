import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Users, UserCheck, GraduationCap, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Student {
    id: number;
    user: User;
    status: string;
    progress_percentage: number;
    videos_completed: number;
    quizzes_completed: number;
    enrolled_at: string;
    last_accessed_at?: string;
    completed_at?: string;
}

interface StudentsIndexProps {
    kelas: {
        id: number;
        title: string;
        slug: string;
    };
    students: {
        data: Student[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: {
        total_students: number;
        active_students: number;
        completed_students: number;
        average_progress: number;
    };
    filters: {
        search?: string;
        sort_by: string;
        sort_order: string;
    };
}

export default function StudentsIndex({ kelas, students, stats, filters }: StudentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/mentor/dashboard' },
        { title: 'Kelas Saya', href: '/mentor/kelas' },
        { title: kelas.title, href: `/mentor/kelas/${kelas.id}` },
        { title: 'Siswa', href: `/mentor/kelas/${kelas.id}/students` },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/mentor/kelas/${kelas.id}/students`, { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 20) return 'bg-yellow-500';
        return 'bg-gray-300';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Siswa - ${kelas.title}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Siswa Kelas</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola dan pantau progress siswa di kelas {kelas.title}
                    </p>
                </div>

                {/* Statistics Cards */}
                <section className="grid gap-4 md:grid-cols-4">
                    {[{
                        label: 'Total Siswa',
                        value: stats.total_students,
                        icon: Users,
                        description: 'Siswa terdaftar',
                        color: 'text-blue-600',
                    },
                    {
                        label: 'Siswa Aktif',
                        value: stats.active_students,
                        icon: UserCheck,
                        description: 'Sedang belajar',
                        color: 'text-green-600',
                    },
                    {
                        label: 'Sudah Selesai',
                        value: stats.completed_students,
                        icon: GraduationCap,
                        description: 'Menyelesaikan kelas',
                        color: 'text-purple-600',
                    },
                    {
                        label: 'Rata-rata Progress',
                        value: `${stats.average_progress}%`,
                        icon: TrendingUp,
                        description: 'Progress keseluruhan',
                        color: 'text-orange-600',
                    }].map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.label} className="border-muted-foreground/20">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {item.label}
                                    </CardTitle>
                                    <Icon className={`h-4 w-4 ${item.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-semibold">{item.value}</div>
                                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                {/* Search and Filters */}
                <Card className="border-muted-foreground/20">
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Daftar Siswa</CardTitle>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari siswa..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 w-[250px]"
                                    />
                                </div>
                                <Button type="submit" variant="outline">
                                    Cari
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {students.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Belum ada siswa yang terdaftar di kelas ini.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Siswa</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Progress</TableHead>
                                                <TableHead>Video</TableHead>
                                                <TableHead>Quiz</TableHead>
                                                <TableHead>Terakhir Akses</TableHead>
                                                <TableHead>Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.data.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            {student.user.avatar ? (
                                                                <img
                                                                    src={student.user.avatar}
                                                                    alt={student.user.name}
                                                                    className="h-8 w-8 rounded-full"
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                                    <span className="text-xs font-medium">
                                                                        {student.user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-medium">{student.user.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {student.user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                student.completed_at
                                                                    ? 'default'
                                                                    : student.status === 'active'
                                                                    ? 'secondary'
                                                                    : 'outline'
                                                            }
                                                        >
                                                            {student.completed_at
                                                                ? 'Selesai'
                                                                : student.status === 'active'
                                                                ? 'Aktif'
                                                                : 'Tidak Aktif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="w-full">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium">
                                                                    {student.progress_percentage.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${getProgressColor(student.progress_percentage)} transition-all`}
                                                                    style={{ width: `${student.progress_percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {student.videos_completed}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {student.quizzes_completed}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {student.last_accessed_at
                                                                ? formatDate(student.last_accessed_at)
                                                                : '-'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/mentor/kelas/${kelas.id}/students/${student.id}`}>
                                                                Detail
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {students.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Halaman {students.current_page} dari {students.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            {students.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
