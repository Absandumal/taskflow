"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { MobileBottomNav } from "./MobileBottomNav";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";

function AppShellInner({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        className={cn(
          "transition-[padding] duration-300",
          collapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        <Topbar userName={userName} />
        <main className="p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>

      <CommandPalette />
      <MobileBottomNav />
    </div>
  );
}

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <SidebarProvider>
      <AppShellInner userName={userName}>{children}</AppShellInner>
    </SidebarProvider>
  );
}