'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { acceptMessagesSchema } from "@/Schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Session } from "next-auth";



interface UserDashboardProps {
  initialSession: Session | null;
}

function UserDashboard({ initialSession }: UserDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  

    const {data: session, status} = useSession()
    console.log('Session user:', session?.user);

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)    
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  useEffect(() => {

  if (status === "authenticated") {
    if (!session?.user) {
      console.warn("User session is missing user/email");
    }
  }
}, [status, session]);

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        style: {
          backgroundColor: "#fef2f2", // light red background
          color: "#b91c1c",           // dark red text
        },
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh) {
        toast("Refreshed Messages", {
          description: "Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        style: {
          backgroundColor: "#fef2f2", // light red background
          color: "#b91c1c",           // dark red text
        },
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return 
    fetchMessages() 
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        style: {
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
        },
      })
    }
  }

  if (status === "loading") {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-pink-500" />
      <span className="ml-2 text-pink-500">Loading dashboard...</span>
    </div>
  );
}

  if(!session) {
    return <div className="flex items-center justify-center min-h-screen text-gray-300 bg-gray-900">Please Login</div>
  }

    const username = session?.user?.username || "unknown"

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("URL copied", {
      description: "Profile url has been copied to clipboard"
    })
  }

  return (
    <div className="flex mt-16 flex-col md:flex-row min-h-screen bg-gray-900 text-gray-300 select-none">
      {/* Sidebar */}
      <aside className="w-full pt-16 md:w-100 bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">User Dashboard</h1>
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Your Unique Link</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              readOnly
              className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-pink-300 cursor-pointer select-all focus:outline-none focus:ring-2 focus:ring-pink-500"
              onClick={copyToClipboard}
            />
            <Button onClick={copyToClipboard} className="whitespace-nowrap cursor-pointer font-extrabold" variant="secondary">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="bg-pink-600 checked:bg-pink-500 cursor-pointer"
          />
          <span className="font-medium">
            Accept Messages:{" "}
            <span className={acceptMessages ? "text-green-400" : "text-red-500"}>
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>

        <Separator className="my-4 border-gray-700" />

        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="w-full mb-4 border-pink-600 text-pink-500 hover:bg-pink-600/30 hover:text-white cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-5 w-5 mr-2" />
          )}
          Refresh Messages
        </Button>

      </aside>

      {/* Main Content - Messages */}
      <main className="flex-1 pt-16 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-transparent">
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No messages to display.
          </p>
        )}
      </main>
    </div>
  )
}

export default UserDashboard

