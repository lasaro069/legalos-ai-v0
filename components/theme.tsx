"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("legalos-theme");
    if (saved === "dark" || saved === "light") setThemeState(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    window.localStorage.setItem("legalos-theme", theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark"))
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex rounded-md border border-legal-line bg-slate-50 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "inline-flex min-h-8 items-center gap-2 rounded px-2.5 text-xs font-bold transition",
          theme === "light" ? "bg-white text-legal-blue shadow-sm dark:bg-slate-800 dark:text-blue-200" : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        )}
        aria-pressed={theme === "light"}
      >
        <Sun className="h-3.5 w-3.5" />
        Claro
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "inline-flex min-h-8 items-center gap-2 rounded px-2.5 text-xs font-bold transition",
          theme === "dark" ? "bg-white text-legal-blue shadow-sm dark:bg-slate-800 dark:text-blue-200" : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        )}
        aria-pressed={theme === "dark"}
      >
        <Moon className="h-3.5 w-3.5" />
        Oscuro
      </button>
    </div>
  );
}
