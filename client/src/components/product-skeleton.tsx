export default function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <div className="absolute top-2 left-2 bg-gray-300 rounded-full w-16 h-6"></div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}