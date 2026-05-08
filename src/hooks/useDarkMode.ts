import { useState, useEffect } from "react";

const STORAGE_KEY = "storyshare_dark";

/**
 * Simple dark mode hook that toggles the `.dark` class on <html>
 * and persists the preference in local storage.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? stored === "true" : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}
