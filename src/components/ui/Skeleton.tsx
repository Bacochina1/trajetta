'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/[0.06] border border-white/[0.04]', className)}
      {...props}
    />
  );
}

export function TodayViewSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 animate-pulse">
      {/* Editorial Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-8 w-64 mt-2" />
          <Skeleton className="h-4 w-80 mt-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Daily Progress Tracker Skeleton */}
      <div className="trajetta-card p-5 border border-white/8 bg-[#171A1D]/80 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="flex justify-between text-xs">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Habits & Daily Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="trajetta-card p-5 border border-white/8 bg-[#171A1D]/80 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-44" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="w-5 h-5 rounded-md flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Journey & AI Reflection */}
        <div className="lg:col-span-5 space-y-5">
          <div className="trajetta-card p-5 border border-white/8 bg-[#171A1D]/80 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl mt-3" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="trajetta-card p-5 border border-white/8 bg-[#171A1D]/80 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex justify-end">
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
