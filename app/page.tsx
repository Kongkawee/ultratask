'use client'

import { TaskStatus } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectContext } from '@/context/ProjectContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import TaskDetailModal from '@/components/TaskDetailModal'

type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
}

type Project = {
  id: string
  name: string
}

const statusLabels: Record<TaskStatus, string> = {
  PENDING: '🕓 Pending',
  IN_PROGRESS: '🔄 In Progress',
  DONE: '✅ Done',
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { selectedProjectId } = useProjectContext()

  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [projectName, setProjectName] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    }
  }, [status, router])

  const fetchTasks = async () => {
    if (!selectedProjectId || status !== 'authenticated') return

    try {
      setLoading(true)

      const taskRes = await fetch('/api/task/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: selectedProjectId }),
      })

      const taskData = await taskRes.json()
      setTasks(taskData.tasks || [])

      if (selectedProjectId === 'all') {
        setProjectName('All')
      } else {
        const project = await fetch(`/api/project/get`)
          .then(res => res.json())
          .then(data => data.projects.find((p: Project) => p.id === selectedProjectId))

        setProjectName(project?.name || 'Unknown')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setProjectName('Unknown')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [selectedProjectId, status])

  const handleCreateTask = async () => {
    const title = prompt('Enter task title:')
    if (!title) return

    const description = prompt('Enter description (optional):')

    try {
      const res = await fetch('/api/task/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          project: selectedProjectId,
        }),
      })

      if (!res.ok) throw new Error('Failed to create task')

      await fetchTasks()
    } catch (err) {
      console.error('Error creating task:', err)
      alert('Failed to create task.')
    }
  }

  if (status === 'loading' || loading) {
    return <LoadingSpinner />
  }

  const groupedTasks = {
    PENDING: tasks.filter(task => task.status === 'PENDING'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE'),
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {projectName} Tasks
        </h1>
        {selectedProjectId !== 'all' && (
          <button
            onClick={handleCreateTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([statusKey, taskList]) => (
          <div key={statusKey} className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">
              {statusLabels[statusKey as TaskStatus]}
            </h2>

            <TaskDetailModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onChangeStatus={(id) => console.log('Change status', id)}
              onDelete={(id) => console.log('Delete task', id)}
            />

            <div className="space-y-3">
              {taskList.map(task => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-sm transition"
                >
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500">{task.description}</p>
                  )}
                </div>
              ))}
              {taskList.length === 0 && (
                <p className="text-sm text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
