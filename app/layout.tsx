import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixLink — The digital bridge connecting you to trusted local experts instantly.",
  description:
    "The digital bridge connecting you to trusted local experts instantly. Discover vetted electricians, plumbers, carpenters, and trade pre-owned second-hand goods locally.",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "FixLink",
    "local services",
    "hire electrician",
    "local plumber",
    "handyman",
    "second-hand marketplace",
    "buy sell local",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
