import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminLayout>
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
                {children}
            </div>
        </AdminLayout>
    );
}