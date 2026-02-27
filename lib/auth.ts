import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const auth = () => getServerSession(authOptions)

export const checkAdmin = async () => {
    const session = await auth();
    if(session?.user?.role !== "admin"){
        throw new Error("Unauthorized");
    }
    return session;
}
