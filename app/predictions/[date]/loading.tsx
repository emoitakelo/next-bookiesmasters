export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-12 h-12 rounded-full border-4 border-[#1F1F1F]"></div>
                {/* Inner Spinning Ring */}
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-t-white border-transparent animate-spin"></div>
            </div>
            <p className="text-sm text-gray-400 font-medium animate-pulse">Loading Fixtures...</p>
        </div>
    );
}
