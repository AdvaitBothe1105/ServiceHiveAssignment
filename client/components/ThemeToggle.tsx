"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-16 items-center rounded-full border border-border bg-card/80 px-1 shadow-sm transition ${
        isDark ? "border-primary/60" : "hover:border-primary/60"
      }`}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground transition ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? "ON" : "OFF"}
      </span>
    </button>
  );
}
