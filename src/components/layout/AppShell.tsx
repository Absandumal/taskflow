import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop sidebar only */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main area: no left pad on mobile, left pad on desktop */}
      <div className="md:pl-64">
        <Topbar userName={userName} />
        {/* Extra bottom padding on mobile for the nav bar */}
        <main className="p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>

      <CommandPalette />
      <MobileBottomNav />
    </div>
  );
}