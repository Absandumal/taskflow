"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemePreference() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors",
              active
                ? "border-[var(--foreground)] bg-[var(--muted)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}