"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TaskCard from "@/components/task-card"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  deadline: string
  createdAt: string
  userId: string
}

interface TaskBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task["status"]) => void
  onDragEnd: (taskId: string, newStatus: Task["status"]) => void
}

export default function TaskBoard({ tasks, onEdit, onDelete, onStatusChange, onDragEnd }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  const columns = [
    { id: "todo", title: "To Do", status: "todo" as const, color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", status: "in-progress" as const, color: "bg-blue-100" },
    { id: "completed", title: "Completed", status: "completed" as const, color: "bg-green-100" },
  ]

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDraggedOver(status)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault()
    if (draggedTask) {
      onDragEnd(draggedTask, newStatus)
      setDraggedTask(null)
      setDraggedOver(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedOver(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status)
        const isDropTarget = draggedOver === column.status

        return (
          <div
            key={column.id}
            className={`min-h-[500px] transition-all duration-200 ${
              isDropTarget ? "ring-2 ring-blue-400 ring-opacity-50" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <Card className={`h-full ${column.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="ml-2">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                    {draggedTask && <p className="text-xs mt-2 text-blue-600">Drop a task here to move it</p>}
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move transition-all duration-200 ${
                        draggedTask === task.id ? "opacity-50 scale-95" : "hover:scale-105"
                      }`}
                    >
                      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
