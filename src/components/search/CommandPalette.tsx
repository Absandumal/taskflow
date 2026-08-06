"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckSquare, FolderKanban, X } from "lucide-react";

type TaskResult = {
  id: string;
  title: string;
  status: string;
  priority: string;
  completed: boolean;
};

type ProjectResult = {
  id: string;
  name: string;
  description: string | null;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [projects, setProjects] = useState<ProjectResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalResults = tasks.length + projects.length;

  // Open with "/" key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "/" && !open) {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setTasks(data.tasks || []);
        setProjects(data.projects || []);
        setSelectedIndex(0);
      } catch {
        setTasks([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setTasks([]);
    setProjects([]);
  }, []);

  function handleSelectTask() {
    close();
    router.push("/dashboard");
  }

  function handleSelectProject() {
    close();
    router.push("/dashboard/projects");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, totalResults - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && totalResults > 0) {
      e.preventDefault();
      if (selectedIndex < tasks.length) {
        handleSelectTask();
      } else {
        handleSelectProject();
      }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
          <Search className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks and projects..."
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            onClick={close}
            className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">
              Searching...
            </p>
          )}

          {!loading && query && totalResults === 0 && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!loading && !query && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">
              Type to search tasks and projects
            </p>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                Tasks
              </p>
              {tasks.map((task, i) => (
                <button
                  key={task.id}
                  onClick={handleSelectTask}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedIndex === i
                      ? "bg-[var(--muted)]"
                      : "hover:bg-[var(--muted)]/60"
                  }`}
                >
                  <CheckSquare className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                  <span className="flex-1 truncate">{task.title}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {task.status.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                Projects
              </p>
              {projects.map((project, i) => (
                <button
                  key={project.id}
                  onClick={handleSelectProject}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedIndex === tasks.length + i
                      ? "bg-[var(--muted)]"
                      : "hover:bg-[var(--muted)]/60"
                  }`}
                >
                  <FolderKanban className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                  <span className="flex-1 truncate">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
          <span>
            <kbd className="rounded border bg-[var(--muted)] px-1.5 py-0.5">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border bg-[var(--muted)] px-1.5 py-0.5">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border bg-[var(--muted)] px-1.5 py-0.5">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}