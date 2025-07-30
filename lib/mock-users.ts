// Shared mock user storage (replace with real database)
export const mockUsers: Array<{ id: string; name: string; email: string; password: string }> = [
  { id: "1", name: "John Doe", email: "john@example.com", password: "password" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password" },
]

export function addUser(user: { id: string; name: string; email: string; password: string }) {
  mockUsers.push(user)
}

export function findUserByEmail(email: string) {
  return mockUsers.find((u) => u.email === email)
}

export function findUserById(id: string) {
  return mockUsers.find((u) => u.id === id)
}
