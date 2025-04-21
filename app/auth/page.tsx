'use client'

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) {
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <main className="relative h-screen w-full">
      <Image
        src="https://as1.ftcdn.net/jpg/04/89/25/74/1000_F_489257420_fTAJufBIUD9WXdGY6venyyNeRDfcgrSM.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10" />

      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-80 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">
            Welcome to <span className="text-blue-400">Ultratask</span>
          </h1>
            <p className="text-sm text-gray-500 mb-6">
              Sign in to manage your tasks with
              <br />
              <span className="font-semibold text-blue-500">Ultra speed ⚡️</span>
            </p>
          

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition"
          >
            <Image src="/google_logo.png" alt="Google" width={38} height={38} className="h-auto" />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>
        </div>
      </div>
    </main>
  )
}
