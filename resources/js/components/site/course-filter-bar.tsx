import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CatalogFilters, CatalogOptions } from '@/types/course';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface CourseFilterBarProps {
    filters: CatalogFilters;
    options: CatalogOptions;
}

export function CourseFilterBar({ filters, options }: CourseFilterBarProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [level, setLevel] = useState(filters.level ?? '');
    const [type, setType] = useState(filters.type ?? '');

    const submit = () => {
        router.get(
            '/courses',
            {
                search: search || undefined,
                category: category || undefined,
                level: level || undefined,
                type: type || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const reset = () => {
        setSearch('');
        setCategory('');
        setLevel('');
        setType('');
        router.get('/courses', {}, { replace: true });
    };

    return (
        <div className="grid gap-4 rounded-xl border bg-background p-4 shadow-sm md:grid-cols-5">
            <div className="md:col-span-2">
                <Label htmlFor="search">Cari Kursus</Label>
                <Input
                    id="search"
                    value={search}
                    placeholder="Cari berdasarkan judul atau deskripsi"
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            submit();
                        }
                    }}
                />
            </div>

            <div>
                <Label>Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua kategori</SelectItem>
                        {options.categories.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Tingkat</Label>
                <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua level</SelectItem>
                        {options.levels.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Tipe</Label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua tipe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua tipe</SelectItem>
                        {options.types.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-end justify-end gap-2">
                <Button variant="outline" onClick={reset}>
                    Reset
                </Button>
                <Button onClick={submit}>Terapkan</Button>
            </div>
        </div>
    );
}
