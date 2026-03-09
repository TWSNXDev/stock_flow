import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        console.log("Middleware token:", token);
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

        if (isAdminPage && token?.role !== "ADMIN"){
            return NextResponse.redirect(new URL("/unauthorized",req.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        }
    }
)

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*"
    ],
}