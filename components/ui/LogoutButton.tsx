"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <a onClick={()=> signOut()} className="bg-red-500 cursor-pointer text-white rounded p-2 ">Logout</a>
    )
}