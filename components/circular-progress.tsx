"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CircularProgressDisplayProps {
  value: number
  size?: number
  strokeWidth?: number
  bgColor?: string
  progressColor?: string
}

export function CircularProgressDisplay({
  value,
  size = 150,
  strokeWidth = 10,
  bgColor = "rgba(0, 0, 0, 0.1)",
  progressColor = "#10b981",
}: CircularProgressDisplayProps) {
  const [progress, setProgress] = useState(0)

  // Calculate circle properties
  const center = size / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    // Animate the progress
    const timer = setTimeout(() => {
      setProgress(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {progress.toFixed(2)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Certainty</span>
      </div>
    </div>
  )
}
