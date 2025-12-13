"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  date: string; // yyyy-mm-dd from page params
}

export default function DateNavigator({ date }: Props) {
  const router = useRouter();
  const [year, month, day] = date.split("-").map(Number);
  const currentDate = new Date(year, month - 1, day); // Local midnight

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Local midnight today

  // Calculate limits (7 days before and after today)
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 7);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  // Format: Saturday, 14 Dec
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  // Check if navigation is allowed
  const canGoPrev = currentDate > minDate;
  const canGoNext = currentDate < maxDate;

  // Helper to format YYYY-MM-DD locally
  const toYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Go to previous day
  const goPrev = () => {
    if (!canGoPrev) return;
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    router.push(`/predictions/${toYYYYMMDD(prev)}`);
  };

  // Go to next day
  const goNext = () => {
    if (!canGoNext) return;
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    router.push(`/predictions/${toYYYYMMDD(next)}`);
  };

  return (
    <div className="max-w-xl mx-auto bg-black text-white py-2 px-3 flex items-center justify-between gap-2">

      {/* LEFT: LIVE button (circular) */}
      <button className=" bg-[#1F1F1F] w-8 h-6 rounded-md flex items-center justify-center text-xs ">
        Live
      </button>

      {/* CENTER: < Date > */}
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`text-xl px-4 py-1 rounded transition-colors ${canGoPrev ? "text-gray-400 hover:text-white" : "text-gray-700 cursor-not-allowed"
            }`}
        >
          {"<"}
        </button>

        <div className="text-medium font-semibold text-gray-300 whitespace-nowrap">
          {formattedDate}
        </div>

        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={`text-xl px-4 py-1 rounded transition-colors ${canGoNext ? "text-gray-400 hover:text-white" : "text-gray-700 cursor-not-allowed"
            }`}
        >
          {">"}
        </button>
      </div>

      {/* RIGHT: Search button */}
      <button
        className="w-8 h-6 bg-[#1F1F1F] text-white rounded-md flex items-center justify-center hover:bg-[#2F2F2F] transition-colors"
      >
        <Search size={14} />
      </button>
    </div>
  );
}
