"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { CheckCircle, AlertCircle, Database } from "lucide-react"

export default function DebugDBPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const testResults = []

    // Test 1: Check if users table exists
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      testResults.push({
        test: "Users table exists",
        status: error ? "error" : "success",
        message: error ? error.message : "✅ Users table is accessible",
        details: error ? error : `Found table with ${data?.length || 0} records`,
      })
    } catch (err) {
      testResults.push({
        test: "Users table exists",
        status: "error",
        message: "❌ Users table check failed",
        details: err,
      })
    }

    // Test 2: Check current user session
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      testResults.push({
        test: "Current user session",
        status: error ? "error" : user ? "success" : "warning",
        message: error ? "❌ Session error" : user ? "✅ User is signed in" : "⚠️ No user signed in",
        details: error ? error : user ? `User ID: ${user.id}, Email: ${user.email}` : "No active session",
      })
    } catch (err) {
      testResults.push({
        test: "Current user session",
        status: "error",
        message: "❌ Session check failed",
        details: err,
      })
    }

    // Test 3: Try to create a test user record
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const testUser = {
          id: user.id,
          email: user.email!,
          first_name: "Test",
          last_name: "User",
          provider: "email",
        }

        const { data, error } = await supabase.from("users").upsert([testUser]).select().single()

        testResults.push({
          test: "Create/Update user record",
          status: error ? "error" : "success",
          message: error ? "❌ Failed to create user record" : "✅ User record created/updated",
          details: error ? error : data,
        })
      } else {
        testResults.push({
          test: "Create/Update user record",
          status: "warning",
          message: "⚠️ Skipped - no user signed in",
          details: "Sign in first to test user record creation",
        })
      }
    } catch (err) {
      testResults.push({
        test: "Create/Update user record",
        status: "error",
        message: "❌ User record test failed",
        details: err,
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Database Debug</h1>
          <p className="text-gray-600">Checking database connection and user profile creation</p>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="border-pink-200">
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center text-pink-700">
                  {result.status === "success" && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
                  {result.status === "error" && <AlertCircle className="w-5 h-5 mr-2 text-red-500" />}
                  {result.status === "warning" && <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />}
                  {result.test}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="font-medium mb-2">{result.message}</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={runTests} disabled={loading} className="bg-pink-500 hover:bg-pink-600">
            <Database className="w-4 h-4 mr-2" />
            {loading ? "Running Tests..." : "Run Tests Again"}
          </Button>
        </div>
      </div>
    </div>
  )
}
