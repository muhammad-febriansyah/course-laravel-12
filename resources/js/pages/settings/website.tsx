import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface Setting {
    id: number;
    site_name: string;
    keyword: string;
    email: string;
    address: string;
    maps_embed_url: string | null;
    phone: string;
    desc: string;
    yt: string;
    ig: string;
    tiktok: string;
    fb: string;
    logo: string | null;
    favicon: string | null;
    thumbnail: string | null;
    home_thumbnail: string | null;
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_stat1_number: string | null;
    hero_stat1_label: string | null;
    hero_stat2_number: string | null;
    hero_stat2_label: string | null;
    hero_stat3_number: string | null;
    hero_stat3_label: string | null;
    hero_badge_title: string | null;
    hero_badge_subtitle: string | null;
    hero_active_label: string | null;
    hero_active_value: string | null;
    stats_students_label: string | null;
    stats_students_value: string | null;
    stats_students_desc: string | null;
    stats_courses_label: string | null;
    stats_courses_value: string | null;
    stats_courses_desc: string | null;
    stats_instructors_label: string | null;
    stats_instructors_value: string | null;
    stats_instructors_desc: string | null;
    stats_satisfaction_label: string | null;
    stats_satisfaction_value: string | null;
    stats_satisfaction_desc: string | null;
    fee: string;
    mentor_fee_percentage: string;
}

interface Props {
    setting: Setting | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan',
        href: '/admin/pengaturan',
    },
];

