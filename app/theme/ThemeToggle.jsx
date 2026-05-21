"use client";

import { useContext, useMemo, useState, useEffect } from "react";


import { ThemeContext } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update until after mount to avoid SSR/client hydration mismatch.
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const effectiveTheme = mounted ? theme : "light";


  const label = useMemo(() => {
    return effectiveTheme === "dark" ? "Switch to Light" : "Switch to Dark";
  }, [effectiveTheme]);

  const icon = useMemo(() => {
    return effectiveTheme === "dark" ? "🌙" : "☀️";
  }, [effectiveTheme]);

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-warning"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}


