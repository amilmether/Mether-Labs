"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdminControls } from "./AdminControls";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <AdminControls />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
