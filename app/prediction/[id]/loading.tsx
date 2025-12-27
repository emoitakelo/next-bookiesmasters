export default function Loading() {
    return (
        <div className="min-h-screen bg-transparent py-4 px-2">
            <div className="max-w-xl mx-auto space-y-4 animate-pulse">
                {/* League Header Skeleton */}
                <div className="h-10 bg-gray-800 rounded-lg w-3/4 mx-auto mb-6"></div>

                {/* Team Display Skeleton */}
                <div className="bg-white p-4 rounded-lg shadow-sm h-48 flex items-center justify-between">
                    <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                    <div className="w-32 h-8 bg-gray-200 rounded"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 w-20 bg-gray-800 rounded"></div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="h-64 bg-gray-900/50 rounded-lg"></div>
            </div>
        </div>
    );
}
