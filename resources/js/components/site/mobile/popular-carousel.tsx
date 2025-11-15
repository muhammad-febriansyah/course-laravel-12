import { Link } from '@inertiajs/react';

export function PopularCarousel({
  items,
}: {
  items: Array<{ id: number; slug: string; title: string; image: string; price: number; finalPrice: number }>
}) {
  if (!items?.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Popular Course</h2>
      </div>
      <div className="-mx-4 overflow-x-auto pb-2">
        <div className="mx-4 inline-flex gap-3">
          {items.map((c) => (
            <Link key={c.id} href={`/courses/${c.slug}`} className="w-56 shrink-0 overflow-hidden rounded-xl border bg-background shadow-sm">
              <img src={c.image} alt={c.title} className="h-28 w-full object-cover" />
              <div className="space-y-1 p-3">
                <p className="line-clamp-2 text-sm font-medium">{c.title}</p>
                <p className="text-xs text-primary font-semibold">Rp {Number(c.finalPrice ?? c.price).toLocaleString('id-ID')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

