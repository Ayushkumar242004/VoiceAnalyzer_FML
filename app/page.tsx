"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, Upload, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const colors = {
    primary: "#00FFEA", // Bright cyan
    secondary: "#FF00F5", // Hot pink
    accent: "#00FF7F", // Electric green
    background: "#0A0A14", // Deep dark blue
    cardBg: "#12121D", // Slightly lighter dark blue
    text: "#FFFFFF", // Pure white
    textSecondary: "#B0B0FF", // Light blue
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{
          backgroundImage: `linear-gradient(${colors.primary}20 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }}></div>
      </div>

      {/* Animated neon border */}
      <motion.div 
        className="absolute inset-0 border-2 pointer-events-none"
        style={{
          borderImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.primary}) 1`,
          boxShadow: `0 0 15px ${colors.primary}`
        }}
        animate={{
          boxShadow: [
            `0 0 15px ${colors.primary}`,
            `0 0 25px ${colors.secondary}`,
            `0 0 15px ${colors.primary}`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <header className="border-b border-cyan-400/20 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                VOICE<span className="text-purple-500">SYNTH</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Voice-based Gender & Age Prediction
                  </h1>
                  <p className="max-w-[600px]" style={{ color: colors.textSecondary }}>
                    Upload or record your voice and our AI will predict your gender and age with high accuracy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="gap-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/20"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="mx-auto flex w-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div 
                  className="grid w-full items-start gap-8 rounded-lg border p-8 shadow-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: `${colors.primary}30`,
                    boxShadow: `0 0 20px ${colors.primary}10`
                  }}
                >
                  <div className="grid gap-2 text-center">
                    <h3 className="text-xl font-bold" style={{ color: colors.primary }}>Try It Now</h3>
                    <p style={{ color: colors.textSecondary }}>
                      Record your voice or upload an audio file
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                        style={{
                          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                          boxShadow: `0 0 15px ${colors.primary}80`
                        }}
                      >
                        <Mic className="h-5 w-5" />
                        Record Voice
                      </Button>
                      <span style={{ color: colors.textSecondary }}>or</span>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10" 
                        size="lg"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Audio
                      </Button>
                    </div>
                    <div className="text-center text-sm" style={{ color: colors.textSecondary }}>
                      <p>Sign up to save your results and access more features</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section 
          id="how-it-works" 
          className="w-full py-12 md:py-24 lg:py-32"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  How It Works
                </h2>
                <p className="max-w-[900px]" style={{ color: colors.textSecondary }}>
                  Our advanced AI model analyzes voice patterns to predict gender and age with high accuracy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Mic className="h-10 w-10" />,
                  title: "Record or Upload",
                  description: "Record your voice directly or upload an audio file in supported formats."
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                      <line x1="16" x2="2" y1="8" y2="22" />
                      <line x1="17.5" x2="9" y1="15" y2="15" />
                    </svg>
                  ),
                  title: "AI Analysis",
                  description: "Our AI model processes your voice sample and extracts key features."
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  title: "Get Results",
                  description: "Receive accurate predictions of gender, age, and confidence level."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="grid gap-1 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="flex h-20 w-20 items-center justify-center rounded-full mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: colors.primary }}>{feature.title}</h3>
                  <p style={{ color: colors.textSecondary }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-cyan-400/20 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p style={{ color: colors.textSecondary }}>© 2023 VoiceAnalyzer. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link 
              className="text-sm font-medium hover:underline" 
              href="#"
              style={{ color: colors.textSecondary }}
            >
              Terms of Service
            </Link>
            <Link 
              className="text-sm font-medium hover:underline" 
              href="#"
              style={{ color: colors.textSecondary }}
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}