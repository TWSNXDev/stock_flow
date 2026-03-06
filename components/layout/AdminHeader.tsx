'use client';

import { useState, useRef, useEffect } from "react";
import { Menu, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 shadow-sm gap-2">
            <div className="flex gap-2">
                {/* Hamburger Menu */}
                <button onClick={() => onToggleSidebar()} className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-200 transition-colors duration-200 focus:outline-none cursor-pointer">
                    <Menu className="w-6 h-6 text-slate-700" />
                </button>

                {/* Search Bar */}
                <div className="flex-1 mx-6 max-w-xl hidden sm:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-all duration-200 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={profileRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/60 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 group cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-11 h-11 overflow-hidden rounded-full ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-md group-hover:shadow-lg">
                            <Image
                                src="/images/users/avatar.jpg"
                                alt="User profile"
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="font-semibold text-sm text-slate-800 leading-tight">Admin</p>
                        <p className="text-[11px] text-slate-500 leading-tight">Developer</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <div
                    className={`absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ease-out origin-top-right ${isProfileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                >
                    {/* Profile Header */}
                    <div className="relative px-5 py-4 bg-linear-to-br from-blue-500 to-indigo-600 text-white">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-60"></div>
                        <div className="relative flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-white/30 shadow-lg">
                                <Image
                                    src="/images/users/avatar.jpg"
                                    alt="User profile"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-sm drop-shadow-sm">Admin</p>
                                <p className="text-[11px] text-blue-100">admin@example.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 px-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover/item:bg-blue-100 transition-colors duration-200">
                                <User className="w-4 h-4 text-slate-500 group-hover/item:text-blue-600 transition-colors duration-200" />
                            </div>
                            <span className="font-medium">Profile</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover/item:bg-blue-100 transition-colors duration-200">
                                <Settings className="w-4 h-4 text-slate-500 group-hover/item:text-blue-600 transition-colors duration-200" />
                            </div>
                            <span className="font-medium">Settings</span>
                        </button>
                    </div>

                    <div className="mx-4 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

                    <div className="py-2 px-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group/item">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 group-hover/item:bg-red-100 transition-colors duration-200">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}