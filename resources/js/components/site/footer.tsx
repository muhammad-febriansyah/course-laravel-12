import { Button } from '@/components/ui/button';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Youtube,
} from 'lucide-react';
import type { CSSProperties, ElementType } from 'react';

const PRIMARY_HEX = '#2547F9';
const PRIMARY_DARK = '#1E3FD4';
const PRIMARY_CHIP_BG = '#E8EDFF';
const PRIMARY_CHIP_BORDER = '#D5DEFF';
const PRIMARY_GRADIENT_FROM = '#F9FAFF';
const PRIMARY_GRADIENT_TO = '#EDF2FF';
const CTA_GRADIENT_FROM = '#FFFFFF';
const CTA_GRADIENT_TO = '#E5EBFF';
const BOTTOM_BG = '#F4F6FF';

// Types
interface Menu {
    id: number;
    name: string;
    title: string;
    url: string;
    icon: string;
    parent_id: number | null;
    order: number;
    is_active: boolean;
    children?: Menu[];
}

interface FooterPageProps extends PageProps {
    menus?: Menu[];
}

interface Settings {
    logo?: string;
    site_name?: string;
    desc?: string;
    address?: string;
    email?: string;
    phone?: string;
    fb?: string;
    ig?: string;
    yt?: string;
    tiktok?: string;
}

// Components
const FooterLogo = ({
    logo,
    siteName,
}: {
    logo?: string;
    siteName?: string;
}) => {
    if (!logo) return null;

    return (
        <div className="flex items-center">
            <img
                src={logo}
                alt={siteName || 'Logo'}
                className="h-16 w-32 object-cover"
            />
        </div>
    );
};

const FooterDescription = ({ description }: { description?: string }) => (
    <p className="font-poppins text-sm leading-relaxed text-slate-700">
        {description ||
            'Belajar dengan kecepatanmu sendiri dan capai tujuan karirmu melalui kursus online yang efisien.'}
    </p>
);

