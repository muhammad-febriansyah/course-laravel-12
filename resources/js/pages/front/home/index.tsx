import { HeroSpotlight } from '@/components/site/hero-spotlight';
import { FeaturesSection } from '@/components/site/sections/features-section';
import { StatsSection } from '@/components/site/sections/stats-section';
import { TestimonialsMarqueeSection } from '@/components/site/sections/testimonials-marquee-section';
import { CTASection } from '@/components/site/sections/cta-section';
import { PopularCoursesSection } from '@/components/site/sections/popular-courses-section';
import { CategoryShowcaseSection } from '@/components/site/sections/category-showcase-section';
import { NewsPreviewSection } from '@/components/site/sections/news-preview-section';
import { FaqPreviewSection } from '@/components/site/sections/faq-preview-section';
import HomeLayout from '@/layouts/home-layout';
import { usePage } from '@inertiajs/react';
import type { Course } from '@/types/course';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
    is_active: boolean;
}

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    kelas_title: string;
    avatar: string;
}

interface Stat {
    value: string;
    label: string;
    description: string;
}

interface HomePageProps {
    features: Feature[];
    reviews: Review[];
    stats: Stat[];
    popularCourses?: Course[];
    recentNews?: {
        id: number;
        title: string;
        slug: string;
        desc?: string | null;
        image?: string | null;
        published_at?: string | null;
        category?: {
            id: number;
            name: string;
            slug?: string | null;
        } | null;
    }[];
    faqs?: {
        id: number;
        question: string;
        answer: string;
    }[];
    categoriesHighlight?: {
        id: number;
        name: string;
        slug?: string | null;
        image?: string | null;
        courses_count: number;
    }[];
}

export default function HomePage() {
    const {
        features,
        reviews,
        stats,
        popularCourses = [],
        recentNews = [],
        faqs = [],
        categoriesHighlight = [],
    } = usePage<HomePageProps>().props;

    return (
        <HomeLayout>
            <HeroSpotlight />
            <StatsSection stats={stats} />
            <PopularCoursesSection courses={popularCourses} />
            <CategoryShowcaseSection categories={categoriesHighlight} />
            <FeaturesSection features={features} />
            <NewsPreviewSection news={recentNews} />
            <TestimonialsMarqueeSection reviews={reviews} />
            <FaqPreviewSection faqs={faqs} />
            <CTASection />
        </HomeLayout>
    );
}
