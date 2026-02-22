export default function VillaDetailLoading() {
  return (
    <div className="w-full min-w-0 animate-pulse space-y-6 md:space-y-8">
      {/* Back link */}
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded md:hidden" />
      </div>

      {/* Bento gallery skeleton */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <div className="col-span-2 row-span-2 bg-gray-200" />
        <div className="bg-gray-200" />
        <div className="bg-gray-200" />
      </div>

      {/* Name + price */}
      <div className="space-y-3">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2 bg-white rounded-2xl p-5 border border-gray-100">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
        <div className="h-4 w-4/6 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
