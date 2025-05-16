import { Skeleton } from "./skeleton";

export function SkeletonDemo() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Loading States</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Text Skeleton</h3>
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" lines={3} className="w-3/4" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Card Skeleton</h3>
        <div className="flex space-x-4">
          <div className="space-y-2">
            <Skeleton variant="card" className="w-48 h-32" />
            <Skeleton variant="text" className="w-32" />
            <Skeleton variant="text" className="w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="card" className="w-48 h-32" shimmer={false} />
            <Skeleton variant="text" className="w-32" shimmer={false} />
            <Skeleton variant="text" className="w-24" shimmer={false} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile Skeleton</h3>
        <div className="flex items-center space-x-4">
          <Skeleton variant="circle" className="w-16 h-16" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
