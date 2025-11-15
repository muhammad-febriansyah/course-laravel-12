import { PageHeader } from '@/components/site/page-header';
import HomeLayout from '@/layouts/home-layout';
import { Head } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    Phone,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Clock,
    MessageCircle,
    CheckCircle2,
    HeadphonesIcon,
    Zap,
} from 'lucide-react';

interface Settings {
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    fb?: string | null;
    ig?: string | null;
    yt?: string | null;
    tiktok?: string | null;
    desc?: string | null;
    maps_embed_url?: string | null;
}

interface Props {
    settings?: Settings | null;
}

const contactChannels = (settings: Settings) => [
    {
        title: 'Email Kami',
        description: 'Tim support siap membantu kebutuhan Anda.',
        action: settings.email || 'support@skillup.id',
        icon: Mail,
        href: `mailto:${settings.email || 'support@skillup.id'}`,
    },
    {
        title: 'Telepon / WhatsApp',
        description: 'Hubungi kami untuk konsultasi dan kolaborasi.',
        action: settings.phone || '+62 812-0000-1234',
        icon: Phone,
        href: `https://wa.me/${(settings.phone || '').replace(/[^0-9]/g, '') || '6281200001234'}`,
    },
    {
        title: 'Live Chat',
        description: 'Terhubung dengan kami secara interaktif.',
        action: 'Mulai Live Chat',
        icon: MessageCircle,
        href: '#live-chat',
    },
];

const socialLinks = (settings: Settings) =>
    [
        { icon: Facebook, href: settings.fb, label: 'Facebook' },
        { icon: Instagram, href: settings.ig, label: 'Instagram' },
        { icon: Youtube, href: settings.yt, label: 'YouTube' },
        { icon: Linkedin, href: settings.tiktok, label: 'TikTok' },
    ].filter((item) => item.href);

export default function ContactPage({ settings = {} }: Props) {
    const description =
        settings.desc ||
        'Hubungi tim kami untuk bantuan, peluang kolaborasi, atau informasi lebih lanjut mengenai layanan Skill Up.';

    const channels = contactChannels(settings);
    const socials = socialLinks(settings);

    return (
        <HomeLayout>
            <Head title="Hubungi Kami" />

            <PageHeader title="Hubungi Kami" description={description} />

            <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-3">
                        {[{
                            icon: Zap,
                            title: 'Respon Cepat',
                            detail: '< 2 jam di hari kerja',
                        },
                        {
                            icon: HeadphonesIcon,
                            title: 'Support 24/7',
                            detail: 'Tim siap membantu',
                        },
                        {
                            icon: CheckCircle2,
                            title: 'Solusi Tepat',
                            detail: 'Konsultasi profesional',
                        }].map(({ icon: Icon, title, detail }) => (
                            <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
                                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{title}</h3>
                                    <p className="text-sm text-slate-600">{detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
                        <div className="space-y-8">
                            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm shadow-primary/10 sm:p-8">
                                <h2 className="text-2xl font-semibold text-slate-900">Mari Diskusikan Kebutuhan Anda</h2>
                                <p className="mt-3 text-sm text-slate-600">
                                    Kami senang mendengar pertanyaan, masukan, atau ide kolaborasi dari Anda.
                                </p>

                                <div className="mt-6 space-y-4">
                                    {channels.map((channel) => (
                                        <a
                                            key={channel.title}
                                            href={channel.href}
                                            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 transition hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-r hover:from-[#2547F9] hover:to-[#1e3fd4] hover:text-white hover:shadow-xl"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-white/20 group-hover:text-white">
                                                <channel.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold">{channel.title}</h3>
                                                <p className="text-xs text-slate-500 transition group-hover:text-blue-100">
                                                    {channel.description}
                                                </p>
                                                <p className="text-sm font-medium text-primary transition group-hover:text-white">
                                                    {channel.action}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-lg font-semibold text-slate-900">Lokasi &amp; Jam Operasional</h2>
                                <div className="mt-4 space-y-4 text-sm text-slate-600">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-1 h-5 w-5 text-primary" />
                                        <p>{settings.address || 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta'}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-1 h-5 w-5 text-primary" />
                                        <p>Senin - Jumat, 09.00 - 18.00 WIB</p>
                                    </div>
                                </div>

                                {socials.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Ikuti kami
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {socials.map((social) => {
                                                const Icon = social.icon;
                                                return (
                                                    <a
                                                        key={social.label}
                                                        href={social.href!}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-transparent hover:bg-gradient-to-r hover:from-[#2547F9] hover:to-[#1e3fd4] hover:text-white"
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-[#2547F9] to-[#1e3fd4] p-6 text-white shadow-lg sm:p-8">
                                <h2 className="text-2xl font-semibold">Butuh bantuan cepat?</h2>
                                <p className="mt-3 text-sm text-blue-100">
                                    Tim kami tersedia melalui live chat tiap hari kerja pukul 09.00 - 18.00 WIB.
                                </p>
                                <a
                                    id="live-chat"
                                    href="https://wa.me/6281200001234"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-slate-100"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Mulai Percakapan
                                </a>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-lg font-semibold text-slate-900">Alamat Email Resmi</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Untuk kebutuhan kemitraan, media, atau dukungan teknis.
                                </p>
                                <div className="mt-4 space-y-3 text-sm font-medium text-primary">
                                    <a href={`mailto:${settings.email || 'hello@skillup.id'}`} className="block hover:underline">
                                        {settings.email || 'hello@skillup.id'}
                                    </a>
                                    <a href="mailto:partnership@skillup.id" className="block hover:underline">
                                        partnership@skillup.id
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {settings?.maps_embed_url && (
                <section className="border-t border-slate-200 bg-slate-50 py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-slate-900">Kunjungi Kantor Kami</h2>
                            <p className="mt-2 text-slate-600">
                                Anda dapat mengunjungi kantor kami untuk konsultasi langsung.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
                            <iframe
                                src={settings.maps_embed_url}
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Kantor"
                            />
                        </div>
                    </div>
                </section>
            )}
        </HomeLayout>
    );
}
