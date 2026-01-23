import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delivery Rates Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Types Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Restaurants Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  <div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-1 h-6">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex-1 rounded bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}