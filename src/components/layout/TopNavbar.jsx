import { useNavigate } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import DropdownMenu from "@/components/common/DropdownMenu";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import { useState } from "react";

export default function TopNavbar({ onOpenMobile, onOpenSearch }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { unreadCount, employees } = useData();
  const navigate = useNavigate();
  const [quick, setQuick] = useState("");

  const matches = quick.trim()
    ? employees
        .filter((e) =>
          [e.name, e.email, e.id].some((v) =>
            v.toLowerCase().includes(quick.toLowerCase()),
          ),
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 h-16 bg-card/90 dark:bg-slate-900/90 backdrop-blur border-b border-border dark:border-slate-800">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:block min-w-0">
          <Breadcrumbs />
        </div>

        <div className="flex-1" />

        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            onFocus={onOpenSearch}
            placeholder="Quick search employees..."
            className="input !pl-9 !py-2 w-64 lg:w-72 !text-sm"
          />
          {matches.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl shadow-popover p-1.5 animate-fade-in">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setQuick("");
                    navigate(`/employees/${m.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface dark:hover:bg-slate-800 text-left"
                >
                  <Avatar name={m.name} size="xs" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-white truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {m.designation} · {m.department}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggle}
          className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="hidden sm:inline-flex p-2 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Help"
          title="Help center (demo)"
        >
          <HelpCircle size={18} />
        </button>

        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-danger text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <DropdownMenu
          width="w-56"
          trigger={
            <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface dark:hover:bg-slate-800">
              <Avatar name={user?.name || "User"} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-ink dark:text-white leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-muted dark:text-slate-400">
                  {user?.role}
                </p>
              </div>
            </div>
          }
          items={[
            {
              label: "My Profile",
              icon: User,
              onClick: () => navigate("/my-profile"),
            },
            {
              label: "Settings",
              icon: SettingsIcon,
              onClick: () => navigate("/settings"),
            },
            { divider: true },
            {
              label: "Logout",
              icon: LogOut,
              danger: true,
              onClick: () => {
                logout();
                navigate("/login");
              },
            },
          ]}
        />
      </div>
    </header>
  );
}
