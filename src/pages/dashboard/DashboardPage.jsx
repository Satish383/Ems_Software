import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  CalendarClock,
  ClipboardList,
  Wallet,
  Plus,
  CalendarCheck,
  FileBarChart,
  CheckCircle2,
  XCircle,
  Cake,
  PartyPopper,
  UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/common/ChartCard";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  daysBetween,
  isSameDay,
} from "@/utils/format";

const PIE_COLORS = [
  "#3B82F6",
  "#172554",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#64748B",
  "#0EA5E9",
  "#8B5CF6",
];

export default function DashboardPage() {
  const { employees, attendance, leaves, notifications, updateLeaveStatus } =
    useData();
  const toast = useToast();
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const todayRecords = attendance.filter((a) => a.date === today);
    const present = todayRecords.filter(
      (a) =>
        a.status === "Present" ||
        a.status === "Late" ||
        a.status === "Half Day",
    ).length;
    const absent = todayRecords.filter((a) => a.status === "Absent").length;
    const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
    const monthlyPayroll = employees.reduce((s, e) => s + (e.net || 0), 0);
    return { total, active, present, absent, pendingLeaves, monthlyPayroll };
  }, [employees, attendance, leaves, today]);

  const growthData = useMemo(() => {
    const buckets = {};
    employees.forEach((e) => {
      const year = e.joiningDate.slice(0, 4);
      buckets[year] = (buckets[year] || 0) + 1;
    });
    const years = Object.keys(buckets).sort();
    return years.map((y) => ({ year: y, hires: buckets[y] }));
  }, [employees]);

  const attendanceChart = useMemo(() => {
    const days = [...new Set(attendance.map((a) => a.date))].sort().slice(-7);
    return days.map((d) => {
      const recs = attendance.filter((a) => a.date === d);
      return {
        date: d.slice(5),
        Present: recs.filter((r) => r.status === "Present").length,
        Absent: recs.filter((r) => r.status === "Absent").length,
        Late: recs.filter((r) => r.status === "Late").length,
      };
    });
  }, [attendance]);

  const deptDistribution = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const pendingLeaves = leaves
    .filter((l) => l.status === "Pending")
    .slice(0, 5);
  const recentEmployees = [...employees]
    .sort((a, b) => b.joiningDate.localeCompare(a.joiningDate))
    .slice(0, 5);

  const birthdays = employees
    .map((e) => ({ ...e, monthDay: e.dob.slice(5) }))
    .filter((e) => {
      const todayMD = today.slice(5);
      const [m, d] = todayMD.split("-").map(Number);
      const [em, ed] = e.monthDay.split("-").map(Number);
      const diff = (em - m) * 30 + (ed - d);
      return diff >= 0 && diff <= 45;
    })
    .slice(0, 4);

  const handleApprove = (l) => {
    updateLeaveStatus(l.id, "Approved");
    toast.success(`Approved leave for ${l.employeeName}`);
  };
  const handleReject = (l) => {
    updateLeaveStatus(l.id, "Rejected", "Rejected from dashboard");
    toast.info(`Rejected leave for ${l.employeeName}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your organization's people metrics and activity."
        actions={
          <>
            <Link to="/employees/new" className="btn-secondary">
              <Plus size={15} /> Add Employee
            </Link>
            <Link to="/attendance" className="btn-secondary">
              <CalendarCheck size={15} /> Mark Attendance
            </Link>
            <Link to="/reports" className="btn-primary">
              <FileBarChart size={15} /> Create Report
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.total}
          trend={4}
          trendLabel="vs last month"
          tone="navy"
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.active}
          trend={2}
          trendLabel="vs last month"
          tone="success"
        />
        <StatCard
          icon={CalendarCheck}
          label="Present Today"
          value={stats.present}
          trend={1}
          trendLabel="vs yesterday"
          tone="accent"
        />
        <StatCard
          icon={UserX}
          label="Absent Today"
          value={stats.absent}
          trend={-3}
          trendLabel="vs yesterday"
          tone="danger"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Leaves"
          value={stats.pendingLeaves}
          trend={0}
          trendLabel="awaiting action"
          tone="warning"
        />
        <StatCard
          icon={Wallet}
          label="Monthly Payroll"
          value={formatCurrency(stats.monthlyPayroll)}
          trend={3}
          trendLabel="vs last month"
          tone="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartCard
            title="Employee Growth"
            subtitle="Hires per year"
            height={280}
          >
            <ResponsiveContainer>
              <AreaChart
                data={growthData}
                margin={{ top: 5, right: 10, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="hires"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#growth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Department Distribution"
          subtitle="Headcount by team"
          height={280}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={deptDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {deptDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartCard
            title="Attendance Overview"
            subtitle="Last 7 days"
            height={280}
          >
            <ResponsiveContainer>
              <BarChart
                data={attendanceChart}
                margin={{ top: 5, right: 10, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="Present"
                  stackId="a"
                  fill="#16A34A"
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="Late" stackId="a" fill="#D97706" />
                <Bar
                  dataKey="Absent"
                  stackId="a"
                  fill="#DC2626"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Recent Activity"
          subtitle="Latest updates"
          height={280}
        >
          <ul className="space-y-4 overflow-y-auto h-full pr-1">
            {[
              ...notifications.map((n) => ({
                id: n.id,
                actor: n.title,
                target: n.message,
                time: n.time,
                type: n.type,
              })),
            ]
              .slice(0, 6)
              .map((a) => (
                <li key={a.id} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink dark:text-slate-100">
                      <span className="font-semibold">{a.actor}</span>
                    </p>
                    <p className="text-xs text-muted dark:text-slate-400 line-clamp-2">
                      {a.target}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDateTime(a.time)}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </ChartCard>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-ink dark:text-white">
              Pending Leave Requests
            </h3>
            <Link
              to="/leaves"
              className="text-sm text-accent font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {pendingLeaves.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No pending requests"
              description="All leave requests have been reviewed."
            />
          ) : (
            <ul className="divide-y divide-border dark:divide-slate-800">
              {pendingLeaves.map((l) => (
                <li key={l.id} className="py-3 flex items-center gap-3">
                  <Avatar name={l.employeeName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink dark:text-slate-100 truncate">
                      {l.employeeName}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {l.leaveType} · {formatDate(l.startDate)} →{" "}
                      {formatDate(l.endDate)} ({l.days}d)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-secondary !px-2.5 !py-1.5"
                      onClick={() => handleReject(l)}
                      title="Reject"
                    >
                      <XCircle size={15} className="text-danger" />
                    </button>
                    <button
                      className="btn-primary !px-2.5 !py-1.5"
                      onClick={() => handleApprove(l)}
                      title="Approve"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Upcoming Birthdays
              </h3>
              <Cake size={16} className="text-muted" />
            </div>
            {birthdays.length === 0 ? (
              <p className="text-sm text-muted">
                No upcoming birthdays in the next 45 days.
              </p>
            ) : (
              <ul className="space-y-3">
                {birthdays.map((b) => (
                  <li key={b.id} className="flex items-center gap-3">
                    <Avatar name={b.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink dark:text-slate-100 truncate">
                        {b.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(b.dob, { year: undefined })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Recent Additions
              </h3>
              <UserPlus size={16} className="text-muted" />
            </div>
            <ul className="space-y-3">
              {recentEmployees.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/employees/${e.id}`}
                    className="flex items-center gap-3 rounded-lg -m-1 p-1 hover:bg-surface dark:hover:bg-slate-800"
                  >
                    <Avatar name={e.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink dark:text-slate-100 truncate">
                        {e.name}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {e.designation}
                      </p>
                    </div>
                    <StatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
