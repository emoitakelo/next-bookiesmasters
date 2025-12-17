export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="relative">

                {/* Inner Spinning Ring */}
                <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-t-white border-transparent animate-wiggle"></div>
            </div>

        </div>
    );
}
