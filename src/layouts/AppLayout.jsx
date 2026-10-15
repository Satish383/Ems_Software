import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";

export default function AppLayout() {
  // Desktop sidebar collapse state (persisted for the session)
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer state (opened by the hamburger in TopNavbar)
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface dark:bg-slate-950">
      {/* -------------------- SIDEBAR -------------------- */}
      {/* Renders as a sticky column on desktop and as an animated drawer on mobile. */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* -------------------- MAIN COLUMN -------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenMobile={() => setMobileOpen(true)} />

        {/* Page content — all nested routes render here */}
        <main className="flex-1 px-4 sm:px-6 py-6 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-4 text-xs text-muted dark:text-slate-500 border-t border-border dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>EmployeeHub — Demo frontend. All data is fictional.</p>
            <p className="text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} EmployeeHub Inc.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
