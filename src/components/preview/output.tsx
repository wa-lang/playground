import type { FC } from 'react'

export const OutputPreview: FC<{ output: string }> = ({ output }) => {
  return (
    <pre className="h-full w-full p-4 text-xs overflow-auto">
      {output || 'No output'}
    </pre>
  )
}
