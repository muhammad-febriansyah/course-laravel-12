import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Award } from 'lucide-react';

interface Stat {
    value: string;
    label: string;
    description: string;
}

interface StatsSectionProps {
    stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
    const icons = [Users, BookOpen, GraduationCap, Award];

    return (
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = icons[index] || Users;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1 + 0.2,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                        className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"
                                    >
                                        <Icon className="h-6 w-6" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1 + 0.3
                                        }}
                                        className="mb-2 text-4xl font-bold text-slate-900"
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <div className="mb-1 text-lg font-semibold text-slate-700">
                                        {stat.label}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {stat.description}
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue-600/5 transition-all duration-300 group-hover:scale-150" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}