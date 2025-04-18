'use client'

import { useEffect, useState } from 'react'

export interface Project {
  id: string
  name: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project/get')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    const name = prompt('Enter new project name:')
    if (!name) return

    const res = await fetch('/api/project/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      await fetchProjects()
    } else {
      alert('Failed to create project.')
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, createProject, loading }
}
