import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { projectId } = body

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid projectId' }, { status: 400 })
  }

  try {
    // Optional: Ensure user owns the project
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user?.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 })
  } catch (err) {
    console.error('Error deleting project:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
