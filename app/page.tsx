import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import TaskDashboard from "@/components/task-dashboard"

export default async function HomePage() {
  console.log("HomePage: Checking user authentication...")

  const user = await getUser()

  console.log("HomePage: User check result:", user)

  if (!user) {
    console.log("HomePage: No user found, redirecting to login")
    redirect("/login")
  }

  console.log("HomePage: User authenticated, showing dashboard")
  return <TaskDashboard user={user} />
}
