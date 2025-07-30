"use server"

import { login, register } from "./auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await login(email, password)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!name.trim()) {
    return { success: false, error: "Name is required" }
  }

  if (!email.trim()) {
    return { success: false, error: "Email is required" }
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: "Email is invalid" }
  }

  if (!password) {
    return { success: false, error: "Password is required" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  try {
    await register(name, email, password)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}
