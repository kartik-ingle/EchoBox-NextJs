'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/Schemas/signInSchema';
import {ColourfulText} from '@/components/ui/colourful-text';

function SignInPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast('Login Failed',{
          description: 'Incorrect username or password',
          className: "bg-red-500 text-white border border-red-700",
        });
      } else {
        toast('Error', {
          description: result.error,
          className: "bg-red-500 text-white border border-red-700",
        });
      }
    }

    if(result?.url) {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <ColourfulText text="Welcome Back" />
          </h1>
          <p className="text-gray-300 text-sm">Sign in to continue your secret conversations</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email / Username</FormLabel>
                  <Input {...field} className="bg-white/10 text-white border-white/20 focus:ring-2 focus:ring-pink-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <Input type="password" {...field} className="bg-white/10 text-white border-white/20 focus:ring-2 focus:ring-pink-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4 text-gray-300">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-pink-400 hover:text-pink-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage;
