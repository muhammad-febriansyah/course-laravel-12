import { Marquee } from '@/components/ui/marquee';
import { Quote, Star } from 'lucide-react';

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    kelas_title: string;
    avatar: string;
}

interface TestimonialsMarqueeSectionProps {
    reviews: Review[];
}

const ReviewCard = ({ review }: { review: Review }) => {
    return (
        <div className="relative w-[350px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Quote Icon */}
            <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2 text-blue-600">
                <Quote className="h-5 w-5" />
            </div>

            {/* Rating */}
            <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${
                            i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-slate-200 text-slate-200'
                        }`}
                    />
                ))}
            </div>

            {/* Content */}
            <p className="mb-4 line-clamp-4 text-sm text-slate-600 leading-relaxed">
                "{review.comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full ring-2 ring-slate-100"
                />
                <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm">
                        {review.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                        {review.kelas_title}
                    </div>
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5 blur-2xl" />
        </div>
    );
};

export function TestimonialsMarqueeSection({
    reviews,
}: TestimonialsMarqueeSectionProps) {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    // Split reviews into two rows for better visual
    const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
    const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

    return (
        <section className="relative overflow-hidden bg-white py-16 lg:py-24">
            {/* Background decorations */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
                <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-purple-100/50 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Apa Kata Mereka?
                    </h2>
                    <p className="text-lg text-slate-600">
                        Dengarkan pengalaman siswa kami yang telah berhasil
                        mengembangkan karir mereka
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative">
                    {/* First Row - Left to Right */}
                    <Marquee pauseOnHover className="[--duration:60s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </Marquee>

                    {/* Second Row - Right to Left */}
                    {secondRow.length > 0 && (
                        <Marquee
                            reverse
                            pauseOnHover
                            className="mt-4 [--duration:60s]"
                        >
                            {secondRow.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </Marquee>
                    )}

                    {/* Gradient Overlays */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-white to-transparent" />
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600">
                        Bergabunglah dengan{' '}
                        <span className="font-semibold text-blue-600">
                            {reviews.length}+ siswa
                        </span>{' '}
                        yang telah memberikan review
                    </p>
                </div>
            </div>
        </section>
    );
}
