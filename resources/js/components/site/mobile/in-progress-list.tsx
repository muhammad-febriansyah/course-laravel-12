import { Link } from '@inertiajs/react';

interface InProgressItem {
  id: number;
  slug: string;
  title: string;
  progress?: number;
  image?: string;
  meta?: string;
}

interface InProgressListProps {
  items: InProgressItem[];
  heading?: string;
  ctaHref?: string;
  ctaLabel?: string;
  showProgress?: boolean;
}

export function InProgressList({
  items,
  heading = 'Sedang Kamu Ikuti',
  ctaHref = '/dashboard',
  ctaLabel = 'Lihat semua',
  showProgress = true,
}: InProgressListProps) {
  if (!items?.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{heading}</h2>
        <Link href={ctaHref} className="text-xs text-primary">
          {ctaLabel}
        </Link>
      </div>
      <div className="space-y-3">
        {items.slice(0, 3).map((c) => (
          <Link key={c.id} href={`/courses/${c.slug}`} className="block overflow-hidden rounded-xl border bg-background p-3 shadow-sm">
            <div className="flex items-center gap-3">
              {c.image ? (
                <img src={c.image} alt={c.title} className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {c.title.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                {c.meta && <p className="text-[11px] text-muted-foreground">{c.meta}</p>}
                {showProgress && (
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, c.progress ?? 0)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
