"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({children} : {children: React.ReactNode}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close sidebar on navigation in mobile
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [pathname, isMobile]);

    return (
        <div className="flex min-h-screen relative">
            {/* Mobile backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                ${isMobile ? "fixed inset-y-0 left-0 z-50 transition-transform duration-300" : ""}
                ${isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
            `}>
                <AdminSidebar isOpen={isSidebarOpen} isMobile={isMobile} />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-2 sm:p-4 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}