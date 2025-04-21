'use client'

import { useProjectContext } from '@/context/ProjectContext'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Project {
  id: string
  name: string
}

interface SideBarProps {
  projects: Project[]
  onCreateProject: () => void
  onRefreshProjects?: () => void
}

export default function SideBar({ projects, onCreateProject, onRefreshProjects }: SideBarProps) {
  const { setSelectedProjectId } = useProjectContext()
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleDelete = async (projectId: string) => {
    const confirmed = confirm('Are you sure you want to delete this project?')
    if (!confirmed) return

    try {
      const res = await fetch('/api/project/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })

      if (!res.ok) throw new Error('Failed to delete')

      onRefreshProjects?.()
      if (menuOpenId === projectId) setMenuOpenId(null)
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project.')
    }
  }

  return (
    <aside className="w-64 h-full bg-gray-100 p-6">
      <button
        onClick={() => setSelectedProjectId('all')}
        className="cursor-pointer w-full text-left rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition mb-6"
      >
        📋 All Tasks
      </button>

      <div className="mb-4">
        <h2 className="text-md font-semibold text-gray-700 mb-2">Projects</h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="relative">
              <div
                onClick={() => setSelectedProjectId(project.id)}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center"
              >
                <span>{project.name}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpenId(menuOpenId === project.id ? null : project.id)
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {menuOpenId === project.id && (
                <div className="absolute right-2 top-full mt-1 z-10 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
                  >
                    Delete Project
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onCreateProject}
        className="cursor-pointer mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Create New Project
      </button>
    </aside>
  )
}
