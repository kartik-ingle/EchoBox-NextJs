"use client";


import { Github, Linkedin } from "lucide-react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { motion } from "framer-motion";
import Image from "next/image";

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2">
    <Image
      src={avatar}
      height={20}
      width={20}
      alt="avatar"
      className="rounded-full border-2 border-white"
    />
    <p className="font-semibold">{title}</p>
  </div>
);


export default function AboutSection() {
  return (
    <section className="flex gap-8 flex-col md:flex-row bg-gradient-to-r from-purple-900 via-pink-700 to-indigo-900 text-white min-h-[70vh] px-24 py-36">
      {/* Left Column */}
      <div className="mx-auto w-80">
      <FollowerPointerCard
        title={
          <TitleComponent
            title="Kartik Ingle"
            avatar="/pfp/pfp.png"
          />
        }
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative h-full overflow-hidden rounded-2xl border border-pink-600 bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-900 shadow-[0_0_20px_rgba(236,72,153,0.7)]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-900 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black before:via-transparent before:to-transparent before:opacity-70">
            <motion.img
              src="/pfp/pfp.png"
              alt="Kartik Ingle"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              style={{
                filter: "drop-shadow(0 0 10px #ec4899)",
              }}
              whileHover={{ rotate: 3, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            {/* Glowing ring around image */}
            <motion.div
              className="pointer-events-none absolute -inset-3 rounded-2xl border border-pink-400 opacity-60 blur-xl animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="p-6 text-white drop-shadow-lg">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-text-flicker mb-1 drop-shadow-md">
                Welcome! I’m Kartik Ingle
            </h1>

            <p className="mt-2 text-sm font-light leading-relaxed tracking-wide text-pink-300 drop-shadow-sm">
                The creator behind this modern web app built with Next.js, React, and a sprinkle of magic ✨.
            </p>


           <div className="mt-8 border-t border-pink-600 pt-6 flex flex-col space-y-3">
                <p className="text-sm font-semibold tracking-wide text-pink-400 drop-shadow-md">
                    Contact me at:
                </p>
              <div className="flex items-center space-x-5">
                <motion.a
                  href="mailto:ikartik1211@gmail.com"
                  className="text-sm text-pink-300 hover:text-pink-100 hover:underline transition"
                  whileHover={{ scale: 1.1 }}
                >
                  ikartik1211@gmail.com
                </motion.a>
                <motion.a
                  href="https://github.com/kartik-ingle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-pink-100 transition transform"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  aria-label="GitHub"
                >
                  <Github size={26} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/kartikingle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-pink-100 transition transform"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={26} />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </FollowerPointerCard>

      <style jsx>{`
        @keyframes text-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.5;
          }
        }
        .animate-text-flicker {
          animation: text-flicker 3s infinite;
        }
      `}</style>
    </div>
    
      {/* Right Column */}
      <div className="md:w-1/2 flex flex-col justify-center max-w-lg mx-4 md:mx-0">
        <h3 className="text-4xl font-extrabold mb-6 drop-shadow-lg">About EchoBox</h3>

        <p className="text-lg leading-relaxed text-gray-300 drop-shadow-md">
          EchoBox is a modern, user-friendly web application designed to provide an anonymous feedback platform where users can share their thoughts and opinions freely and securely.
          <br /><br />
          Built using Next.js and React, EchoBox leverages cutting-edge web technologies to deliver a seamless, interactive experience. The platform features real-time message posting, powerful moderation tools, and an intuitive interface designed to foster open and honest communication.
          <br /><br />
          Explore EchoBox to experience a safe, welcoming space where your voice truly matters.
        </p>
      </div>
    </section>
  );
}
