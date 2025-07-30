"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)
  const router = useRouter()

  // Check if user just registered - only run once
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const registered = urlParams.get("registered")

    if (registered === "true") {
      setShowRegistrationSuccess(true)

      // Try to get registered user data from sessionStorage
      try {
        const registeredUser = sessionStorage.getItem("registeredUser")
        if (registeredUser) {
          const userData = JSON.parse(registeredUser)
          setFormData((prev) => ({
            ...prev,
            email: userData.email,
          }))
        }
      } catch (error) {
        // Handle JSON parse error silently
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      console.log("Attempting login with:", { email: formData.email })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()
      console.log("Login response:", result)

      if (response.ok && result.success) {
        // Clear any stored registration data
        try {
          sessionStorage.removeItem("registeredUser")
        } catch (error) {
          // Handle sessionStorage error silently
        }

        console.log("Login successful, redirecting to dashboard...")

        // Force a page reload to ensure cookies are properly set
        window.location.href = "/"
      } else {
        setErrors({ general: result.error || "Invalid email or password" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field] || errors.general) {
      setErrors({})
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In to TaskFlow</CardTitle>
        {showRegistrationSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            ✅ Account created successfully! Please sign in with your credentials to access your dashboard.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{errors.general}</div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">{"Don't have an account? "}</span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">Demo accounts:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>📧 john@example.com / 🔑 password</div>
              <div>📧 jane@example.com / 🔑 password</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
