import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Email is invalid" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Check if user already exists by looking at existing registered users
    const existingUsersCookie = cookieStore.get("registeredUsers")
    let existingUsers: Array<{ id: string; name: string; email: string; password: string }> = []

    if (existingUsersCookie) {
      try {
        existingUsers = JSON.parse(existingUsersCookie.value)
      } catch {
        existingUsers = []
      }
    }

    // Check if email already exists
    const userExists = existingUsers.some((user) => user.email === email)
    if (userExists) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    // Add to existing users
    existingUsers.push(newUser)

    // Store updated users list in cookie
    cookieStore.set("registeredUsers", JSON.stringify(existingUsers), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Please sign in with your credentials.",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
