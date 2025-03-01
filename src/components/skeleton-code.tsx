import { Skeleton } from './ui/skeleton'

export function SkeletonCode() {
  return (
    <div className="h-full w-full">
      <div className="w-full space-y-2 p-4">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[65%]" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[40%]" />
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-4 w-[60%]" />
        <Skeleton className="h-4 w-[45%]" />
      </div>
    </div>
  )
}
