'use client';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

export interface CalendarProps {
  selected: Set<string>; // YYYY‑MM‑DD in PT
  toggle: (day: string) => void;
}

function keyFor(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export default function Calendar({ selected, toggle }: CalendarProps) {
  const today = new Date();
  const months = [0, 1] as const; // current & previous month

  return (
    <div className="flex flex-col gap-6">
      {months.map((offset) => {
        const monthDate = subMonths(today, offset);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });

        return (
          <div key={offset}>
            <h3 className="font-medium mb-1">{format(monthDate, 'MMMM yyyy')}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="font-semibold text-xs">
                  {d}
                </span>
              ))}
              {Array(start.getDay())
                .fill(null)
                .map((_, i) => (
                  <span key={`pad-${i}`} />
                ))}
              {days.map((day) => {
                const k = keyFor(day);
                const active = selected.has(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggle(k)}
                    className={`w-8 h-8 rounded text-xs ${active ? 'bg-emerald-400 text-white' : 'bg-gray-200'}`}
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
