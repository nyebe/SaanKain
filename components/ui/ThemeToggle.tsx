"use client"

import {
  useEffect,
  useState,
} from 'react';

import {
  Laptop,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cycle: light → dark → system → light ...
  const next = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={next}
      className="p-2 rounded-md hover:bg-accent/5"
    >
      {!mounted ? (
        <span className="w-5 h-5 inline-block" aria-hidden="true" />
      ) : resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : theme === "system" ? (
        <Laptop className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}