export default function WebsiteSettings({ setting }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        site_name: setting?.site_name ?? '',
        keyword: setting?.keyword ?? '',
        email: setting?.email ?? '',
        address: setting?.address ?? '',
        maps_embed_url: setting?.maps_embed_url ?? '',
        phone: setting?.phone ?? '',
        desc: setting?.desc ?? '',
        yt: setting?.yt ?? '',
        ig: setting?.ig ?? '',
        tiktok: setting?.tiktok ?? '',
        fb: setting?.fb ?? '',
        logo: null as File | null,
        favicon: null as File | null,
        thumbnail: null as File | null,
        home_thumbnail: null as File | null,
        hero_title: setting?.hero_title ?? '',
        hero_subtitle: setting?.hero_subtitle ?? '',
        hero_stat1_number: setting?.hero_stat1_number ?? '',
        hero_stat1_label: setting?.hero_stat1_label ?? '',
        hero_stat2_number: setting?.hero_stat2_number ?? '',
        hero_stat2_label: setting?.hero_stat2_label ?? '',
        hero_stat3_number: setting?.hero_stat3_number ?? '',
        hero_stat3_label: setting?.hero_stat3_label ?? '',
        hero_badge_title: setting?.hero_badge_title ?? '',
        hero_badge_subtitle: setting?.hero_badge_subtitle ?? '',
        hero_active_label: setting?.hero_active_label ?? '',
        hero_active_value: setting?.hero_active_value ?? '',
        stats_students_label: setting?.stats_students_label ?? '',
        stats_students_value: setting?.stats_students_value ?? '',
        stats_students_desc: setting?.stats_students_desc ?? '',
        stats_courses_label: setting?.stats_courses_label ?? '',
        stats_courses_value: setting?.stats_courses_value ?? '',
        stats_courses_desc: setting?.stats_courses_desc ?? '',
        stats_instructors_label: setting?.stats_instructors_label ?? '',
        stats_instructors_value: setting?.stats_instructors_value ?? '',
        stats_instructors_desc: setting?.stats_instructors_desc ?? '',
        stats_satisfaction_label: setting?.stats_satisfaction_label ?? '',
        stats_satisfaction_value: setting?.stats_satisfaction_value ?? '',
        stats_satisfaction_desc: setting?.stats_satisfaction_desc ?? '',
        fee: setting?.fee ?? '',
        mentor_fee_percentage: setting?.mentor_fee_percentage ?? '10',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(setting?.logo ?? null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(setting?.favicon ?? null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(setting?.thumbnail ?? null);
    const [homeThumbnailPreview, setHomeThumbnailPreview] = useState<string | null>(setting?.home_thumbnail ?? null);

    const logoInputRef = useRef<HTMLInputElement | null>(null);
    const faviconInputRef = useRef<HTMLInputElement | null>(null);
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
    const homeThumbnailInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: 'logo' | 'favicon' | 'thumbnail' | 'home_thumbnail',
    ) => {
        const file = event.target.files?.[0];
        setData(field, file ?? null);

        if (file) {
            const preview = URL.createObjectURL(file);
            if (field === 'logo') setLogoPreview(preview);
            if (field === 'favicon') setFaviconPreview(preview);
            if (field === 'thumbnail') setThumbnailPreview(preview);
            if (field === 'home_thumbnail') setHomeThumbnailPreview(preview);
        }
    };

    const removeImage = (field: 'logo' | 'favicon' | 'thumbnail' | 'home_thumbnail') => {
        setData(field, null);
        if (field === 'logo') {
            setLogoPreview(null);
            if (logoInputRef.current) logoInputRef.current.value = '';
        }
        if (field === 'favicon') {
            setFaviconPreview(null);
            if (faviconInputRef.current) faviconInputRef.current.value = '';
        }
        if (field === 'thumbnail') {
            setThumbnailPreview(null);
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
        if (field === 'home_thumbnail') {
            setHomeThumbnailPreview(null);
            if (homeThumbnailInputRef.current) homeThumbnailInputRef.current.value = '';
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/pengaturan', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan berhasil diperbarui.');
            },
            onError: () => {
                toast.error('Gagal memperbarui pengaturan. Periksa kembali data yang dimasukkan.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Website" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan Website</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola informasi utama, media sosial, dan aset visual platform Anda.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Konfigurasi Website</CardTitle>
                            <CardDescription>
                                Perbarui identitas brand, kanal komunikasi, dan file branding yang digunakan di seluruh
                                platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="general" className="space-y-6">
                                <TabsList className="flex flex-wrap gap-2">
                                    <TabsTrigger value="general">Informasi Umum</TabsTrigger>
                                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                                    <TabsTrigger value="stats">Stats Section</TabsTrigger>
                                    <TabsTrigger value="social">Media Sosial</TabsTrigger>
                                    <TabsTrigger value="assets">Aset Visual</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="site_name">Nama Website</Label>
                                            <Input
                                                id="site_name"
                                                value={data.site_name}
                                                onChange={(event) => setData('site_name', event.target.value)}
                                                placeholder="Masukkan nama website"
                                            />
                                            {errors.site_name && (
                                                <p className="text-sm text-red-500">{errors.site_name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="keyword">Kata Kunci SEO</Label>
                                            <Input
                                                id="keyword"
                                                value={data.keyword}
                                                onChange={(event) => setData('keyword', event.target.value)}
                                                placeholder="kata kunci, dipisahkan, koma"
                                            />
                                            {errors.keyword && (
                                                <p className="text-sm text-red-500">{errors.keyword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(event) => setData('email', event.target.value)}
                                                placeholder="info@example.com"
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telepon</Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(event) => setData('phone', event.target.value)}
                                                placeholder="+62 812 0000 0000"
                                            />
                                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Alamat</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(event) => setData('address', event.target.value)}
                                            rows={3}
                                            placeholder="Alamat kantor atau pusat operasional"
                                        />
                                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maps_embed_url">Google Maps Embed URL</Label>
                                        <Textarea
                                            id="maps_embed_url"
                                            value={data.maps_embed_url}
                                            onChange={(event) => setData('maps_embed_url', event.target.value)}
                                            rows={4}
                                            placeholder="https://www.google.com/maps/embed?pb=..."
                                        />
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                            <p className="text-xs font-medium text-blue-900">Cara mendapatkan embed URL:</p>
                                            <ol className="mt-2 space-y-1 text-xs text-blue-800">
                                                <li>1. Buka Google Maps → Cari lokasi Anda</li>
                                                <li>2. Klik tombol "Share" → Pilih tab "Embed a map"</li>
                                                <li>3. Copy SEMUA kode HTML yang muncul (termasuk tag &lt;iframe&gt;)</li>
                                                <li>4. Paste di sini (sistem akan otomatis mengekstrak URL-nya)</li>
                                            </ol>
                                        </div>
                                        {errors.maps_embed_url && <p className="text-sm text-red-500">{errors.maps_embed_url}</p>}
                                    </div>

                                    <div className="space-y-2">
                                            <Label htmlFor="desc">Deskripsi</Label>
                                            <Textarea
                                                id="desc"
                                                value={data.desc}
                                                onChange={(event) => setData('desc', event.target.value)}
                                                rows={4}
                                                placeholder="Deskripsi singkat mengenai platform"
                                            />
                                            {errors.desc && <p className="text-sm text-red-500">{errors.desc}</p>}
                                    </div>
                                </TabsContent>

                                <TabsContent value="hero" className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_title">Judul Hero</Label>
                                        <Input
                                            id="hero_title"
                                            value={data.hero_title}
                                            onChange={(event) => setData('hero_title', event.target.value)}
                                            placeholder="Raih Skill Masa Depan"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Teks utama yang ditampilkan di hero section halaman home
                                        </p>
                                        {errors.hero_title && <p className="text-sm text-red-500">{errors.hero_title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero_subtitle">Subtitle Hero</Label>
                                        <Textarea
                                            id="hero_subtitle"
                                            value={data.hero_subtitle}
                                            onChange={(event) => setData('hero_subtitle', event.target.value)}
                                            rows={3}
                                            placeholder="Platform pembelajaran online terbaik di Indonesia..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Deskripsi pendukung di bawah judul hero
                                        </p>
                                        {errors.hero_subtitle && <p className="text-sm text-red-500">{errors.hero_subtitle}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Statistik Hero</Label>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-3">
                                                <Label htmlFor="hero_stat1_number" className="text-sm text-muted-foreground">Statistik 1</Label>
                                                <Input
                                                    id="hero_stat1_number"
                                                    value={data.hero_stat1_number}
                                                    onChange={(event) => setData('hero_stat1_number', event.target.value)}
                                                    placeholder="10K+"
                                                />
                                                <Input
                                                    id="hero_stat1_label"
                                                    value={data.hero_stat1_label}
                                                    onChange={(event) => setData('hero_stat1_label', event.target.value)}
                                                    placeholder="Siswa Aktif"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="hero_stat2_number" className="text-sm text-muted-foreground">Statistik 2</Label>
                                                <Input
                                                    id="hero_stat2_number"
                                                    value={data.hero_stat2_number}
                                                    onChange={(event) => setData('hero_stat2_number', event.target.value)}
                                                    placeholder="100+"
                                                />
                                                <Input
                                                    id="hero_stat2_label"
                                                    value={data.hero_stat2_label}
                                                    onChange={(event) => setData('hero_stat2_label', event.target.value)}
                                                    placeholder="Kursus Premium"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="hero_stat3_number" className="text-sm text-muted-foreground">Statistik 3</Label>
                                                <Input
                                                    id="hero_stat3_number"
                                                    value={data.hero_stat3_number}
                                                    onChange={(event) => setData('hero_stat3_number', event.target.value)}
                                                    placeholder="50+"
                                                />
                                                <Input
                                                    id="hero_stat3_label"
                                                    value={data.hero_stat3_label}
                                                    onChange={(event) => setData('hero_stat3_label', event.target.value)}
                                                    placeholder="Mentor Expert"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <Label>Badge Kursus Populer</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Badge floating yang muncul di gambar hero section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="hero_badge_title">Judul Badge</Label>
                                                <Input
                                                    id="hero_badge_title"
                                                    value={data.hero_badge_title}
                                                    onChange={(event) => setData('hero_badge_title', event.target.value)}
                                                    placeholder="Kursus Terpopuler"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hero_badge_subtitle">Subtitle Badge</Label>
                                                <Input
                                                    id="hero_badge_subtitle"
                                                    value={data.hero_badge_subtitle}
                                                    onChange={(event) => setData('hero_badge_subtitle', event.target.value)}
                                                    placeholder="Web Development Bootcamp"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <Label>Active Students Card</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Card yang muncul di kiri atas gambar hero section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="hero_active_label">Label</Label>
                                                <Input
                                                    id="hero_active_label"
                                                    value={data.hero_active_label}
                                                    onChange={(event) => setData('hero_active_label', event.target.value)}
                                                    placeholder="Active Now"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hero_active_value">Value</Label>
                                                <Input
                                                    id="hero_active_value"
                                                    value={data.hero_active_value}
                                                    onChange={(event) => setData('hero_active_value', event.target.value)}
                                                    placeholder="2.5K+ Students"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="stats" className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>Students Statistics</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Statistik jumlah siswa yang ditampilkan di stats section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_students_label">Label</Label>
                                                <Input
                                                    id="stats_students_label"
                                                    value={data.stats_students_label}
                                                    onChange={(event) => setData('stats_students_label', event.target.value)}
                                                    placeholder="Students"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_students_value">Value</Label>
                                                <Input
                                                    id="stats_students_value"
                                                    value={data.stats_students_value}
                                                    onChange={(event) => setData('stats_students_value', event.target.value)}
                                                    placeholder="10,000+"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_students_desc">Description</Label>
                                                <Input
                                                    id="stats_students_desc"
                                                    value={data.stats_students_desc}
                                                    onChange={(event) => setData('stats_students_desc', event.target.value)}
                                                    placeholder="Active learners"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <Label>Courses Statistics</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Statistik jumlah kursus yang ditampilkan di stats section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_courses_label">Label</Label>
                                                <Input
                                                    id="stats_courses_label"
                                                    value={data.stats_courses_label}
                                                    onChange={(event) => setData('stats_courses_label', event.target.value)}
                                                    placeholder="Courses"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_courses_value">Value</Label>
                                                <Input
                                                    id="stats_courses_value"
                                                    value={data.stats_courses_value}
                                                    onChange={(event) => setData('stats_courses_value', event.target.value)}
                                                    placeholder="500+"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_courses_desc">Description</Label>
                                                <Input
                                                    id="stats_courses_desc"
                                                    value={data.stats_courses_desc}
                                                    onChange={(event) => setData('stats_courses_desc', event.target.value)}
                                                    placeholder="Available courses"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <Label>Instructors Statistics</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Statistik jumlah instruktur yang ditampilkan di stats section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_instructors_label">Label</Label>
                                                <Input
                                                    id="stats_instructors_label"
                                                    value={data.stats_instructors_label}
                                                    onChange={(event) => setData('stats_instructors_label', event.target.value)}
                                                    placeholder="Instructors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_instructors_value">Value</Label>
                                                <Input
                                                    id="stats_instructors_value"
                                                    value={data.stats_instructors_value}
                                                    onChange={(event) => setData('stats_instructors_value', event.target.value)}
                                                    placeholder="100+"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_instructors_desc">Description</Label>
                                                <Input
                                                    id="stats_instructors_desc"
                                                    value={data.stats_instructors_desc}
                                                    onChange={(event) => setData('stats_instructors_desc', event.target.value)}
                                                    placeholder="Expert instructors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <Label>Satisfaction Statistics</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Statistik tingkat kepuasan yang ditampilkan di stats section
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_satisfaction_label">Label</Label>
                                                <Input
                                                    id="stats_satisfaction_label"
                                                    value={data.stats_satisfaction_label}
                                                    onChange={(event) => setData('stats_satisfaction_label', event.target.value)}
                                                    placeholder="Satisfaction"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_satisfaction_value">Value</Label>
                                                <Input
                                                    id="stats_satisfaction_value"
                                                    value={data.stats_satisfaction_value}
                                                    onChange={(event) => setData('stats_satisfaction_value', event.target.value)}
                                                    placeholder="98%"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stats_satisfaction_desc">Description</Label>
                                                <Input
                                                    id="stats_satisfaction_desc"
                                                    value={data.stats_satisfaction_desc}
                                                    onChange={(event) => setData('stats_satisfaction_desc', event.target.value)}
                                                    placeholder="Student satisfaction"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="social" className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="yt">YouTube</Label>
                                        <Input
                                            id="yt"
                                            value={data.yt}
                                            onChange={(event) => setData('yt', event.target.value)}
                                            placeholder="https://youtube.com/@channel"
                                        />
                                        {errors.yt && <p className="text-sm text-red-500">{errors.yt}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ig">Instagram</Label>
                                        <Input
                                            id="ig"
                                            value={data.ig}
                                            onChange={(event) => setData('ig', event.target.value)}
                                            placeholder="https://instagram.com/akun"
                                        />
                                        {errors.ig && <p className="text-sm text-red-500">{errors.ig}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tiktok">TikTok</Label>
                                        <Input
                                            id="tiktok"
                                            value={data.tiktok}
                                            onChange={(event) => setData('tiktok', event.target.value)}
                                            placeholder="https://tiktok.com/@akun"
                                        />
                                        {errors.tiktok && <p className="text-sm text-red-500">{errors.tiktok}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fb">Facebook</Label>
                                        <Input
                                            id="fb"
                                            value={data.fb}
                                            onChange={(event) => setData('fb', event.target.value)}
                                            placeholder="https://facebook.com/page"
                                        />
                                        {errors.fb && <p className="text-sm text-red-500">{errors.fb}</p>}
                                    </div>
                                </TabsContent>

                                <TabsContent value="assets" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="logo">Logo Website</Label>
                                            {logoPreview && (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo preview"
                                                        className="h-20 w-20 rounded-md border object-cover"
                                                    />
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeImage('logo')}>
                                                        Hapus
                                                    </Button>
                                                </div>
                                            )}
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => handleImageChange(event, 'logo')}
                                            />
                                            {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="favicon">Favicon</Label>
                                            {faviconPreview && (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={faviconPreview}
                                                        alt="Favicon preview"
                                                        className="h-12 w-12 rounded-md border object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeImage('favicon')}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            )}
                                            <Input
                                                id="favicon"
                                                type="file"
                                                accept="image/png,image/x-icon"
                                                onChange={(event) => handleImageChange(event, 'favicon')}
                                            />
                                            {errors.favicon && <p className="text-sm text-red-500">{errors.favicon}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thumbnail">Thumbnail SEO</Label>
                                        <input
                                            ref={thumbnailInputRef}
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => handleImageChange(event, 'thumbnail')}
                                        />
                                        {thumbnailPreview ? (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail preview"
                                                    className="h-24 w-40 rounded-md border object-cover"
                                                />
                                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                    <span>PNG atau JPG maksimal 4MB. Disarankan 1200x630px.</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => thumbnailInputRef.current?.click()}
                                                        >
                                                            Ganti Thumbnail
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeImage('thumbnail')}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="thumbnail"
                                                className="group flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:bg-muted/30"
                                            >
                                                <div className="rounded-full bg-background p-3 shadow-sm">
                                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium text-foreground">Upload Thumbnail</span>
                                                <span className="text-xs">PNG atau JPG maksimal 4MB • 1200x630px</span>
                                            </label>
                                        )}
                                        {errors.thumbnail && (
                                            <p className="text-sm text-red-500">{errors.thumbnail}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="home_thumbnail">Thumbnail Hero Home</Label>
                                        <input
                                            ref={homeThumbnailInputRef}
                                            id="home_thumbnail"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => handleImageChange(event, 'home_thumbnail')}
                                        />
                                        {homeThumbnailPreview ? (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={homeThumbnailPreview}
                                                    alt="Home Thumbnail preview"
                                                    className="h-24 w-40 rounded-md border object-cover"
                                                />
                                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                    <span>PNG atau JPG maksimal 4MB. Untuk hero section halaman home.</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => homeThumbnailInputRef.current?.click()}
                                                        >
                                                            Ganti Thumbnail
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeImage('home_thumbnail')}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="home_thumbnail"
                                                className="group flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:bg-muted/30"
                                            >
                                                <div className="rounded-full bg-background p-3 shadow-sm">
                                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium text-foreground">Upload Thumbnail Hero Home</span>
                                                <span className="text-xs">PNG atau JPG maksimal 4MB • Untuk tampilan hero section</span>
                                            </label>
                                        )}
                                        {errors.home_thumbnail && (
                                            <p className="text-sm text-red-500">{errors.home_thumbnail}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fee">Biaya Admin Tripay (%)</Label>
                                        <Input
                                            id="fee"
                                            type="number"
                                            min={0}
                                            max={100}
                                            step="0.01"
                                            value={data.fee}
                                            onChange={(event) => setData('fee', event.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Persentase biaya admin yang dikenakan untuk pembayaran via Tripay.
                                        </p>
                                        {errors.fee && <p className="text-sm text-red-500">{errors.fee}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mentor_fee_percentage">Fee Platform dari Pendapatan Mentor (%)</Label>
                                        <Input
                                            id="mentor_fee_percentage"
                                            type="number"
                                            min={0}
                                            max={100}
                                            step="0.01"
                                            value={data.mentor_fee_percentage}
                                            onChange={(event) => setData('mentor_fee_percentage', event.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Persentase fee yang diambil platform dari setiap penjualan kelas mentor. Contoh: 10% = platform dapat 10%, mentor dapat 90%.
                                        </p>
                                        {errors.mentor_fee_percentage && <p className="text-sm text-red-500">{errors.mentor_fee_percentage}</p>}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setLogoPreview(setting?.logo ?? null);
                                setFaviconPreview(setting?.favicon ?? null);
                                setThumbnailPreview(setting?.thumbnail ?? null);
                                setHomeThumbnailPreview(setting?.home_thumbnail ?? null);
                            }}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
