import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { taskId } = body

  if (!taskId || typeof taskId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid taskId' }, { status: 400 })
  }

  try {
    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}