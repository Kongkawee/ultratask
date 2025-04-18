'use client'

import { TaskStatus } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
}

const mockTasks: Task[] = [
  { id: '1', title: 'Buy groceries', status: 'PENDING' },
  { id: '2', title: 'Work on app', status: 'IN_PROGRESS' },
  { id: '3', title: 'Deploy to Vercel', status: 'DONE' },
  { id: '4', title: 'Plan meeting', status: 'PENDING' },
]

const statusLabels: Record<TaskStatus, string> = {
  PENDING: '🕓 Pending',
  IN_PROGRESS: '🔄 In Progress',
  DONE: '✅ Done',
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    }
  }, [status, router])

  if (status === 'loading') return <p className="p-4">Loading...</p>

  const groupedTasks = {
    PENDING: mockTasks.filter(task => task.status === 'PENDING'),
    IN_PROGRESS: mockTasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: mockTasks.filter(task => task.status === 'DONE'),
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([statusKey, tasks]) => (
          <div key={statusKey} className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">
              {statusLabels[statusKey as TaskStatus]}
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-sm transition"
                >
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500">{task.description}</p>
                  )}
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
