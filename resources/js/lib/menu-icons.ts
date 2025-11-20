import {
    Award,
    BadgePercent,
    BookOpen,
    DollarSign,
    FileQuestion,
    FileText,
    Gift,
    GraduationCap,
    HelpCircle,
    Home,
    LayoutDashboard,
    Library,
    LibraryBig,
    List,
    Megaphone,
    MessageCircleQuestion,
    PlayCircle,
    Receipt,
    ReceiptText,
    School,
    Settings,
    SettingsIcon,
    Shield,
    Sparkles,
    Target,
    Tag,
    TrendingUp,
    UserCircle,
    Users,
    Wallet,
    type LucideIcon,
} from 'lucide-react';

const menuIconMap: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    'layout-dashboard': LayoutDashboard,
    people: Users,
    school: School,
    library_books: LibraryBig,
    campaign: Megaphone,
    help: HelpCircle,
    settings: Settings,
    class: BookOpen,
    category: Tag,
    trending_up: TrendingUp,
    label: Tag,
    list: List,
    play_circle: PlayCircle,
    quiz: FileQuestion,
    local_offer: BadgePercent,
    card_giftcard: Gift,
    help_outline: MessageCircleQuestion,
    'message-circle-question': MessageCircleQuestion,
    receipt: Receipt,
    description: FileText,
    file_text: FileText,
    award: Award,
    shield: Shield,
    target: Target,
    sparkles: Sparkles,
    settings_applications: SettingsIcon,
    appearance: SettingsIcon,
    two_factor: Shield,
    // Student dashboard icons
    home: Home,
    'book-open': BookOpen,
    'graduation-cap': GraduationCap,
    library: Library,
    'receipt-text': ReceiptText,
    'user-circle': UserCircle,
    // Earnings/Money icons
    attach_money: DollarSign,
    payments: Wallet,
    wallet: Wallet,
};

export const resolveMenuIcon = (icon?: string): LucideIcon => {
    if (!icon) {
        return LayoutDashboard;
    }

    return menuIconMap[icon] ?? LayoutDashboard;
};

export type MenuIconKey = keyof typeof menuIconMap;
