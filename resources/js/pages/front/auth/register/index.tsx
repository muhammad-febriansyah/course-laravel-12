import { PageHeader } from '@/components/site/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/home-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, Lock, Mail, User } from 'lucide-react';

const benefits = [
    'Akses ke materi pembelajaran gratis dan premium',
    'Ikut komunitas belajar dan diskusi interaktif',
    'Dapatkan informasi program dan event terbaru',
];

export default function RegisterPage() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/register', {
            onFinish: () => {
                form.reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <HomeLayout>
            <Head title="Daftar Akun" />
            <PageHeader
                title="Daftar Akun"
                description="Mulai perjalanan belajar Anda bersama kami. Buat akun untuk mengakses kelas, artikel, dan komunitas terbaru."
            />

            <main className="-mt-12 bg-gradient-to-b from-slate-100 via-slate-50 to-white pb-24 pt-16 sm:-mt-16 sm:pt-24">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:px-8">
                    <section className="flex-1 rounded-[32px] bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8 lg:p-10">
                        <div className="mb-8 space-y-2 text-center lg:text-left">
                            <Badge className="rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
                                Ayo bergabung
                            </Badge>
                            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                Buat akun baru sekarang
                            </h2>
                            <p className="text-sm text-slate-600 sm:text-base">
                                Lengkapi data diri Anda di bawah ini. Kami akan
                                menyiapkan pengalaman belajar terbaik.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData('name', event.target.value)
                                        }
                                        placeholder="Nama lengkap Anda"
                                        className="pl-10"
                                        autoComplete="name"
                                    />
                                </div>
                                {form.errors.name && (
                                    <p className="text-sm text-red-500">
                                        {form.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="nama@contoh.com"
                                        className="pl-10"
                                        autoComplete="email"
                                    />
                                </div>
                                {form.errors.email && (
                                    <p className="text-sm text-red-500">
                                        {form.errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata sandi</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(event) =>
                                            form.setData(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Minimal 8 karakter"
                                        className="pl-10"
                                        autoComplete="new-password"
                                    />
                                </div>
                                {form.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {form.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi kata sandi
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(event) =>
                                            form.setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Ulangi kata sandi"
                                        className="pl-10"
                                        autoComplete="new-password"
                                    />
                                </div>
                                {form.errors.password_confirmation && (
                                    <p className="text-sm text-red-500">
                                        {form.errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600/90"
                                disabled={form.processing}
                            >
                                {form.processing ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </Button>

                            <p className="text-center text-sm text-slate-500">
                                Sudah punya akun?{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </form>
                    </section>

                    <aside className="flex-1 rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-lg sm:p-8 lg:p-10">
                        <h3 className="text-xl font-semibold text-blue-800">
                            Manfaat Bergabung
                        </h3>
                        <p className="mt-2 text-sm text-blue-700">
                            Dengan membuat akun, Anda akan mendapatkan pengalaman yang
                            lebih personal dan akses ke berbagai fitur menarik.
                        </p>

                        <ul className="mt-6 space-y-4 text-sm text-blue-700">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/70 px-4 py-3 shadow-sm"
                                >
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-inner">
                            <h4 className="text-sm font-semibold text-blue-700">
                                Tips membuat kata sandi kuat
                            </h4>
                            <p className="mt-2 text-xs text-blue-600">
                                Gunakan kombinasi huruf besar, huruf kecil, angka, dan
                                simbol. Hindari informasi yang mudah ditebak.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
        </HomeLayout>
    );
}
