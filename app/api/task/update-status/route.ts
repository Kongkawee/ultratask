import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { PrismaClient, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { taskId, newStatus } = body

  if (!taskId || !newStatus) {
    return NextResponse.json({ error: 'Missing taskId or newStatus' }, { status: 400 })
  }

  if (!Object.values(TaskStatus).includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    })

    return NextResponse.json({ task: updatedTask }, { status: 200 })
  } catch (error) {
    console.error('Error updating task status:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}