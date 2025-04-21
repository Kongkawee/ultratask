'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type ProjectContextType = {
  selectedProjectId: string
  setSelectedProjectId: (id: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider')
  }
  return context
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')

  return (
    <ProjectContext.Provider value={{ selectedProjectId, setSelectedProjectId }}>
      {children}
    </ProjectContext.Provider>
  )
}
