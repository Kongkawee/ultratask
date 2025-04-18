'use client'

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

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
    <main className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Todo App</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage your tasks</p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          onClick={handleSignIn}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
