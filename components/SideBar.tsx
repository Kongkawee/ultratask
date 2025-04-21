'use client'

import { useProjectContext } from '@/context/ProjectContext'

interface Project {
  id: string
  name: string
}

interface SideBarProps {
  projects: Project[]
  onCreateProject: () => void
}

export default function SideBar({ projects, onCreateProject }: SideBarProps) {
  const { setSelectedProjectId } = useProjectContext()

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
            <li
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {project.name}
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
