"use client";

import { useRouter } from "next/navigation";

interface Props {
  date: string; // yyyy-mm-dd from page params
}

export default function DateNavigator({ date }: Props) {
  const router = useRouter();

  const currentDate = new Date(date);

  // Format: Saturday, 14 Dec
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

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
    router.push(`/predictions/${e.target.value}`);
  };

  return (
    <div className="w-full border-b bg-white text-black py-3 px-4 flex items-center justify-between gap-4">

      {/* LEFT: LIVE button */}
      <button className="bg-red-600 text-white px-3 py-1 text-sm rounded">
        LIVE
      </button>

      {/* CENTER: < Date > */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          className="text-lg font-bold px-2 py-1 border rounded"
        >
          {"<"}
        </button>

        <div className="text-md font-semibold whitespace-nowrap">
          {formattedDate}
        </div>

        <button
          onClick={goNext}
          className="text-lg font-bold px-2 py-1 border rounded"
        >
          {">"}
        </button>
      </div>

      {/* RIGHT: Calendar */}
      <input
        type="date"
        value={date}
        onChange={onPickDate}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
