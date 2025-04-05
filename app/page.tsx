"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, Upload, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">VoiceAnalyzer</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
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
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Voice-based Gender & Age Prediction
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Upload or record your voice and our AI will predict your gender and age with high accuracy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
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
                <div className="grid w-full items-start gap-8 rounded-lg border bg-card p-8 shadow-lg">
                  <div className="grid gap-2 text-center">
                    <h3 className="text-xl font-bold">Try It Now</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Record your voice or upload an audio file
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <Button className="w-full gap-2" size="lg">
                        <Mic className="h-5 w-5" />
                        Record Voice
                      </Button>
                      <span className="text-sm text-gray-500">or</span>
                      <Button variant="outline" className="w-full gap-2" size="lg">
                        <Upload className="h-5 w-5" />
                        Upload Audio
                      </Button>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      <p>Sign up to save your results and access more features</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our advanced AI model analyzes voice patterns to predict gender and age with high accuracy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <motion.div
                className="grid gap-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
                  <Mic className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Record or Upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Record your voice directly or upload an audio file in supported formats.
                </p>
              </motion.div>
              <motion.div
                className="grid gap-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
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
                    className="text-primary-foreground"
                  >
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                    <line x1="16" x2="2" y1="8" y2="22" />
                    <line x1="17.5" x2="9" y1="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our AI model processes your voice sample and extracts key features.
                </p>
              </motion.div>
              <motion.div
                className="grid gap-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
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
                    className="text-primary-foreground"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Get Results</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive accurate predictions of gender, age, and confidence level.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 VoiceAnalyzer. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

