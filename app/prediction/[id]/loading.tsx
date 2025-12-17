
import React from "react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
            <div className="max-w-xl w-full space-y-6 animate-pulse">
                {/* League Header Placeholder */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                </div>

                {/* Team Display Placeholder */}
                <div className="flex flex-col items-center mb-8 bg-white p-4 rounded-lg shadow-sm h-48 justify-center">
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                    <div className="flex justify-between w-full max-w-sm px-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded self-center"></div>
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    </div>
                </div>

                {/* H2H Placeholder */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm h-40">
                    <div className="h-5 w-1/4 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-100 rounded"></div>
                        <div className="h-8 bg-gray-100 rounded"></div>
                        <div className="h-8 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
