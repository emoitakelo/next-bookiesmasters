"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

interface Props {
  date: string; // yyyy-mm-dd from page params
}

export default function DateNavigator({ date }: Props) {
  const router = useRouter();
  const hiddenCalendar = useRef<HTMLInputElement>(null);

  const currentDate = new Date(date);

  // Format: Saturday, 14 Dec
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const dayOnly = currentDate.getDate(); // e.g. 11

  // Go to previous day
  const goPrev = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    const newDate = prev.toISOString().split("T")[0];
    router.push(`/predictions/${newDate}`);
  };

  // Go to next day
  const goNext = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    const newDate = next.toISOString().split("T")[0];
    router.push(`/predictions/${newDate}`);
  };

  // Calendar change
  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    router.push(`/predictions/${e.target.value}`);
  };

  return (
    <div className="max-w-3xl border-b bg-black text-white py-2 px-1 flex items-center justify-between gap-2">

      {/* LEFT: LIVE button (circular) */}
      <button className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs ">
        Live
      </button>

      {/* CENTER: < Date > */}
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          className="text-sm font-bold px-4 py-1 bor rounded"
        >
          {"<"}
        </button>

        <div className="text-sm font-semibold whitespace-nowrap">
          {formattedDate}
        </div>

        <button
          onClick={goNext}
          className="text-sm font-bold px-4 py-1  rounded"
        >
          {">"}
        </button>
      </div>

      {/* RIGHT: Circular calendar showing only the day number */}
      <button
        onClick={() => hiddenCalendar.current?.showPicker?.()}
        className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center "
      >
        {dayOnly}
      </button>

      {/* Hidden HTML date picker */}
      <input
        ref={hiddenCalendar}
        type="date"
        value={date}
        onChange={onPickDate}
        className="hidden"
      />
    </div>
  );
}
