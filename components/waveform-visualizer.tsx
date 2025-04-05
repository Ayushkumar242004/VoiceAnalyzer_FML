"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WaveformVisualizerProps {
  isRecording: boolean
}

export function WaveformVisualizer({ isRecording }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    let audioContext: AudioContext
    let analyser: AnalyserNode
    let dataArray: Uint8Array
    let source: MediaStreamAudioSourceNode

    const initializeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256

        const bufferLength = analyser.frequencyBinCount
        dataArray = new Uint8Array(bufferLength)

        source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        renderFrame()
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    const renderFrame = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, width, height)

      const barWidth = (width / dataArray.length) * 2.5
      let x = 0

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height

        // Use a gradient for the bars
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
        gradient.addColorStop(0, "#10b981")
        gradient.addColorStop(1, "#34d399")

        ctx.fillStyle = gradient
        ctx.fillRect(x, height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      animationRef.current = requestAnimationFrame(renderFrame)
    }

    initializeAudio()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRecording])

  return (
    <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
      <canvas ref={canvasRef} width={500} height={128} className="w-full h-full" />

      {isRecording && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
          <span className="text-xs font-medium">Recording...</span>
        </div>
      )}
    </div>
  )
}

