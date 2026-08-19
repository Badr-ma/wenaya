/** Specialist Detail Loading State */
export default function Loading() {
  return (
    <div className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 px-6">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-3 w-16 bg-[#0B1220]/5 rounded" />
            <div className="h-3 w-20 bg-[#B88A5A]/10 rounded" />
            <div className="h-12 w-3/4 bg-[#0B1220]/5 rounded" />
            <div className="h-12 w-1/2 bg-[#0B1220]/5 rounded" />
            <div className="h-5 w-64 bg-[#0B1220]/5 rounded mt-4" />
            <div className="h-11 w-48 bg-[#0B1220]/5 rounded-full mt-4" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="aspect-[3/4] max-h-[600px] bg-[#E8E2D9] max-w-md mx-auto lg:mx-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
