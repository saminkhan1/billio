'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error('Error:', error.message)
    }
  }, [error])

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error?.message || 'An unexpected error occurred'}</p>
      <Button
        variant="outline"
        onClick={reset}
      >
        Try again
      </Button>
    </div>
  )
} 