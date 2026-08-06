"use client";

import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Topbar({ userName }: { userName?: string | null }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-[var(--card)]/80 backdrop-blur-md px-6">
      {/* Search trigger */}
      <button
        onClick={() => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
        }}
        className="flex w-64 items-center gap-2 rounded-lg border bg-[var(--muted)]/50 px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto rounded border bg-[var(--card)] px-1.5 text-xs">
          /
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          className="relative rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-medium text-[var(--primary-foreground)]">
          {userName?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}