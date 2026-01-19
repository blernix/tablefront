'use client';

interface LoadingSkeletonProps {
  type?: 'page' | 'table' | 'cards' | 'dashboard';
  rows?: number;
}

const LoadingSkeleton = ({ type = 'page', rows = 3 }: LoadingSkeletonProps) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-lg" />
          ))}
        </div>

        {/* Main Content */}
        <div className="h-96 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Table Header */}
        <div className="h-12 bg-slate-200 rounded-lg" />

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-48 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-20 bg-slate-200 rounded-lg" />

      {/* Content Blocks */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-32 bg-slate-200 rounded-lg" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
