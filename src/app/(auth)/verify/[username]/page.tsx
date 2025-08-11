'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/Schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'
import * as z from 'zod'

import { Lock } from 'lucide-react'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
        
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast('Success', {
                description: response.data.message
            })

            setTimeout(() => {
                router.replace('/sign-in')
            }, 1500)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            
            toast("Signup failed", {
                description: axiosError.response?.data.message,
                style: {
                  backgroundColor: "#fef2f2", // light red background
                  color: "#b91c1c",           // dark red text
                },
            });
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-purple-900 via-pink-800 to-red-700 p-6">
      <div className="w-full max-w-md p-12 space-y-10 bg-white bg-opacity-20 rounded-3xl shadow-[0_15px_30px_rgba(255,105,180,0.3)] backdrop-blur-xl border border-pink-400/50 hover:shadow-[0_25px_50px_rgba(255,105,180,0.6)] transition-shadow duration-500">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-700 mb-4 animate-gradient-x">
            Verify Your Account
          </h1>
          <p className="text-gray-600 text-lg font-medium mb-8 drop-shadow-md">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className="absolute left-12 top-2 text-pink-300 text-sm font-semibold pointer-events-none transform origin-left transition-all duration-300 
                    peer-placeholder-shown:top-6 peer-placeholder-shown:left-14 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                  >
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                        <Lock size={20} />
                      </span>
                      <Input
                        placeholder=" " // Trick for floating label
                        {...field}
                        className="peer text-gray-900 bg-gradient-to-r from-pink-50 to-purple-50 focus:bg-white focus:ring-pink-500 focus:border-pink-600 rounded-xl border border-pink-300 shadow-md pl-10 transition-all duration-300"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 mt-2" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 via-pink-700 to-purple-700 hover:from-pink-700 hover:via-pink-800 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-pink-500/80 transition-all duration-300"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>

      {/* Extra CSS for animation */}
      <style jsx>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}

export default VerifyAccount