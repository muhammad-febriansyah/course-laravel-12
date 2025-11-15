import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function Hero() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 px-6 py-16 text-white">
            <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl space-y-4">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                        Belajar tanpa batas — akses kapan pun & di mana pun
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                        Tingkatkan skill kamu melalui kelas interaktif & kurasi terbaik
                    </h1>
                    <p className="text-lg text-white/80">
                        Temukan ratusan materi berkualitas dengan mentor berpengalaman.
                        Mulai belajar hari ini dan raih karier impianmu.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button size="lg" asChild variant="secondary">
                            <Link href="/courses" prefetch>
                                Jelajahi Kursus
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="border border-white/40 text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="/register">Daftar Sekarang</Link>
                        </Button>
                    </div>
                </div>
                <div className="hidden max-w-sm md:block">
                    <img
                        className="w-full rounded-2xl shadow-lg"
                        src="https://placehold.co/440x360/ffffff/0b1120?text=Belajar+Online"
                        alt="Learning Illustration"
                    />
                </div>
            </div>
        </section>
    );
}
