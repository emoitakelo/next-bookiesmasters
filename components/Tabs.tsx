"use client";

import React from "react";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex overflow-x-auto gap-4 border-b border-gray-700/50 mb-6 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`pb-3 px-2 text-sm font-medium transition-colors whitespace-nowrap relative ${activeTab === tab.id
                            ? "text-orange-500"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-md" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
