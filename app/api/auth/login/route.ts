import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Default users for testing
const defaultUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", password: "password" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Get registered users from cookie
    const registeredUsersCookie = cookieStore.get("registeredUsers")
    let registeredUsers: Array<{ id: string; name: string; email: string; password: string }> = []

    if (registeredUsersCookie) {
      try {
        registeredUsers = JSON.parse(registeredUsersCookie.value)
        console.log("Found registered users:", registeredUsers.length)
      } catch {
        registeredUsers = []
      }
    }

    // Combine default users and registered users
    const allUsers = [...defaultUsers, ...registeredUsers]
    console.log("Total users available:", allUsers.length)

    // Find user by email and password
    const user = allUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      console.log("User not found or invalid credentials")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("User authenticated:", user.name)

    // Set user session cookie (don't include password)
    const userForCookie = { id: user.id, name: user.name, email: user.email }

    cookieStore.set("user", JSON.stringify(userForCookie), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("User cookie set successfully")

    return NextResponse.json({ success: true, user: userForCookie })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
