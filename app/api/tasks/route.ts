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

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userTasks = tasks.filter((task) => task.userId === user.id)
    return NextResponse.json(userTasks)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, priority, deadline } = body

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status,
      priority,
      deadline,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }

    tasks.push(newTask)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
