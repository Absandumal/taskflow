import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <Topbar userName={userName} />
        <main className="p-6 md:p-8">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}