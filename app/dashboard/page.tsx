"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Upload, RefreshCw, X, Play, Square, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { CircularProgressDisplay } from "@/components/circular-progress"
import { WaveformVisualizer } from "@/components/waveform-visualizer"
import { HistoryList } from "@/components/history-list"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(currentUser))

    // Load history from localStorage
    const savedHistory = localStorage.getItem("predictionHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    // Clean up audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [router])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const file = new File([audioBlob], "recorded-audio.wav", { type: "audio/wav" })
        setAudioFile(file)

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      // Check if file is audio
      if (!file.type.startsWith("audio/")) {
        alert("Please upload an audio file")
        return
      }

      setAudioFile(file)

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }

      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    }
  }

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setAudioUrl(null)
  }

  const analyzeAudio = () => {
    if (!audioFile) return

    setIsAnalyzing(true)

    // Simulate API call with random results
    setTimeout(() => {
      const genders = ["Male", "Female"]
      const randomGender = genders[Math.floor(Math.random() * genders.length)]
      const randomAge = Math.floor(Math.random() * 50) + 15 // Age between 15-65
      const randomCertainty = Math.floor(Math.random() * 30) + 70 // Certainty between 70-100%

      const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        gender: randomGender,
        age: randomAge,
        certainty: randomCertainty,
        audioName: audioFile.name,
      }

      setResults(result)

      // Add to history (max 5 items)
      const updatedHistory = [result, ...history].slice(0, 5)
      setHistory(updatedHistory)
      localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory))

      setIsAnalyzing(false)
    }, 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-bold">VoiceAnalyzer</div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mb-6">Record or upload your voice to analyze gender and age</p>

          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="record">Record Audio</TabsTrigger>
                <TabsTrigger value="upload">Upload Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="record" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Record Your Voice</CardTitle>
                    <CardDescription>Click the button below to start recording your voice</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      {isRecording ? (
                        <div className="w-full">
                          <WaveformVisualizer isRecording={isRecording} />
                          <div className="flex justify-center gap-2 mt-4">
                            <Button
                              variant="destructive"
                              size="lg"
                              className="rounded-full w-12 h-12 p-0"
                              onClick={stopRecording}
                            >
                              <Square className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="lg"
                          className={`rounded-full w-16 h-16 p-0 ${audioUrl ? "bg-green-600 hover:bg-green-700" : ""}`}
                          onClick={startRecording}
                        >
                          {audioUrl ? <Play className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </Button>
                      )}

                      {audioUrl && !isRecording && (
                        <div className="w-full space-y-4">
                          <div className="flex justify-center">
                            <audio src={audioUrl} controls className="w-full max-w-md" />
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={clearAudio}>
                              <X className="mr-2 h-4 w-4" /> Clear
                            </Button>
                            <Button variant="outline" onClick={startRecording}>
                              <RefreshCw className="mr-2 h-4 w-4" /> Record Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {audioFile && !isRecording && (
                      <div className="flex justify-center mt-4">
                        <Button onClick={analyzeAudio} disabled={isAnalyzing} className="gap-2">
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>Analyze Voice</>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Audio File</CardTitle>
                    <CardDescription>Upload an audio file in .wav or .mp3 format</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label
                          htmlFor="audio-upload"
                          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center dark:border-gray-600 dark:bg-gray-900"
                        >
                          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">WAV, MP3 up to 10MB</div>
                          <input
                            id="audio-upload"
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>

                      {audioUrl && (
                        <div className="w-full space-y-4">
                          <div className="flex justify-center">
                            <audio src={audioUrl} controls className="w-full max-w-md" />
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={clearAudio}>
                              <X className="mr-2 h-4 w-4" /> Clear
                            </Button>
                          </div>
                        </div>
                      )}

                      {audioFile && (
                        <div className="flex justify-center mt-4">
                          <Button onClick={analyzeAudio} disabled={isAnalyzing} className="gap-2">
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>Analyze Voice</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="space-y-6">
              <AnimatePresence>
                {results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Analysis Results</CardTitle>
                        <CardDescription>Based on your voice sample</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex justify-center">
                          <CircularProgressDisplay value={results.certainty} />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Predicted Gender</div>
                            <div className="text-2xl font-bold">{results.gender}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">Estimated Age</div>
                            <div className="text-2xl font-bold">{results.age} years</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">Certainty</div>
                            <div className="flex items-center gap-2">
                              <Progress value={results.certainty} className="h-2" />
                              <span className="text-sm font-medium">{results.certainty}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                  <CardDescription>Your last 5 voice analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <HistoryList history={history} />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

