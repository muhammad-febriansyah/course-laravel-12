import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
    is_active: boolean;
}

interface FeaturesSectionProps {
    features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
    // Get icon component dynamically
    const getIcon = (iconName: string) => {
        const IconComponent = Icons[iconName as keyof typeof Icons] as any;
        return IconComponent || Icons.Star;
    };

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="font-poppins text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                        Mengapa Memilih{' '}
                        <span
                            className="text-transparent"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, #2547F9, #1e3fd4, #1837af)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                            }}
                        >
                            Platform Kami
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl font-poppins text-lg text-slate-600">
                        Berbagai keunggulan yang kami tawarkan untuk pengalaman
                        belajar terbaik Anda
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const IconComponent = getIcon(feature.icon);

                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="group relative"
                            >
                                <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#2547F9] hover:shadow-xl">
                                    {/* Icon */}
                                    <div
                                        className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                                        style={{
                                            background:
                                                'linear-gradient(to bottom right, #2547F9, #1e3fd4)',
                                        }}
                                    >
                                        <IconComponent className="h-7 w-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="mb-3 font-poppins text-xl font-semibold text-slate-900">
                                        {feature.title}
                                    </h3>
                                    <p className="font-poppins text-sm leading-relaxed text-slate-600">
                                        {feature.description}
                                    </p>

                                    {/* Hover Effect Line */}
                                    <div
                                        className="absolute bottom-0 left-0 h-1 w-0 rounded-full transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: '#2547F9' }}
                                    ></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
