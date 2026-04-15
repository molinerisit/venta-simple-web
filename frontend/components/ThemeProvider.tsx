"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Leer preferencia guardada al montar
  useEffect(() => {
    const saved = (localStorage.getItem("vs-theme") ?? "light") as Theme;
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function applyTheme(t: Theme) {
    const html = document.documentElement;
    if (t === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("vs-theme", next);
    applyTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
