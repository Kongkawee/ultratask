'use client'

import './globals.css'
import { ReactNode } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import { useProjects } from '@/hooks/useProjects'
import { ProjectProvider } from '@/context/ProjectContext'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: ReactNode }) {
  const { projects, createProject, loading } = useProjects()
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'

  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ProjectProvider>
            {!isAuthPage ? (
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <div className="flex flex-1">
                  <SideBar
                    projects={projects}
                    onCreateProject={createProject}
                  />
                  <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
            ) : (
              children
            )}
          </ProjectProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
