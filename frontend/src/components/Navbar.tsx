"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, Briefcase, Mail } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Work", href: "/projects", icon: Code },
        { name: "Services", href: "/services", icon: Briefcase },
        { name: "Contact", href: "/contact", icon: Mail },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        // Floating Navbar at bottom for all devices
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/50 rounded-full px-2 py-2 shadow-2xl">
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-full
                                    transition-all duration-300 ease-out
                                    ${active
                                        ? "bg-white text-black font-medium shadow-lg"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                                    }
                                `}
                            >
                                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                <span className="text-xs font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
