import { Skeleton } from './ui/skeleton'

export function SkeletonPreview() {
  return (
    <div className="h-full w-full flex flex-col space-y-3 p-4">
      <Skeleton className="h-[125px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
  )
}
