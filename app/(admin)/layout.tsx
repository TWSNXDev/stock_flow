import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="flex">
                    <AdminSidebar />
                    <div className="flex-1 p-4">
                        <AdminNavbar />
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}