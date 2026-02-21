export default function VillaDetailLoading() {
  return (
    <div className="w-full min-w-0 animate-pulse space-y-8">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="aspect-[21/9] rounded-2xl bg-gray-200" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-12 bg-blue/20 rounded-xl" />
            <div className="h-12 bg-blue/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
