import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200/20 rounded-full"></div>

                {/* Inner Spinning Gradient Ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-white border-r-white/50 border-b-white/20 border-l-transparent rounded-full animate-spin"></div>

                {/* Optional: Glow effect can be added here if desired, but keeping it clean for now */}
            </div>
        </div>
    );
};

export default Loader;
