import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock authentication - replace with real authentication
interface User {
  id: string
  name: string
  email: string
}

interface UserWithPassword extends User {
  password: string
}

// Get users from localStorage (browser-side storage)
function getStoredUsers(): UserWithPassword[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("mockUsers")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save users to localStorage
function saveUsers(users: UserWithPassword[]) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("mockUsers", JSON.stringify(users))
  } catch {
    // Handle storage errors silently
  }
}

// Initialize with default users
function initializeUsers() {
  const stored = getStoredUsers()
  if (stored.length === 0) {
    const defaultUsers: UserWithPassword[] = [
      { id: "1", name: "John Doe", email: "john@example.com", password: "password" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password" },
    ]
    saveUsers(defaultUsers)
    return defaultUsers
  }
  return stored
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    console.log("Getting user from cookie:", userCookie?.value)

    if (userCookie && userCookie.value) {
      const user = JSON.parse(userCookie.value)
      console.log("User found:", user)
      return user
    }

    console.log("No user cookie found")
    return null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  // This is a server-side function, so we can't access localStorage directly
  // We'll handle user lookup in the API routes instead
  return null
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("user")
    cookieStore.delete("registeredUsers")
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/login")
}

export async function login(email: string, password: string): Promise<void> {
  const cookieStore = await cookies()

  // Check if user was registered in this session
  const userCredentialsCookie = cookieStore.get("userCredentials")
  let registeredUser = null

  if (userCredentialsCookie) {
    try {
      registeredUser = JSON.parse(userCredentialsCookie.value)
    } catch {
      // Invalid cookie data
    }
  }

  let user = null

  // First check if it's the registered user
  if (registeredUser && registeredUser.email === email && registeredUser.password === password) {
    user = registeredUser
  } else {
    // Check default users
    const defaultUsers = [
      { id: "1", name: "John Doe", email: "john@example.com", password: "password" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password" },
    ]
    user = defaultUsers.find((u) => u.email === email && u.password === password)
  }

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Set cookie (don't include password in cookie)
  const userForCookie = { id: user.id, name: user.name, email: user.email }
  cookieStore.set("user", JSON.stringify(userForCookie), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  redirect("/")
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const cookieStore = await cookies()

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  }

  // Set cookie (don't include password in cookie)
  const userForCookie = { id: newUser.id, name: newUser.name, email: newUser.email }
  cookieStore.set("user", JSON.stringify(userForCookie), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Also store user credentials for login (in a real app, this would be in a database)
  cookieStore.set("userCredentials", JSON.stringify(newUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  redirect("/")
}
