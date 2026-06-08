import { cn } from '@/lib/utils'

export function SkeletonCard() {
  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 skeleton" />
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="h-9 skeleton rounded-xl" />
        <div className="flex justify-between items-center">
          <div className="h-6 skeleton rounded-lg w-20" />
          <div className="h-8 skeleton rounded-xl w-24" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonProductDetail() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-96 skeleton rounded-3xl" />
        <div className="flex flex-col gap-4">
          <div className="h-8 skeleton rounded-xl w-3/4" />
          <div className="h-4 skeleton rounded-lg w-1/2" />
          <div className="h-24 skeleton rounded-xl" />
          <div className="h-12 skeleton rounded-xl" />
          <div className="h-12 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonBranchCard() {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="h-5 skeleton rounded-lg w-2/3" />
      <div className="h-4 skeleton rounded-lg w-full" />
      <div className="h-4 skeleton rounded-lg w-3/4" />
      <div className="flex gap-2">
        <div className="h-10 skeleton rounded-xl flex-1" />
        <div className="h-10 skeleton rounded-xl flex-1" />
      </div>
    </div>
  )
}
