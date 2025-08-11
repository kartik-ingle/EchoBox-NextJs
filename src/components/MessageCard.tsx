'use client';

import React, { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isHover, setIsHover] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

  // Window size for confetti canvas
  const { width, height } = useWindowSize();

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [50, -50], [-10, 10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    setIsHover(false);
    x.set(0);
    y.set(0);
  }

  const handleDeleteConfirm = async () => {
    try {
      audioRef.current?.play();
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id.toString());

      // Trigger confetti for 3 seconds
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        className: 'bg-red-500 text-white border border-red-700',
      });
    }
  };

  return (
    <>
    <motion.div
      ref={cardRef}
      className="relative rounded-xl cursor-pointer select-none bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-900
                 dark:from-purple-700 dark:via-pink-500 dark:to-indigo-700 shadow-lg"
      onMouseEnter={() => setIsHover(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 600,
        transformStyle: 'preserve-3d',
        boxShadow: isHover
          ? '0 0 20px 4px rgba(236, 72, 153, 0.7), 0 0 30px 8px rgba(232, 121, 249, 0.6)'
          : '0 5px 15px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Animated gradient shine */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background:
            'linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(30px)',
          opacity: isHover ? 1 : 0,
          translateX: isHover ? '100%' : '-100%',
        }}
        animate={{ translateX: isHover ? ['-100%', '100%'] : '-100%' }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />

      {/* Fade/blur overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHover ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Confetti on delete */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <Card className="relative z-10 bg-transparent border-0 shadow-none">
        <CardHeader className="pb-1">
          <div className="flex justify-between items-start">
            <CardTitle
              className={`text-white font-semibold leading-relaxed max-w-[calc(100%-40px)] transition-colors duration-300
              ${isHover ? 'text-pink-300' : 'text-white'}`}
            >
              {message.content}
            </CardTitle>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full opacity-70 hover:opacity-100 transition"
                  aria-label="Delete message"
                >
                  <Button variant="destructive" size="sm" className="p-0">
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete message?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-xs text-purple-300 mt-1 select-none transition-opacity duration-300 opacity-80">
            {dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
          </div>
        </CardHeader>
        <CardContent className="pt-0" />
      </Card>
    </motion.div>
    <audio ref={audioRef} src="/sounds/Pop.wav" preload="auto" />
    </>
  );
}

export default MessageCard;
