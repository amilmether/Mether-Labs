"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, LayoutDashboard, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const AdminControls = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    if (!isLoggedIn) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 mb-2 min-w-[200px]"
                    >
                        <div className="text-xs font-mono text-zinc-500 px-2 py-1 border-b border-zinc-800 mb-1 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            ADMIN_MODE
                        </div>

                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 bg-zinc-800 group-hover:bg-white group-hover:text-black rounded-lg flex items-center justify-center transition-colors">
                                <LayoutDashboard size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Dashboard</div>
                                <div className="text-xs text-zinc-500">View stats & messages</div>
                            </div>
                        </Link>

                        <button
                            onClick={() => {
                                // Toggle edit mode via URL param
                                const currentPath = window.location.pathname;
                                router.push(`${currentPath}?edit=true`);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 bg-zinc-800 group-hover:bg-white group-hover:text-black rounded-lg flex items-center justify-center transition-colors">
                                <Edit size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Edit Mode</div>
                                <div className="text-xs text-zinc-500">Modify content inline</div>
                            </div>
                        </button>

                        <div className="border-t border-zinc-800 mt-1 pt-2">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    setIsLoggedIn(false);
                                    router.push("/");
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border-2 border-zinc-800"
            >
                {isOpen ? <X size={22} /> : <Edit size={22} />}
            </button>
        </div>
    );
};
