import { useMemo, useState } from "react";
import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Tabs from "@/components/common/Tabs";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatDateTime } from "@/utils/format";

const iconBg = {
  leave: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  employee:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  payroll:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  performance:
    "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  attendance: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useData();
  const toast = useToast();
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    if (tab === "unread") return notifications.filter((n) => !n.read);
    if (tab === "read") return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, tab]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread notifications.`}
        actions={
          <button
            className="btn-secondary"
            onClick={() => {
              markAllNotificationsRead();
              toast.success("All notifications marked as read.");
            }}
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        }
      />

      <div className="card">
        <div className="px-4 pt-4">
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
              { value: "all", label: "All", count: notifications.length },
              {
                value: "unread",
                label: "Unread",
                count: notifications.filter((n) => !n.read).length,
              },
              {
                value: "read",
                label: "Read",
                count: notifications.filter((n) => n.read).length,
              },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up!"
          />
        ) : (
          <ul className="divide-y divide-border dark:divide-slate-800">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={`p-4 sm:p-5 flex items-start gap-3 transition ${!n.read ? "bg-blue-50/40 dark:bg-blue-950/10" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg[n.type] || iconBg.employee}`}
                >
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-ink dark:text-slate-100">
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted dark:text-slate-400 mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {formatDateTime(n.time)}
                  </p>
                </div>
                {!n.read && (
                  <button
                    className="btn-ghost !px-2 !py-1.5 shrink-0"
                    onClick={() => {
                      markNotificationRead(n.id);
                      toast.info("Marked as read.");
                    }}
                    title="Mark as read"
                  >
                    <Check size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
