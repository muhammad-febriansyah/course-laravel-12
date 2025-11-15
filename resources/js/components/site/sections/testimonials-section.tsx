import { Quote, Star } from 'lucide-react';

export function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Budi Santoso',
            role: 'Web Developer',
            image: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=2547F9&color=fff',
            content:
                'Platform pembelajaran yang sangat membantu! Materi lengkap dan instruktur sangat responsif. Karir saya meningkat pesat setelah mengikuti kursus di sini.',
            rating: 5,
        },
        {
            name: 'Siti Rahma',
            role: 'UI/UX Designer',
            image: 'https://ui-avatars.com/api/?name=Siti+Rahma&background=8B5CF6&color=fff',
            content:
                'Kualitas kursus sangat baik dengan harga terjangkau. Saya berhasil mendapatkan pekerjaan impian berkat skill yang saya dapat dari platform ini.',
            rating: 5,
        },
        {
            name: 'Andi Wijaya',
            role: 'Data Analyst',
            image: 'https://ui-avatars.com/api/?name=Andi+Wijaya&background=10B981&color=fff',
            content:
                'Sangat merekomendasikan untuk yang ingin upgrade skill. Materinya up-to-date dan praktis bisa langsung diterapkan di pekerjaan.',
            rating: 5,
        },
    ];

    return (
        <section className="bg-white py-16 lg:py-24">
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

                {/* Testimonials Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Quote Icon */}
                            <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2 text-blue-600">
                                <Quote className="h-5 w-5" />
                            </div>

                            {/* Rating */}
                            <div className="mb-4 flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="mb-6 text-slate-600 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="h-12 w-12 rounded-full ring-2 ring-slate-100"
                                />
                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative gradient */}
                            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
