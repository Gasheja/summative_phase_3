import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

// Mock data - replace with actual database queries
const tasks = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the Q4 project proposal for the new client",
    status: "in-progress",
    priority: "high",
    deadline: "2024-01-15",
    createdAt: "2024-01-01",
    userId: "1",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const body = await request.json()
    const { title, description, status, priority, deadline } = body

    const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === user.id)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title,
      description,
      status,
      priority,
      deadline,
    }

    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === user.id)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks.splice(taskIndex, 1)
    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
