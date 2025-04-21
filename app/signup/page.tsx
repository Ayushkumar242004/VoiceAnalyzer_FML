"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setIsGlitching(true)

    if (password !== confirmPassword) {
      setError("SECURITY PROTOCOL VIOLATION: Key mismatch")
      setIsLoading(false)
      setIsGlitching(false)
      return
    }

    try {
      // Simulate API call with cyberpunk-style glitch effect
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700))
      
      // Random glitch effect
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = users.some((user: any) => user.email === email)

      if (userExists) {
        setError("USER PROFILE CONFLICT: Identity already registered")
      } else {
        // Add new user
        const newUser = { id: Date.now(), name, email, password }
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(newUser))

        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (err) {
      setError("SYSTEM FAILURE: Registration sequence aborted")
    } finally {
      setIsLoading(false)
      setIsGlitching(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Cyberpunk grid background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-cyan-500/10"></div>
      </div>
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay"></div>
      
      {/* Animated glitch effect */}
      {isGlitching && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 pointer-events-none bg-[url('/glitch-effect.png')] mix-blend-lighten"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-sm shadow-lg shadow-purple-500/20">
          {/* Card header with cyberpunk styling */}
          <CardHeader className="space-y-1 border-b border-purple-500/20">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
              NEW USER REGISTRATION
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono text-sm">
              ENTER BIOMETRICS FOR SYSTEM ACCESS
            </CardDescription>
            
            {/* Animated status bar */}
            <div className="h-1 mt-2 bg-gray-800 overflow-hidden">
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
                className="h-full w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              />
            </div>
          </CardHeader>
          
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-900 bg-red-950/80">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="font-mono text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-900 bg-green-950/80">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <AlertDescription className="font-mono text-green-400">
                    PROFILE SYNTHESIS COMPLETE! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-300 font-mono text-sm">
                 FULLNAME
                </Label>
                <Input
                  id="name"
                  placeholder="NEO-USER-007"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-300 font-mono text-sm">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@neon-grid.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-300 font-mono text-sm">
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-purple-300 font-mono text-sm">
                  CONFIRM PASSWORD
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-sm border-b-2 border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse font-mono">GENERATING PROFILE...</span>
                  </span>
                ) : (
                  <span className="font-mono">SUBMIT</span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-xs text-gray-500 font-mono">
              EXISTING USER?{' '}
              <Link 
                href="/login" 
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                LOGIN
              </Link>
            </div>
            
            {/* Fake system diagnostics */}
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-sm text-xs font-mono text-gray-400">
              <div className="text-purple-400">$ SECURITY: LEVEL 5 REQUIRED</div>
              <div className="text-cyan-400">$ DATABASE: NEON-CORE</div>
              <div className="text-green-400">$ ENCRYPTION: AES-256 ACTIVATED</div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}