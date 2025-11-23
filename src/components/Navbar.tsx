"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, Briefcase, Mail, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/about", icon: User },
        { name: "Work", href: "/projects", icon: Code },
        { name: "Services", href: "/services", icon: Briefcase },
        { name: "Contact", href: "/contact", icon: Mail },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw]">
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/50 rounded-full p-1.5 shadow-2xl flex items-center gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                relative flex items-center justify-center rounded-full
                                transition-colors duration-300
                                ${active ? "text-black" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"}
                            `}
                        >
                            {active && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 bg-white rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}

                            <div className="relative flex items-center gap-2 px-4 py-2.5 z-10">
                                <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                                {/* Mobile: Text appears only when active */}
                                <AnimatePresence>
                                    {active && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "auto", opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden md:hidden"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Desktop: Text always visible */}
                                <span className="hidden md:block text-sm font-medium">
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
