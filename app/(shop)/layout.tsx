import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
            <AuthModal />
        </div>
    )
}