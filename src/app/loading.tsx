export default function Loading() {
  return (
    <div className="w-full min-w-0 animate-pulse space-y-6">
      <div className="rounded-xl sm:rounded-2xl bg-gray-200 aspect-[3/4] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9]" />
      <div className="max-w-xl mx-auto h-12 rounded-2xl bg-gray-200" />
      <div className="space-y-3">
        <div className="h-7 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-gray-100 rounded-lg" />
                  <div className="h-12 bg-gray-100 rounded-lg" />
                  <div className="h-12 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
