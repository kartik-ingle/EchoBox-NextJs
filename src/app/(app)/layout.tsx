'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import Navbar from "@/components/Navbar";


import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: session } = useSession();
  const pathname = usePathname();

  // Pages where footer should appear
  const showFooter =
    !session && !pathname.startsWith("/dashboard");
  return (

      <div className="flex flex-col min-h-screen">
        <Navbar />
      {children}
        {showFooter && <Footer />}
    </div>

  );
}
