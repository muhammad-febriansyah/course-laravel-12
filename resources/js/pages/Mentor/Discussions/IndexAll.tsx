import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    MessageCircle,
    Search,
    CheckCircle2,
    Clock,
    MessageSquare,
    BookOpen,
    ArrowUpDown,
    Eye,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface Kelas {
    id: number;
    title: string;
    slug: string;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    is_resolved: boolean;
    created_at: string;
    user: User;
    kelas: Kelas;
    replies: any[];
}

interface Stats {
    total: number;
    unresolved: number;
    resolved: number;
}

interface Props {
    discussions: {
        data: Discussion[];
        links?: any;
        meta?: any;
    };
    stats: Stats;
    filter: string;
    search?: string;
}

export default function IndexAll({ discussions, stats, filter, search }: Props) {
    const [searchQuery, setSearchQuery] = useState(search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/mentor/diskusi',
            { search: searchQuery, filter },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleFilterChange = (value: string) => {
        router.get(
            '/mentor/diskusi',
            { filter: value, search: searchQuery },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Kemarin';
        if (days < 7) return `${days} hari yang lalu`;
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const columns: ColumnDef<Discussion>[] = [
        {
            id: 'index',
            header: '#',
            cell: ({ row, table }) => {
                const pagination = table.getState().pagination;
                const pageIndex = pagination?.pageIndex ?? 0;
                const pageSize =
                    pagination?.pageSize ??
                    (table.getRowModel().rows.length || 1);

                return (
                    <div className="w-10 text-right font-medium">
                        {pageIndex * pageSize + row.index + 1}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-4 hover:bg-transparent"
                >
                    Judul
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <Link
                        href={`/mentor/diskusi/${row.original.id}`}
                        className="font-semibold hover:underline"
                    >
                        {row.original.title}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {row.original.content}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'kelas.title',
            header: 'Kelas',
            cell: ({ row }) => row.original.kelas.title,
        },
        {
            accessorKey: 'user.name',
            header: 'Penanya',
            cell: ({ row }) => row.original.user.name,
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat',
            cell: ({ row }) => formatDate(row.original.created_at),
        },
        {
            accessorKey: 'replies',
            header: 'Balasan',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{row.original.replies.length}</span>
                </div>
            ),
        },
        {
            accessorKey: 'is_resolved',
            header: 'Status',
            cell: ({ row }) => {
                const resolved = row.original.is_resolved;
                return (
                    <Badge
                        variant={resolved ? 'default' : 'secondary'}
                        className={
                            resolved ? 'bg-green-500' : 'bg-orange-500'
                        }
                    >
                        {resolved ? 'Selesai' : 'Pending'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={`/mentor/diskusi/${row.original.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                        </Link>
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    return (
        <AppLayout>
            <Head title="Diskusi" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Diskusi</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola semua diskusi dari kelas Anda
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Diskusi
                            </CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Semua pertanyaan siswa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Belum Dijawab
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">
                                {stats.unresolved}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Perlu perhatian Anda
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sudah Dijawab
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                                {stats.resolved}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Diskusi selesai
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari diskusi..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </form>

                            <Select value={filter} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="unresolved">
                                        Belum Dijawab
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                        Sudah Dijawab
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Discussions DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Diskusi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={discussions.data}
                            searchKey="title"
                            searchPlaceholder="Cari berdasarkan judul"
                        />
                    </CardContent>
                </Card>

                {/* Pagination */}
                {discussions.meta?.last_page > 1 && discussions.links && (
                    <div className="flex items-center justify-center gap-2">
                        {discussions.links.map((link: any, index: number) => (
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
                )}
            </div>
        </AppLayout>
    );
}
