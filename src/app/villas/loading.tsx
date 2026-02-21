export default function VillasLoading() {
  return (
    <div className="w-full min-w-0 animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-80 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
    </div>
  );
}
