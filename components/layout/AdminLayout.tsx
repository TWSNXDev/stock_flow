"use client";

import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({children} : {children: React.ReactNode}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex min-h-screen">
            <AdminSidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}