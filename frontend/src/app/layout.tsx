import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LayoutContent } from "@/components/LayoutContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amil Mether | Full Stack Engineer",
  description: "Developer & Tech Problem Solver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white font-sans`}
      >
        <LoadingScreen />
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
