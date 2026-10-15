import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { navItems } from "@/routes/navConfig";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import Avatar from "@/components/common/Avatar";
import DropdownMenu from "@/components/common/DropdownMenu";

function BrandMark({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-navy-900 flex items-center justify-center text-white font-bold shadow-md shrink-0">
        EH
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-ink dark:text-white leading-tight truncate">
            EmployeeHub
          </p>
          <p className="text-[10px] text-muted dark:text-slate-400 tracking-wider uppercase">
            HR Suite
          </p>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  const body = (
    <aside
      className={`flex flex-col h-full bg-card dark:bg-slate-900 border-r border-border dark:border-slate-800 transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-3 border-b border-border dark:border-slate-800">
        <BrandMark collapsed={collapsed} />
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white hidden lg:flex"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-border dark:border-slate-800">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {navItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path));
          const isNotif = item.path === "/notifications";
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-navy-900 dark:bg-accent text-white shadow-sm"
                  : "text-ink/80 dark:text-slate-300 hover:bg-surface dark:hover:bg-slate-800 hover:text-ink dark:hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isNotif && unreadCount > 0 && (
                <span className="ml-auto bg-danger text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              {collapsed && isNotif && unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border dark:border-slate-800 p-3">
        <DropdownMenu
          align="right"
          width="w-56"
          trigger={
            <div
              className={`flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-surface dark:hover:bg-slate-800 transition ${collapsed ? "justify-center" : ""}`}
            >
              <Avatar name={user?.name || "User"} size="sm" />
              {!collapsed && (
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-muted dark:text-slate-400 truncate">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
          }
          items={[
            {
              label: "My Profile",
              icon: User,
              onClick: () => (window.location.href = "/my-profile"),
            },
            {
              label: "Settings",
              icon: SettingsIcon,
              onClick: () => (window.location.href = "/settings"),
            },
            { divider: true },
            { label: "Logout", icon: LogOut, danger: true, onClick: logout },
          ]}
        />
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-screen sticky top-0">{body}</div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[80] flex">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative animate-slide-in-left h-full w-64">
            {body}
          </div>
        </div>
      )}
    </>
  );
}
