"use client";

import { useState, useEffect } from "react";

interface GenerationLoaderProps {
  title: string;
  duration: number; // estimated seconds
  messages: string[];
}

export function GenerationLoader({ title, duration, messages }: GenerationLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Progress bar - starts fast, slows down near the end (eased)
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        // Ease-out: fast start, slow end, never reaches 100%
        const pct = Math.min(95, (1 - Math.pow(1 - next / duration, 2)) * 100);
        setProgress(pct);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  // Cycle through messages
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;

  return (
    <div className="rounded-xl border border-[#222] bg-[#1a1a1a] p-8">
      <div className="mx-auto max-w-md">
        {/* Title */}
        <p className="text-center text-sm font-semibold">{title}</p>

        {/* Progress bar */}
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#1e1e1e]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Time + message */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/50 transition-opacity duration-500">
            {messages[msgIndex]}
          </p>
          <p className="text-xs tabular-nums text-white/50">{timeStr}</p>
        </div>
      </div>
    </div>
  );
}
