export const SkeletonLoader = () => (
  <div className="w-full bg-white rounded-2xl shadow-lg overflow-scroll border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between px-6 py-4 bg-[#c00000] text-white">
      <div className="flex items-center gap-2">
        <div className="w-20 h-4 bg-white/40 rounded"></div>
      </div>
    </div>

    <div className="p-6">
      {/* Image Skeleton */}
      <div className="w-full h-52 bg-gray-200 rounded-xl mb-6"></div>

      {/* Title */}
      <div className="w-3/4 h-6 bg-gray-200 rounded mb-3"></div>
      <div className="w-1/4 h-4 bg-gray-200 rounded mb-5"></div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
        <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Link Box */}
      <div className="w-full h-16 bg-gray-200 rounded-xl mb-6"></div>

      {/* Buttons */}
      <div className="flex justify-end mt-8 gap-3">
        <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);
