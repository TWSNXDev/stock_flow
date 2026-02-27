import Link from "next/link";

export default function AdminNavbar() {
    return (
        <div className="container mx-auto p-4 flex justify-between">
            <Link href="/admin">Admin Dashboard</Link>
            <div>
            </div>
        </div>
    )
}