"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calculate(targetDate));
    const id = setInterval(() => setTime(calculate(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!time) {
    return (
      <div className="flex gap-3 sm:gap-5 justify-center">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 min-w-[72px] sm:min-w-[88px]"
          >
            <span className="font-display text-3xl sm:text-4xl font-semibold text-gold leading-none tabular-nums">
              --
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-white/50 mt-2">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "Days", value: pad(time.days) },
    { label: "Hours", value: pad(time.hours) },
    { label: "Min", value: pad(time.minutes) },
    { label: "Sec", value: pad(time.seconds) },
  ];

  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 min-w-[72px] sm:min-w-[88px]"
        >
          <span className="font-display text-3xl sm:text-4xl font-semibold text-gold leading-none tabular-nums">
            {value}
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-white/50 mt-2">{label}</span>
        </div>
      ))}
    </div>
  );
}
