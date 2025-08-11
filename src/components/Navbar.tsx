'use client'

import {ColourfulText} from "@/components/ui/colourful-text"
import { motion } from "framer-motion"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinkClass = (path: string) =>
    `relative transition-colors duration-200 ${
      pathname === path ? "text-white font-semibold" : "text-white/80 hover:text-white"
    }`;

  return (
    
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-[-1] rounded-none"
        style={{
            background: "radial-gradient(circle at 20% 30%, #0f172a, #020617 80%)",
            backgroundSize: "200% 200%",
        }}
        animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        }}
        />



      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-white z-10 tracking-wide">
                <ColourfulText text="EchoBox" /> <br /> 
            </h1>

          {/* Links */}
          <div className="flex items-center gap-6 z-10">
            <Link href="/" className={navLinkClass("/")}>
              Home
              {pathname === "/" && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              )}
            </Link>

            <Link href="/about" className={navLinkClass("/about")}>
              About
              {pathname === "/about" && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              )}
            </Link>

            {!session ? (
              <>
                <Link
                  href="/sign-in"
                  className={navLinkClass("/sign-in")}
                >
                  Sign In
                  {pathname === "/sign-in" && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  )}
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={navLinkClass("/dashboard")}
                >
                  Dashboard
                  {pathname === "/dashboard" && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  )}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
