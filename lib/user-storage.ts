// Simple in-memory storage for demo purposes
// In a real app, this would be a database
const registeredUsers: Array<{ id: string; name: string; email: string; password: string }> = [
  { id: "1", name: "John Doe", email: "john@example.com", password: "password" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password" },
]

export function addUser(user: { id: string; name: string; email: string; password: string }) {
  // Check if user already exists
  const existingUser = registeredUsers.find((u) => u.email === user.email)
  if (existingUser) {
    throw new Error("User already exists")
  }
  registeredUsers.push(user)
}

export function findUserByEmail(email: string) {
  return registeredUsers.find((u) => u.email === email)
}

export function getAllUsers() {
  return registeredUsers
}
