"use client"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"

interface HistoryItem {
  id: number
  timestamp: string
  gender: string
  age: number
  certainty: number
  audioName: string
}

interface HistoryListProps {
  history: HistoryItem[]
}

export function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No prediction history yet</div>
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id} className="p-3 text-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">
                {item.gender}, {item.age} years
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
            <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {item.certainty}%
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

