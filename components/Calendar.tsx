'use client';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from 'date-fns';

export interface CalendarProps {
  /** Selected days in “YYYY-MM-DD” format */
  selected: Set<string>;
  /** Toggle a day on/off */
  toggle: (day: string) => void;
  /** Map from YYYY-MM-DD → CSS color (for days with data) */
  colorMap: Record<string, string>;
}

function keyFor(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export default function Calendar({
  selected,
  toggle,
  colorMap,
}: CalendarProps) {
  const today = new Date();
  const months = [0, 1] as const; // current month and the one before

  return (
    <div className="flex flex-col gap-6">
      {months.map((offset) => {
        const monthDate = subMonths(today, offset);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });

        return (
          <div key={offset}>
            <h3 className="font-medium mb-1 text-black">
              {format(monthDate, 'MMMM yyyy')}
            </h3>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {/* Weekday headers, always white */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="font-semibold text-xs text-white">
                  {d}
                </span>
              ))}

              {/* Blank slots before the 1st */}
              {Array(start.getDay())
                .fill(null)
                .map((_, i) => (
                  <span key={`pad-${i}`} />
                ))}

              {/* Actual days */}
              {days.map((day) => {
                const k = keyFor(day);
                const hasData = k in colorMap;
                const isActive = selected.has(k);

                // pick a background:
                // - colored if selected
                // - white if available but not selected
                // - gray if no data at all
                const bg = hasData
                  ? isActive
                    ? colorMap[k]
                    : '#ffffff'
                  : '#e5e7eb';

                return (
                  <button
                    key={k}
                    onClick={() => hasData && toggle(k)}
                    className="w-8 h-8 rounded text-xs font-medium text-black"
                    style={{ backgroundColor: bg }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
