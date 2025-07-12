"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Users, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
}

export default function TestSupabasePage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "pending", message: "Testing..." },
    { name: "Users Table", status: "pending", message: "Testing..." },
    { name: "Bookings Table", status: "pending", message: "Testing..." },
    { name: "Reviews Table", status: "pending", message: "Testing..." },
    { name: "Authentication", status: "pending", message: "Testing..." },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, status: "success" | "error", message: string) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)

    // Test 1: Database Connection
    try {
      const { data, error } = await supabase.from("users").select("count", { count: "exact", head: true })
      if (error) throw error
      updateTest(0, "success", "✅ Connected successfully")
    } catch (error) {
      updateTest(0, "error", `❌ ${error instanceof Error ? error.message : "Connection failed"}`)
    }

    // Test 2: Users Table
    try {
      const { data, error } = await supabase.from("users").select("*").limit(1)
      if (error) throw error
      updateTest(1, "success", `✅ Table exists (${data?.length || 0} records)`)
    } catch (error) {
      updateTest(1, "error", `❌ ${error instanceof Error ? error.message : "Table access failed"}`)
    }

    // Test 3: Bookings Table
    try {
      const { data, error } = await supabase.from("bookings").select("*").limit(1)
      if (error) throw error
      updateTest(2, "success", `✅ Table exists (${data?.length || 0} records)`)
    } catch (error) {
      updateTest(2, "error", `❌ ${error instanceof Error ? error.message : "Table access failed"}`)
    }

    // Test 4: Reviews Table
    try {
      const { data, error } = await supabase.from("reviews").select("*").limit(1)
      if (error) throw error
      updateTest(3, "success", `✅ Table exists (${data?.length || 0} records)`)
    } catch (error) {
      updateTest(3, "error", `❌ ${error instanceof Error ? error.message : "Table access failed"}`)
    }

    // Test 5: Authentication
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      updateTest(4, "success", `✅ Auth working (${data.session ? "Signed in" : "Not signed in"})`)
    } catch (error) {
      updateTest(4, "error", `❌ ${error instanceof Error ? error.message : "Auth failed"}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Supabase Integration Test</h1>
          <p className="text-gray-600">Testing database connection and table setup</p>
        </div>

        <Card className="border-pink-200 mb-8">
          <CardHeader className="bg-pink-50">
            <CardTitle className="flex items-center text-pink-700">
              <Database className="w-5 h-5 mr-2" />
              Database Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{test.message}</span>
                </div>
              ))}
            </div>

            <Button onClick={runTests} disabled={isRunning} className="w-full bg-pink-500 hover:bg-pink-600">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <Users className="w-5 h-5 mr-2" />
                Environment Check
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Supabase URL:</span>
                  <span className="text-sm text-gray-600">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Supabase Key:</span>
                  <span className="text-sm text-gray-600">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Database URL:</span>
                  <span className="text-sm text-gray-600">{process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <Calendar className="w-5 h-5 mr-2" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-pink-500">1.</span>
                  <span>Ensure all environment variables are set correctly</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-500">2.</span>
                  <span>Run the SQL script in Supabase dashboard</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-500">3.</span>
                  <span>Test user registration and booking flow</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-500">4.</span>
                  <span>Configure authentication providers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {tests.some((test) => test.status === "error") && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Setup Required:</strong> Some tests failed. Please check your Supabase configuration:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Verify your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env</li>
                <li>Run the SQL script in your Supabase dashboard to create tables</li>
                <li>Check that Row Level Security policies are enabled</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {tests.every((test) => test.status === "success") && (
          <Alert className="mt-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>All tests passed!</strong> Your Supabase integration is working correctly. You can now:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Test user registration at /auth</li>
                <li>Create bookings at /booking</li>
                <li>View the account dashboard at /account</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