const FooterMenuSection = ({
    title,
    children,
}: {
    title: string;
    children?: Menu[];
}) => (
    <div className="space-y-4">
        <h4 className="font-poppins text-lg font-bold text-[var(--footer-primary)]">
            {title}
        </h4>
        {children && children.length > 0 ? (
            <ul className="space-y-3">
                {children.map((child) => (
                    <li key={child.id}>
                        <Link
                            href={child.url}
                            className="group flex items-center gap-2 text-sm text-slate-700 transition-all"
                        >
                            <ArrowRight className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 text-[var(--footer-primary)]" />
                            <span className="font-poppins underline-offset-4 transition-all group-hover:font-semibold group-hover:text-[var(--footer-primary)] group-hover:underline">
                                {child.title}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        ) : (
            <DefaultMenuLinks />
        )}
    </div>
);

const DefaultMenuLinks = () => (
    <ul className="space-y-3">
        {[
            { label: 'Cek Sertifikat', href: '/cek-sertifikat' },
            { label: 'Kelas', href: '/cek-sertifikat' },
            { label: 'Berita/Blog', href: '/cek-sertifikat' },
            { label: 'Masuk', href: '/login' },
            { label: 'Daftar', href: '/register' },
        ].map((item) => (
            <li key={item.label}>
                <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-slate-700 transition-all"
                >
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 text-[var(--footer-primary)]" />
                    <span className="font-poppins underline-offset-4 transition-all group-hover:font-semibold group-hover:text-[var(--footer-primary)] group-hover:underline">
                        {item.label}
                    </span>
                </Link>
            </li>
        ))}
    </ul>
);

const ContactItem = ({
    icon: Icon,
    value,
    href,
}: {
    icon: ElementType;
    value: string;
    href?: string;
}) => (
    <li className="flex items-start gap-3">
        <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
            style={{
                backgroundColor: PRIMARY_CHIP_BG,
                color: PRIMARY_HEX,
            }}
        >
            <Icon className="h-5 w-5" />
        </span>
        {href ? (
            <a
                href={href}
                className="font-poppins text-sm text-slate-700 transition-colors hover:text-[var(--footer-primary)]"
            >
                {value}
            </a>
        ) : (
            <span className="font-poppins text-sm text-slate-700">{value}</span>
        )}
    </li>
);

const OfficeSection = ({ settings }: { settings?: Settings }) => (
    <div className="space-y-4">
        <h4 className="font-poppins text-lg font-bold text-[var(--footer-primary)]">
            Office
        </h4>
        <ul className="space-y-4">
            {settings?.address && (
                <ContactItem icon={MapPin} value={settings.address} />
            )}
            {settings?.email && (
                <ContactItem
                    icon={Mail}
                    value={settings.email}
                    href={`mailto:${settings.email}`}
                />
            )}
            {settings?.phone && (
                <ContactItem
                    icon={Phone}
                    value={settings.phone}
                    href={`tel:${settings.phone}`}
                />
            )}
        </ul>
    </div>
);

const SocialIcon = ({
    href,
    icon: Icon,
    label,
}: {
    href: string;
    icon: ElementType;
    label: string;
}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="flex size-11 items-center justify-center rounded-xl border transition-all hover:-translate-y-1 hover:bg-[var(--footer-primary)] hover:text-white"
        style={{
            borderColor: PRIMARY_CHIP_BORDER,
            color: PRIMARY_HEX,
            backgroundColor: 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 20px rgba(37, 71, 249, 0.08)',
        }}
    >
        <Icon className="h-5 w-5" />
    </a>
);

const TikTokIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const SocialMediaSection = ({ settings }: { settings?: Settings }) => (
    <div className="flex flex-wrap gap-3">
        {settings?.fb && (
            <SocialIcon href={settings.fb} icon={Facebook} label="Facebook" />
        )}
        {settings?.ig && (
            <SocialIcon href={settings.ig} icon={Instagram} label="Instagram" />
        )}
        {settings?.yt && (
            <SocialIcon href={settings.yt} icon={Youtube} label="YouTube" />
        )}
        {settings?.tiktok && (
            <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex size-11 items-center justify-center rounded-xl border transition-all hover:-translate-y-1 hover:bg-[var(--footer-primary)] hover:text-white"
                style={{
                    borderColor: PRIMARY_CHIP_BORDER,
                    color: PRIMARY_HEX,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 8px 20px rgba(37, 71, 249, 0.08)',
                }}
            >
                <TikTokIcon />
            </a>
        )}
    </div>
);

const FollowUsSection = ({
    menu,
    settings,
}: {
    menu?: Menu;
    settings?: Settings;
}) => (
    <div className="space-y-6">
        <div className="space-y-4">
            <h4 className="font-poppins text-lg font-bold text-[var(--footer-primary)]">
                {menu?.title || 'Follow Us'}
            </h4>

            {menu?.children && menu.children.length > 0 ? (
                <ul className="space-y-3">
                    {menu.children.map((child) => (
                        <li key={child.id}>
                            <Link
                                href={child.url}
                                className="font-poppins text-sm text-slate-700 transition-colors hover:text-[var(--footer-primary)]"
                            >
                                {child.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <p className="font-poppins text-sm text-slate-700">
                        Tetap terhubung dengan kami di media sosial untuk
                        mendapatkan pembaruan dan pengumuman menarik.
                    </p>
                    <SocialMediaSection settings={settings} />
                </>
            )}
        </div>

        <CTACard />
    </div>
);

const CTACard = () => (
    <div
        className="space-y-3 rounded-2xl p-6"
        style={{
            background: `linear-gradient(135deg, ${CTA_GRADIENT_FROM} 0%, ${CTA_GRADIENT_TO} 100%)`,
            boxShadow: '0 20px 40px rgba(37, 71, 249, 0.1)',
        }}
    >
        <h5 className="font-poppins text-base font-bold text-slate-900">
            Ready To Learn?
        </h5>
        <p className="font-poppins text-sm text-slate-600">
            Pilih kelas sesuai kebutuhan dan mulai perjalanan belajar Anda.
        </p>
        <Button
            asChild
            className="font-poppins w-full rounded-lg font-semibold text-white transition-all hover:bg-[#1E3FD4]"
            style={{
                backgroundColor: PRIMARY_HEX,
                boxShadow: '0 12px 30px rgba(37, 71, 249, 0.18)',
            }}
        >
            <Link href="/kelas">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
    </div>
);

const FooterBottom = ({
    siteName,
    year,
}: {
    siteName?: string;
    year: number;
}) => (
    <div
        className="border-t border-transparent"
        style={{ backgroundColor: BOTTOM_BG }}
    >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="font-poppins text-sm text-slate-600">
                    © {year} {siteName || 'Course Platform'}. All rights
                    reserved.{' '}
                    <span style={{ color: PRIMARY_HEX }}>❤️</span>
                </p>
            </div>
        </div>
    </div>
);

// Main Component
export function Footer() {
    const { settings, menus = [] } = usePage<FooterPageProps>().props;
    const currentYear = new Date().getFullYear();
    const footerStyle: CSSProperties = {
        '--footer-primary': PRIMARY_HEX,
        '--footer-primary-dark': PRIMARY_DARK,
        '--footer-chip-bg': PRIMARY_CHIP_BG,
        '--footer-chip-border': PRIMARY_CHIP_BORDER,
        '--footer-gradient-from': PRIMARY_GRADIENT_FROM,
        '--footer-gradient-to': PRIMARY_GRADIENT_TO,
        '--footer-cta-from': CTA_GRADIENT_FROM,
        '--footer-cta-to': CTA_GRADIENT_TO,
        '--footer-bottom-bg': BOTTOM_BG,
        background: `linear-gradient(180deg, ${PRIMARY_GRADIENT_FROM} 0%, ${PRIMARY_GRADIENT_TO} 55%, ${CTA_GRADIENT_TO} 100%)`,
    };
    return (
        <footer className="relative w-full" style={footerStyle}>
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-35">
                <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#2547F9]/25 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-[#9fb7ff]/25 blur-3xl" />
            </div>

            {/* Main Footer */}
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
                    {/* Brand Section */}
                    <div className="space-y-6 lg:col-span-1">
                        <FooterLogo
                            logo={settings?.logo}
                            siteName={settings?.site_name}
                        />
                        <FooterDescription description={settings?.desc} />
                    </div>

                    {/* Useful Links */}
                    <FooterMenuSection
                        title={menus[0]?.title || 'Useful Links'}
                        children={menus[0]?.children}
                    />

                    {/* Office */}
                    <OfficeSection settings={settings} />

                    {/* Follow Us */}
                    <FollowUsSection menu={menus[1]} settings={settings} />
                </div>
            </div>

            {/* Bottom Bar */}
            <FooterBottom siteName={settings?.site_name} year={currentYear} />
        </footer>
    );
}
