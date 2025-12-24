import React from "react";

interface AffiliateButtonProps {
    bookmakerName: string;
    link: string;
    className?: string;
}

const AffiliateButton: React.FC<AffiliateButtonProps> = ({ bookmakerName, link, className = "" }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-transform transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
            style={{
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", // Rich green gradient
                border: "1px solid #22c55e"
            }}
        >
            <span className="flex items-center justify-center gap-2">
                <span>Bet now on</span>
                <span className="uppercase tracking-wider">{bookmakerName}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span>
            <span className="block text-[10px] font-normal text-green-100 mt-0.5 opacity-90">
                100% Welcome Bonus for New Players
            </span>
        </a>
    );
};

export default AffiliateButton;
