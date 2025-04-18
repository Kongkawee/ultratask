'use client'

import './globals.css'
import { ReactNode } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import { useProjects } from '@/hooks/useProjects'

export default function RootLayout({ children }: { children: ReactNode }) {
  const { projects, createProject, loading } = useProjects()

  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <NavBar />

            {/* Main content area with sidebar + page content */}
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
        </SessionWrapper>
      </body>
    </html>
  )
}
