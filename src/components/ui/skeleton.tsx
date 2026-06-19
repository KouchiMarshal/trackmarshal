"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-zinc-200 ${className}`} />
  );
}

export function SkeletonEventCard() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
      <Skeleton className="h-[260px] rounded-none" />
      <div className="p-6 lg:p-8 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-14 w-full mt-4" />
      </div>
    </div>
  );
}

export function SkeletonApplicationCard() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-[240px] rounded-none" />
        <div className="p-6 lg:p-8 space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-14 flex-1" />
            <Skeleton className="h-14 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-12 w-20 mt-6" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
      <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}
