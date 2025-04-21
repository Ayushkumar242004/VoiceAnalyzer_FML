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
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isGlitching, setIsGlitching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setIsGlitching(true)

    try {
      // Simulate API call with cyberpunk-style glitch effect
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))
      
      // Random glitch effect
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
      }

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        setError("ACCESS DENIED: Invalid credentials")
      }
    } catch (err) {
      setError("SYSTEM ERROR: Authentication failed")
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
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10"></div>
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
        <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
          {/* Card header with cyberpunk styling */}
          <CardHeader className="space-y-1 border-b border-cyan-500/20">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              SYSTEM LOGIN
            </CardTitle>
            <CardDescription className="text-gray-400">
              ENTER CREDENTIALS TO ACCESS SECURE NETWORK
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
                className="h-full w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
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
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-300 font-mono text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@neoncity.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-cyan-300 font-mono text-sm">
                    Password
                  </Label>
                  <Link 
                    href="#" 
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline"
                  >
                    FORGOT Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-cyan-100 placeholder-gray-600 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-sm border-b-2 border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse font-mono">AUTHENTICATING...</span>
                  </span>
                ) : (
                  <span className="font-mono">SUBMIT</span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-xs text-gray-500 font-mono">
              DON"T HAVE AN ACCOUNT •{' '}
              <Link 
                href="/signup" 
                className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
              >
                SIGNUP
              </Link>
            </div>
            
            {/* Fake terminal output */}
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-sm text-xs font-mono text-gray-400">
              <div className="text-cyan-400">$ NETWORK STATUS: ONLINE</div>
              <div className="text-purple-400">$ SECURITY: LEVEL 4</div>
              <div className="text-green-400">$ LAST ACCESS: {new Date().toLocaleTimeString()}</div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}