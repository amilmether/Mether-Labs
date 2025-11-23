"use client";

import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { AdminControls } from "./AdminControls";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <AdminControls />
            <main className="pt-4 md:pt-6 pb-12 min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
