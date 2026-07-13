export default function Loading() {
  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-4 w-24 bg-[#0B1220]/5 rounded mb-12 sm:mb-16" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
          <div className="flex-1 space-y-6">
            <div className="h-3 w-20 bg-[#0B1220]/5 rounded" />
            <div className="h-12 w-3/4 bg-[#0B1220]/5 rounded" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#0B1220]/5" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#0B1220]/5 rounded" />
              <div className="h-4 w-5/6 bg-[#0B1220]/5 rounded" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="aspect-square bg-[#E8E2D9] rounded-xl" />
          </div>
        </div>

        <hr className="border-[#0B1220]/[0.06] mb-10" />
        <div className="h-6 w-40 bg-[#0B1220]/5 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-[#E8E2D9] rounded-xl" />
              <div className="h-4 w-3/4 bg-[#0B1220]/5 rounded" />
              <div className="h-3 w-1/3 bg-[#0B1220]/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
