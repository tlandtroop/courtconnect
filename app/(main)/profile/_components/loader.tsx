import { Skeleton } from "@/components/ui/skeleton";

const ProfileLoader = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <Skeleton className="h-48 w-full" />

        <div className="p-6 relative">
          {/* <Skeleton className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white" /> */}

          <div className="ml-36 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-48 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>

              <Skeleton className="h-5 w-32 rounded mt-2" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-5 w-40 rounded" />
              </div>
            </div>

            <Skeleton className="h-9 w-32 rounded" />
          </div>

          <div className="mt-6 border-t pt-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded mt-2" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <Skeleton className="h-12 w-full" />
          <div className="p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-4 mb-4 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-5 w-16 rounded" />
                    </div>
                    <Skeleton className="h-4 w-40 rounded mt-2" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-4 w-20 rounded mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <Skeleton className="h-6 w-32 rounded mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <Skeleton className="h-6 w-32 rounded mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center mb-3">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <Skeleton className="h-6 w-40 rounded mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded" />
                <div>
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoader;
