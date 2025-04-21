'use client'

import './globals.css'
import { ReactNode, useState } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import { useProjects } from '@/hooks/useProjects'
import { ProjectProvider } from '@/context/ProjectContext'

export default function RootLayout({ children }: { children: ReactNode }) {
  const { projects, createProject, loading } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')

  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ProjectProvider>
            <div className="min-h-screen flex flex-col">
              <NavBar />

              <div className="flex flex-1">
                <SideBar
                  projects={projects}
                  onCreateProject={createProject}
                  onSelectProject={setSelectedProjectId}
                />
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                  {typeof children === 'function'
                    ? (children as (props: { selectedProjectId: string }) => ReactNode)({ selectedProjectId })
                    : children}
                </main>
              </div>
            </div>
          </ProjectProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
