import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import ChartCard from "@/components/common/ChartCard";
import ExportButton from "@/components/common/ExportButton";
import Tabs from "@/components/common/Tabs";
import EmptyState from "@/components/common/EmptyState";
import { useData } from "@/context/DataContext";
import { FileBarChart, Printer } from "lucide-react";

const CATEGORIES = [
  { value: "headcount", label: "Headcount" },
  { value: "attendance", label: "Attendance" },
  { value: "leave", label: "Leave" },
  { value: "payroll", label: "Payroll" },
  { value: "department", label: "Departments" },
  { value: "trends", label: "Joining Trends" },
];

const PIE = ["#3B82F6", "#172554", "#16A34A", "#D97706", "#DC2626", "#8B5CF6"];

export default function ReportsPage() {
  const { employees, attendance, leaves, departments } = useData();
  const [tab, setTab] = useState("headcount");
  const [from, setFrom] = useState("2023-01-01");
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [dept, setDept] = useState("");

  const filteredEmployees = useMemo(
    () => (dept ? employees.filter((e) => e.department === dept) : employees),
    [employees, dept],
  );

  const headcountData = useMemo(() => {
    const map = {};
    filteredEmployees.forEach((e) => {
      const y = e.joiningDate.slice(0, 4);
      map[y] = (map[y] || 0) + 1;
    });
    return Object.keys(map)
      .sort()
      .map((y) => ({ year: y, count: map[y] }));
  }, [filteredEmployees]);

  const attendanceData = useMemo(() => {
    const days = [...new Set(attendance.map((a) => a.date))].sort().slice(-14);
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

  const leaveData = useMemo(() => {
    const map = {};
    leaves.forEach((l) => {
      map[l.leaveType] = (map[l.leaveType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leaves]);

  const payrollData = useMemo(() => {
    const map = {};
    filteredEmployees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + e.net;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [filteredEmployees]);

  const deptData = useMemo(() => {
    const map = {};
    filteredEmployees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredEmployees]);

  const exportRows = filteredEmployees.map((e) => ({
    ID: e.id,
    Name: e.name,
    Department: e.department,
    Designation: e.designation,
    JoiningDate: e.joiningDate,
    Status: e.status,
    Net: e.net,
  }));

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export insights across the organization."
        actions={
          <>
            <button className="btn-secondary" onClick={() => window.print()}>
              <Printer size={15} /> Print view
            </button>
            <ExportButton rows={exportRows} filename="reports.csv" />
          </>
        }
      />

      <div className="card p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-end">
        <div>
          <label className="label">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex-1">
          <label className="label">Department</label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="input"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={CATEGORIES} className="mb-5" />

      {tab === "headcount" && (
        <ChartCard
          title="Employee Headcount Over Time"
          subtitle="Hires per year"
          height={340}
        >
          <ResponsiveContainer>
            <BarChart
              data={headcountData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
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
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {tab === "attendance" && (
        <ChartCard
          title="Attendance Trend"
          subtitle="Last 14 days"
          height={340}
        >
          <ResponsiveContainer>
            <LineChart
              data={attendanceData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
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
              <Line
                type="monotone"
                dataKey="Present"
                stroke="#16A34A"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Late"
                stroke="#D97706"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Absent"
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {tab === "leave" && (
        <ChartCard
          title="Leave Distribution"
          subtitle="By leave type"
          height={340}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={leaveData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={3}
              >
                {leaveData.map((_, i) => (
                  <Cell key={i} fill={PIE[i % PIE.length]} />
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
      )}

      {tab === "payroll" && (
        <ChartCard
          title="Payroll by Department"
          subtitle="Net salary totals"
          height={340}
        >
          <ResponsiveContainer>
            <BarChart
              data={payrollData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748B" }}
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
              <Bar dataKey="total" fill="#172554" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {tab === "department" && (
        <ChartCard title="Department-wise Distribution" height={340}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={deptData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >
                {deptData.map((_, i) => (
                  <Cell key={i} fill={PIE[i % PIE.length]} />
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
      )}

      {tab === "trends" && (
        <ChartCard
          title="Joining Trend"
          subtitle="Cumulative hires per year"
          height={340}
        >
          <ResponsiveContainer>
            <LineChart
              data={headcountData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
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
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
