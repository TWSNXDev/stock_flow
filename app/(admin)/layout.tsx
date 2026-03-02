import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminLayout>
            <div className="container mx-auto py-4">
                {children}
            </div>
        </AdminLayout>
    );
}