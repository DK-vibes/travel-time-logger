// lib/hourTicks.ts
/** 00:00, 01:00, … 23:00  */
export const hourTicks = Array.from({ length: 24 }, (_, h) =>
  `${String(h).padStart(2, '0')}:00`,
);