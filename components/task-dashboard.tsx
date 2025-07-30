"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  LogOut,
  UserIcon,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskForm from "@/components/task-form"
import TaskCard from "@/components/task-card"
import TaskBoard from "@/components/task-board"

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

interface TaskDashboardProps {
  user: { id: string; name: string; email: string }
}

export default function TaskDashboard({ user }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  // Load tasks from localStorage or use sample data
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${user.id}`)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Sample tasks for new users
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Welcome to TaskFlow!",
          description: "This is a sample task to get you started. You can edit, delete, or mark it as completed.",
          status: "todo",
          priority: "medium",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
        {
          id: "2",
          title: "Create your first task",
          description: "Click the 'Add Task' button to create your own task and start managing your work efficiently.",
          status: "todo",
          priority: "high",
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
        {
          id: "3",
          title: "Review project documentation",
          description: "Go through the project requirements and update the documentation as needed.",
          status: "in-progress",
          priority: "medium",
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
        {
          id: "4",
          title: "Setup development environment",
          description: "Install necessary tools and configure the development environment for the new project.",
          status: "completed",
          priority: "high",
          deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(sampleTasks))
    }
  }, [user.id])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks))
    }
  }, [tasks, user.id])

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    setTasks([...tasks, newTask])
    setShowTaskForm(false)
  }

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (editingTask) {
      const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task))
      setTasks(updatedTasks)
      setEditingTask(null)
      setShowTaskForm(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    setTasks(updatedTasks)
  }

  const handleDragEnd = (taskId: string, newStatus: Task["status"]) => {
    handleStatusChange(taskId, newStatus)
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "completed").length
    const inProgress = tasks.filter((task) => task.status === "in-progress").length
    const todo = tasks.filter((task) => task.status === "todo").length
    const overdue = tasks.filter((task) => {
      const deadline = new Date(task.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return deadline < today && task.status !== "completed"
    }).length

    return { total, completed, inProgress, todo, overdue }
  }

  const handleLogout = async () => {
    // Clear user session
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/login"
  }

  const stats = getTaskStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Task Dashboard!</h2>
          <p className="text-gray-600">
            Manage your tasks efficiently - create, edit, delete, and track your progress. Use the board view to drag
            and drop tasks between columns.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All your tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Tasks finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.todo}</div>
              <p className="text-xs text-muted-foreground">Pending tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowTaskForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "board")} className="mb-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="board" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Board View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            {/* List View */}
            <div className="grid gap-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                        ? "No tasks match your filters"
                        : "No tasks yet"}
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first task"}
                    </p>
                    {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                      <Button onClick={() => setShowTaskForm(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Task
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(task) => {
                      setEditingTask(task)
                      setShowTaskForm(true)
                    }}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-6">
            {/* Board View */}
            <TaskBoard
              tasks={filteredTasks}
              onEdit={(task) => {
                setEditingTask(task)
                setShowTaskForm(true)
              }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onDragEnd={handleDragEnd}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
