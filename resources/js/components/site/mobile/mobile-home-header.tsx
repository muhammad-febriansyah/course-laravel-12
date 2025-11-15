import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Play, Search } from 'lucide-react';

interface AuthUser {
  name?: string | null;
  avatar?: string | null;
}

interface MobileHomeHeaderProps {
  stats?: {
    totalCourses?: number;
    totalStudents?: number;
    totalInstructors?: number;
  };
  highlightCourse?: { title: string; slug?: string | null } | null;
}

export function MobileHomeHeader({ stats, highlightCourse }: MobileHomeHeaderProps) {
  const { auth } = usePage().props as { auth?: { user?: AuthUser } };
  const user = auth?.user;
  const name = user?.name ?? 'Belajarers';
  const isLoggedIn = Boolean(user);

  const totalCourses = stats?.totalCourses ?? 0;
  const totalStudents = stats?.totalStudents ?? 0;
  const totalInstructors = stats?.totalInstructors ?? 0;

  const primaryAction = isLoggedIn
    ? {
        href: highlightCourse?.slug ? `/courses/${highlightCourse.slug}` : '/courses',
        label: 'Lanjut Belajar',
      }
    : {
        href: '/daftar',
        label: 'Mulai Sekarang',
      };

  const secondaryAction = isLoggedIn
    ? { href: '/dashboard', label: 'Dashboard' }
    : { href: '/masuk', label: 'Masuk' };

  return (
    <header className="relative space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-36 w-36 rounded-full bg-sky-400/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-2 h-28 w-28 rounded-3xl bg-white/15 blur-2xl" />

        <div className="relative flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wide">
              Skill UP Course
            </span>
            <Link
              href={secondaryAction.href}
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white transition hover:bg-white/25"
            >
              <span>{secondaryAction.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-white/80">
              {isLoggedIn ? `Halo, ${name}` : 'Saatnya upgrade skill kamu'}
            </p>
            <h1 className="text-[26px] font-semibold leading-snug">
              Temukan skill baru dan belajar dengan mentor profesional
            </h1>
            <p className="text-sm text-white/85">
              {highlightCourse
                ? `Mulai dari kelas ${highlightCourse.title} atau jelajahi kategori lain yang sesuai minatmu.`
                : 'Jelajahi ratusan modul interaktif dan belajar kapan saja dengan fleksibel.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryAction.href}
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow transition hover:-translate-y-0.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{primaryAction.label}</span>
            </Link>
            <Link
              href="/courses"
              prefetch
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Jelajahi Kelas
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-white/85">
            <div className="rounded-2xl bg-white/15 px-3 py-2">
              <p className="text-lg font-semibold text-white">{formatNumber(totalCourses)}</p>
              <p>Kelas</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-3 py-2">
              <p className="text-lg font-semibold text-white">{formatNumber(totalStudents)}+</p>
              <p>Peserta</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-3 py-2">
              <p className="text-lg font-semibold text-white">
                {totalInstructors > 0 ? formatNumber(totalInstructors) : 'Tim'}
              </p>
              <p>Mentor</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-4 top-12 h-32 w-32 rounded-full bg-white/20" />
        <div className="pointer-events-none absolute bottom-2 right-4 flex h-28 w-24 items-end justify-center">
          <div className="h-24 w-24 rounded-[28px] bg-white/25 p-3 backdrop-blur-sm">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/95 text-4xl">
              📚
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-10 px-1">
        <label className="relative flex h-14 items-center gap-3 rounded-2xl border border-border/60 bg-background px-4 shadow-lg">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari topik yang ingin kamu pelajari"
            className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">
            Cepat Belajar
          </span>
        </label>
      </div>
    </header>
  );
}

const formatNumber = (value?: number) =>
  new Intl.NumberFormat('id-ID').format(value ?? 0);
