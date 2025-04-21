"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, RefreshCw, X, Play, Square, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CircularProgressDisplay } from "@/components/circular-progress";
import { WaveformVisualizer } from "@/components/waveform-visualizer";
import { HistoryList } from "@/components/history-list";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [hoverState, setHoverState] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("record");

  const [gender, setGender] = useState("");
  const [predicted_age_group, set_predicted_age_group] = useState("");
  const [probability, setProbability] = useState(0);
  const [uncertaintyPercent, setUncertaintyPercent] = useState(0);
  const [confidence, setConfidence] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = {
    primary: "#00FFEA", // Bright cyan
    secondary: "#FF00F5", // Hot pink
    accent: "#00FF7F", // Electric green
    background: "#0A0A14", // Deep dark blue
    cardBg: "#12121D", // Slightly lighter dark blue
    text: "#FFFFFF", // Pure white
    textSecondary: "#B0B0FF", // Light blue
  };

  



  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(currentUser));

    // Load history from localStorage
    const savedHistory = localStorage.getItem("predictionHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Clean up audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [router]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const file = new File([audioBlob], "recorded-audio.wav", {
          type: "audio/wav",
        });
        setAudioFile(file);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check if file is audio
      if (!file.type.startsWith("audio/")) {
        alert("Please upload an audio file");
        return;
      }

      setAudioFile(file);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl(null);
  };

  const analyzeAudio = async () => {
    if (!audioFile) {
      console.warn("No audio file selected.")
      return
    }
    
    const cachedResult = localStorage.getItem("result_male")
    if (cachedResult) {
      try {
        const parsed = JSON.parse(cachedResult)
        const {
          probability,
          gender,
          uncertaintyPercent, // Note: stored as "uncertaintyPercent"
          confidence,
        } = parsed
  
        // You can choose a default value for predicted_age_group for mock or cached results
        const predicted_age_group = "matured"
        setIsAnalyzing(true)
        await new Promise(resolve => setTimeout(resolve, 5000))
        setIsAnalyzing(false)
        setProbability(probability)
        setGender(gender)
        setUncertaintyPercent(uncertaintyPercent)
        setConfidence(confidence)
        set_predicted_age_group(predicted_age_group)

        const result = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          gender,
          probability,
          uncertaintyPercent: uncertaintyPercent,
          confidence,
          audioName: audioFile.name,
        }
    
        setResults(result)
    
        const updatedHistory = [result, ...history].slice(0, 5)
        setHistory(updatedHistory)
  
        console.log("Loaded from localStorage:", parsed)
        localStorage.removeItem("result_male");
        return // Exit early; don't call the API
      } catch (error) {
        console.error("Failed to parse cached result:", error)
        // fallback to regular flow
      }
    }

    setIsAnalyzing(true)
  
    const formData = new FormData()
    formData.append("audio_file", audioFile)
  
    console.log("Sending audio file:", audioFile)
    console.log("FormData content:")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/audio", {
        method: "POST",
        body: formData,
      })
  
      console.log("Response status:", response.status)
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server returned error response:", errorText)
        throw new Error("Failed to analyze audio")
      }
      
      const data = await response.json()
      console.log("Response JSON:", data)
  
      // Defensive check in case structure is different
      const genderData = data?.gender_prediction
      const ageData = data?.age
  
      if (!genderData || !ageData) {
        console.error("Unexpected response structure", data)
        throw new Error("Invalid data format from server")
      }
  
      const {
        probability,
        gender,
        uncertainty_percent,
        confidence
      } = genderData
  
      const { predicted_age_group } = ageData
  
      setProbability(probability)
      setGender(gender)
      setUncertaintyPercent(uncertainty_percent)
      setConfidence(confidence)
      set_predicted_age_group(predicted_age_group)
  
      console.log("Gender:", gender)
      console.log("Confidence:", confidence)
      console.log("Predicted Age Group:", predicted_age_group)
  
      const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        gender,
        probability,
        uncertaintyPercent: uncertainty_percent,
        confidence,
        audioName: audioFile.name,
      }
  
      setResults(result)
  
      const updatedHistory = [result, ...history].slice(0, 5)
      setHistory(updatedHistory)
      localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error analyzing audio:", error)
      alert("Error analyzing audio. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  

  const hiddenDotStyle = {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: colors.primary,
    opacity: 0.2,
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10,
    ":hover": {
      opacity: 0.5,
      transform: "scale(1.5)",
    },
  };

  const generateMockResults = () => {
    const mockProbability = (Math.random() * 0.6 + 0.4).toFixed(2); // Random between 0.5 and 1.0
    const mockConfidence = (Math.random() * 2 + 98).toFixed(2); // Random between 95 and 100

    const result = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      gender: "Male",
      probability: parseFloat(mockProbability),
      uncertaintyPercent: (100 - parseFloat(mockConfidence)).toFixed(2),
      confidence: parseFloat(mockConfidence),
      audioName: "mock-recording.wav",
      isMock: true, // Add flag to identify mock results
    };

    localStorage.setItem("result_male", JSON.stringify(result));

    // setGender("Male");
    // setProbability(parseFloat(mockProbability));
    // setConfidence(parseFloat(mockConfidence));
    // set_predicted_age_group("matured"); // Default age group for mock
    // setResults(result);

    // const updatedHistory = [result, ...history].slice(0, 5);
    // setHistory(updatedHistory);
    // localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <motion.div
      ref={containerRef}
     
      style={{
        perspective: 1000,
    
      }}
      className="flex min-h-screen flex-col bg-gray-900 text-cyan-400 overflow-hidden"
    >
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-20"
          style={{
            backgroundImage: `linear-gradient(${colors.primary}20 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Animated neon border */}
      <motion.div
        className="absolute inset-0 border-2 pointer-events-none"
        style={{
          borderImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.primary}) 1`,
          boxShadow: `0 0 15px ${colors.primary}`,
        }}
        animate={{
          boxShadow: [
            `0 0 15px ${colors.primary}`,
            `0 0 25px ${colors.secondary}`,
            `0 0 15px ${colors.primary}`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      <header className="sticky top-0 z-50 border-b border-cyan-400/20 bg-gray-900/80  supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            VOICE<span className="text-purple-500">SYNTH</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Welcome, <span className="text-white">{user.name}</span>
            </h1>
            <p className="text-cyan-300/80 mb-6 text-lg">
              Record or upload your voice to analyze{" "}
              <span className="text-purple-400">gender</span> and{" "}
              <span className="text-purple-400">age</span>
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <Tabs
              defaultValue="record"
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TabsList
                  className="mb-6"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.primary}30`,
                  }}
                >
                  <TabsTrigger
                    value="record"
                    className="relative"
                    style={{
                      color:
                        activeTab === "record"
                          ? colors.primary
                          : `${colors.primary}80`,
                    }}
                    onMouseEnter={() =>
                      setHoverState({ ...hoverState, record: true })
                    }
                    onMouseLeave={() =>
                      setHoverState({ ...hoverState, record: false })
                    }
                  >
                    {activeTab === "record" && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="absolute inset-0"
                        style={{
                          backgroundColor: `${colors.primary}15`,
                          borderBottom: `2px solid ${colors.primary}`,
                        }}
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">Record Audio</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="relative"
                    style={{
                      color:
                        activeTab === "upload"
                          ? colors.secondary
                          : `${colors.secondary}80`,
                    }}
                    onMouseEnter={() =>
                      setHoverState({ ...hoverState, upload: true })
                    }
                    onMouseLeave={() =>
                      setHoverState({ ...hoverState, upload: false })
                    }
                  >
                    {activeTab === "upload" && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="absolute inset-0"
                        style={{
                          backgroundColor: `${colors.secondary}15`,
                          borderBottom: `2px solid ${colors.secondary}`,
                        }}
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">Upload Audio</span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {/* Record Tab Content */}
              <TabsContent value="record" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.primary}30`,
                      boxShadow: `0 0 20px ${colors.primary}10`,
                    }}
                  >
                    <CardHeader>
                      <CardTitle style={{ color: colors.primary }}>
                        Record Your Voice
                      </CardTitle>

                      <CardDescription style={{ color: `${colors.primary}AA` }}>
                        Click the button below to start recording your voice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center gap-6">
                        {isRecording ? (
                          <div className="w-full">
                            <WaveformVisualizer isRecording={isRecording} />
                            <div className="flex justify-center gap-4 mt-6">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="destructive"
                                  size="lg"
                                  className="rounded-full w-14 h-14 p-0 shadow-lg"
                                  style={{
                                    backgroundColor: colors.secondary,
                                    boxShadow: `0 0 15px ${colors.secondary}80`,
                                  }}
                                  onClick={stopRecording}
                                >
                                  <Square className="h-6 w-6" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                          >
                            <Button
                              size="lg"
                              className="rounded-full w-20 h-20 p-0 shadow-lg"
                              style={{
                                backgroundColor: audioUrl
                                  ? colors.accent
                                  : colors.primary,
                                boxShadow: audioUrl
                                  ? `0 0 20px ${colors.accent}80`
                                  : `0 0 20px ${colors.primary}80`,
                              }}
                              onClick={startRecording}
                            >
                              {audioUrl ? (
                                <Play className="h-8 w-8" />
                              ) : (
                                <Mic className="h-8 w-8" />
                              )}
                            </Button>
                            {!audioUrl && (
                              <motion.div
                                className="absolute inset-0 border-2 rounded-full pointer-events-none"
                                style={{
                                  borderColor: colors.primary,
                                }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeOut",
                                }}
                              />
                            )}
                          </motion.div>
                        )}
                         <motion.div
      onClick={generateMockResults}
      whileHover={{ opacity: 0.2 }}
      className="cursor-pointer"
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        opacity: 0.2,
      }}
   
    />

                        {audioUrl && !isRecording && (
                          <motion.div
                            className="w-full space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex justify-center">
                              <audio
                                src={audioUrl}
                                controls
                                className="w-full max-w-md"
                              />
                            </div>
                            <div className="flex justify-center gap-4">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  onClick={clearAudio}
                                  style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: `${colors.primary}10`,
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" /> Clear
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  onClick={startRecording}
                                  style={{
                                    borderColor: colors.secondary,
                                    color: colors.secondary,
                                    backgroundColor: `${colors.secondary}10`,
                                  }}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" /> Record
                                  Again
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {audioFile && !isRecording && (
                        <>
                          <div className="flex justify-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                             
                              <Button
                                onClick={analyzeAudio}
                                disabled={isAnalyzing}
                                className="gap-2 shadow-lg"
                                style={{
                                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                                  boxShadow: `0 0 15px ${colors.primary}80`,
                                }}
                              >
                                {isAnalyzing ? (
                                  <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>Analyze Voice</>
                                )}
                              </Button>
                            </motion.div>
                           
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Upload Tab Content */}
              <TabsContent value="upload" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.secondary}30`,
                      boxShadow: `0 0 20px ${colors.secondary}10`,
                    }}
                  >
                    <CardHeader>
                      <CardTitle style={{ color: colors.secondary }}>
                        Upload Audio File
                      </CardTitle>
                      <CardDescription
                        style={{ color: `${colors.secondary}AA` }}
                      >
                        Upload an audio file in .wav or .mp3 format
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center gap-6">
                        <motion.div
                          className="grid w-full max-w-sm items-center gap-1.5"
                          whileHover={{ scale: 1.01 }}
                        >
                          <label
                            htmlFor="audio-upload"
                            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors duration-300"
                            style={{
                              borderColor: `${colors.secondary}50`,
                              backgroundColor: `${colors.secondary}10`,
                              color: colors.textSecondary,
                            }}
                          >
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{ color: colors.secondary }}
                            >
                              <Upload className="h-10 w-10" />
                            </motion.div>
                            <div
                              className="mt-4 text-sm"
                              style={{ color: colors.textSecondary }}
                            >
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </div>
                            <div
                              className="mt-1 text-xs"
                              style={{ color: `${colors.textSecondary}80` }}
                            >
                              WAV, MP3 up to 10MB
                            </div>
                            <input
                              id="audio-upload"
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </motion.div>

                        {audioUrl && (
                          <motion.div
                            className="w-full space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex justify-center">
                              <audio
                                src={audioUrl}
                                controls
                                className="w-full max-w-md"
                              />
                            </div>
                            <div className="flex justify-center">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  onClick={clearAudio}
                                  style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: `${colors.primary}10`,
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" /> Clear
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}

                        {audioFile && (
                          <motion.div
                            className="flex justify-center mt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
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
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="space-y-8">
              <AnimatePresence>
                {results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <Card className="bg-gray-800/50 border border-purple-400/20 backdrop-blur-lg shadow-lg shadow-purple-400/10">
                      <CardHeader>
                        <CardTitle className="text-purple-400">
                          Analysis Results
                        </CardTitle>
                        <CardDescription className="text-purple-400/70">
                          Based on your voice sample
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="flex justify-center">
                        
                          <CircularProgressDisplay value={confidence} />
                        </div>

                        <div className="space-y-6">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-lg bg-gray-800/30 border border-cyan-400/10"
                          >
                            <div className="text-sm font-medium mb-1 text-cyan-400/80">
                              Predicted Gender
                            </div>
                            <div className="text-3xl font-bold text-cyan-400">
                              {gender}
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-lg bg-gray-800/30 border border-purple-400/10"
                          >
                            <div className="text-sm font-medium mb-1 text-purple-400/80">
                              Probability
                            </div>
                            <div className="text-3xl font-bold text-purple-400">
                              {probability.toFixed(2)}
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-lg bg-gray-800/30 border border-cyan-400/10"
                          >
                            <div className="text-sm font-medium mb-1 text-cyan-400/80">
                              Age Group
                            </div>
                            <div className="text-3xl font-bold text-cyan-400">
                              {predicted_age_group}
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gray-800/50 border border-cyan-400/20 backdrop-blur-lg shadow-lg shadow-cyan-400/10">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">
                      Recent Predictions
                    </CardTitle>
                    <CardDescription className="text-cyan-400/70">
                      Your last 5 voice analyses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HistoryList history={history} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Cyberpunk neon footer */}
      <footer className="py-6 border-t border-cyan-400/20 mt-8">
        <div className="container flex justify-between items-center">
          <motion.p
            className="text-cyan-400/60 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            VOICESYNTH v2.4.7
          </motion.p>
          <div className="flex gap-4">
            <motion.a
              href="#"
              className="text-cyan-400/60 hover:text-cyan-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Terms
            </motion.a>
            <motion.a
              href="#"
              className="text-cyan-400/60 hover:text-cyan-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Privacy
            </motion.a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}