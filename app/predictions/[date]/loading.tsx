export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-6 h-6 rounded-full border-4 border-[#1F1F1F]"></div>
                {/* Inner Spinning Ring */}
                <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-4 border-t-white border-transparent animate-spin"></div>
            </div>

        </div>
    );
}
