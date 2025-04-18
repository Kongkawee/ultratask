'use client'

import { signOut, useSession } from 'next-auth/react'

export default function NavBar() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">Ultratask</div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          {user.image && (
            <img
              src={user.image}
              alt="User avatar"
              className="w-10 h-10 rounded-full border"
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  )
}
