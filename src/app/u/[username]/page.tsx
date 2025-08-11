'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { messageSchema } from '@/Schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { useCompletion } from '@ai-sdk/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message, {
        className: "bg-white text-black border border-gray-200",
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error', {
        description: axiosError.response?.data.message ?? 'Failed to send message',
        className: "bg-red-500 text-white border border-red-700",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1120] via-[#1b1f38] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-10 text-center"
      >
        Send an Anonymous Message to <span className="text-white">@{username}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-purple-700"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">
                    Your Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none min-h-[140px] bg-transparent text-white placeholder:text-white/60 focus:ring-2 focus:ring-purple-500 border border-purple-600 rounded-md"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-pink-400" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg cursor-pointer"
              >
                {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                Send It
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="mt-10 w-full max-w-3xl"
      >
        <p className="mb-4 text-center text-white/80">
          Or click on any message below to select it.
        </p>

        <Card className="bg-white/10 backdrop-blur-md border border-purple-700 rounded-xl">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">Suggested Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-black hover:text-white border-purple-500 hover:bg-purple-600/20 cursor-pointer"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Separator className="my-10 border-purple-700 w-full max-w-3xl" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="text-center"
      >
        <p className="mb-5 text-white font-medium text-lg">
          Want to create your own anonymous message board?
        </p>
        <Link href="/sign-up">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-10 py-3 rounded-lg shadow-lg cursor-pointer">
            Create Your Account
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
