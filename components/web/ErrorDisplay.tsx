import React from 'react'

type ErrorDisplayProps = {
  error: Error | null
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h3 className="text-red-800 font-semibold">Error</h3>
      <p className="text-red-700">{error.message}</p>
    </div>
  )
}