'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import AutoPlay from "embla-carousel-autoplay"

import { Cover } from "@/components/ui/cover"
import { motion } from "framer-motion"

export default function Home() {
  
  return (
    <main className="relative flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-20 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: "#0a1120",
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

      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
          Dive into the world of <br />
            <Cover className="">Anonymous</Cover> Conversations
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          Explore <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">EchoBox</span> — Where your identity remains a secret.
        </p>
      </section>

      {/* Carousel */}
      <Carousel
        plugins={[AutoPlay({ delay: 3000 })]}
        className="w-full max-w-lg"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  <CardHeader className="text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-4 gap-3">
                    <span className="text-lg md:text-xl font-medium text-white/90 text-center leading-relaxed">
                      “{message.content}”
                    </span>
                    <span className="text-sm text-white/50 italic">
                      {message.received}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90" />
        <CarouselNext className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90" />
      </Carousel>
    </main>
  );
}
