'use client';

export default function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        <div className="h-12 bg-gray-800 rounded-lg border border-gray-700"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        <div className="h-12 bg-gray-800 rounded-lg border border-gray-700"></div>
      </div>

      <div className="flex gap-3 mt-8">
        <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
        <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}
