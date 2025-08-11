"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ColourfulText } from "@/components/ui/colourful-text";
import { useSession } from "next-auth/react";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="relative border-white/10"
        style={{
            background: "radial-gradient(circle at 20% 30%, #0f172a, #020617 80%)"
        }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-[-1]"
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

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center text-white gap-6">
        
        {/* Left - Logo & Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">
            <ColourfulText text="EchoBox" />
          </h2>
          <p className="text-white/60 text-sm">Anonymous feedback made simple.</p>
        </div>

        {/* Middle - Quick Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-purple-400">Home</Link>
          <Link href="/about" className="hover:text-purple-400">About</Link>
          {!session ? (
            <>
              <Link href="/sign-in" className="hover:text-purple-400">Sign In</Link>
              <Link href="/sign-up" className="hover:text-purple-400">Sign Up</Link>
            </>
          ) : (
            <Link href="/dashboard" className="hover:text-purple-400">Dashboard</Link>
          )}
        </div>

        {/* Right - Social Icons with Glassy Buttons */}
        <div className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.15, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/kartik-ingle"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-purple-500/20 hover:border-purple-400 transition-all"
          >
            <Github size={20} className="text-white" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.15, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            href="https://www.linkedin.com/in/kartik-ingle-b0258a279/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-purple-500/20 hover:border-purple-400 transition-all"
          >
            <Linkedin size={20} className="text-white" />
          </motion.a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 text-center py-4 text-xs text-white/60">
        © {new Date().getFullYear()} EchoBox. All rights reserved.
      </div>
    </footer>
  );
}
