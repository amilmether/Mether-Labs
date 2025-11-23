"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [router, pathname]);

    if (pathname === "/admin/login") return <>{children}</>;

    return <>{children}</>;
}
