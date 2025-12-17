import React, { useState } from "react";
import { CalendarDays, X, ChevronLeft, ChevronRight } from "lucide-react";

const DateNavigator = ({ currentDate, onChangeDate, loading }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  // Format currently selected date for display
  const formattedDate = new Date(currentDate).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const handleCalendarToggle = () => setShowCalendar((s) => !s);

  // Use local date string (en-CA) to avoid UTC shift
  const handleDateClick = (date) => {
    const isoDate = date.toLocaleDateString("en-CA");
    if (loading) return;
    onChangeDate(isoDate);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    const prev = new Date(viewDate);
    prev.setMonth(prev.getMonth() - 1);
    setViewDate(prev);
  };
  const handleNextMonth = () => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + 1);
    setViewDate(next);
  };

  // Build calendar grid for viewDate
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [...Array(daysInMonth).keys()].map((i) => i + 1);
  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="relative max-w-xl mx-auto flex items-center justify-center my-3 px-8 sm:px-12">
      {/* Live button (no outline on mouse click; keyboard focus still possible) */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        className="absolute left-5 sm:left-10 w-8 h-7 sm:w-10 sm:h-19 rounded-full
          bg-teal-700 text-white flex items-center justify-center text-xs sm:text-sm
           transition-colors
          focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0"
      >
        Live
      </button>

      {/* Current date display */}
      <span className="text-medium sm:text-medium font-semibold text-teal-950 text-center select-none">
        {formattedDate}
      </span>

      {/* Calendar toggle / close (keeps teal background when open) */}
      <button
        type="button"
        onClick={handleCalendarToggle}
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute right-5 sm:right-10 w-8 h-7 sm:w-10 sm:h-9 rounded-full
          flex items-center justify-center text-white text-xs sm:text-sm transition-colors
          ${showCalendar ? "bg-teal-700 hover:bg-teal-700" : "bg-teal-700 "}
          focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0`}
        aria-expanded={showCalendar}
        aria-label={showCalendar ? "Close calendar" : "Open calendar"}
      >
        {showCalendar ? <X size={18} /> : <CalendarDays size={20} />}
      </button>

      {/* Custom calendar popup */}
      {showCalendar && (
        <div
          className="absolute right-4 sm:right-12 top-12 bg-white border border-gray-200 rounded-lg
            shadow-lg p-3 z-50 w-64"
          role="dialog"
          aria-modal="false"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-gray-100 transition
                focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="font-semibold text-gray-800 text-sm select-none">
              {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-gray-100 transition
                focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 text-center text-gray-600 text-xs font-semibold mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before the first day */}
            {[...Array(firstDay).keys()].map((i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const dateObj = new Date(year, month, day);
              const iso = dateObj.toLocaleDateString("en-CA");
              const isToday = iso === today;
              const isSelected = iso === currentDate;

              return (
                <button
                  key={day}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleDateClick(dateObj)}
                  className={`text-sm w-8 h-8 rounded-md transition-colors
                    ${isSelected ? "bg-teal-600 text-white" : ""}
                    ${!isSelected && isToday ? "border border-teal-500 text-teal-700" : ""}
                    ${!isSelected && !isToday ? "hover:bg-teal-500 hover:text-white text-gray-800" : ""}
                    focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0`}
                  aria-pressed={isSelected}
                  aria-label={`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateNavigator;
