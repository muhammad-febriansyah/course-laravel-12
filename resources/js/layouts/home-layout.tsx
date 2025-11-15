import { FloatingNavbar } from '@/components/site/floating-navbar';
import { Footer } from '@/components/site/footer';

interface Props {
    children?: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
    return (
        <div id="home" className="min-h-screen overflow-x-hidden bg-white">
            <FloatingNavbar />
            {children}
            <Footer />
        </div>
    );
}
