'use client'

import { TaskStatus } from '@prisma/client'
import { useState } from 'react'

type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
}

interface TaskDetailModalProps {
  task: Task | null
  onClose: () => void
  onTaskUpdated?: () => void
  onChangeStatus?: (taskId: string) => void
  onDelete?: (taskId: string) => void
}


const statusLabel: Record<TaskStatus, string> = {
  PENDING: '🕓 Pending',
  IN_PROGRESS: '🔄 In Progress',
  DONE: '✅ Done',
}

const allStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE']

export default function TaskDetailModal({
  task,
  onClose,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [newStatus, setNewStatus] = useState<TaskStatus | null>(null)

  if (!task) return null

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === task.status) return

    try {
      setLoading(true)
      const res = await fetch('/api/task/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      onClose()
      onTaskUpdated?.()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update task status.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this task?')
    if (!confirmDelete) return

    try {
      setLoading(true)
      const res = await fetch('/api/task/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id }),
      })

      if (!res.ok) throw new Error('Failed to delete task')

      onClose()
      onTaskUpdated?.()
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-2">{task.title}</h2>

        {task.description && (
          <div className="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50 text-gray-700 text-sm">
            {task.description}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Status: <span className="text-blue-600 font-medium">{statusLabel[task.status]}</span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Status
          </label>
          <select
            disabled={loading}
            className="w-full border rounded-md px-3 py-2"
            value={newStatus ?? ''}
            onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
          >
            <option value="" disabled>
              Select new status
            </option>
            {allStatuses
              .filter((status) => status !== task.status)
              .map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleStatusChange}
            disabled={!newStatus || loading}
            className="px-4 py-2 rounded-md text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-50"
          >
            Update Status
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  )
}
