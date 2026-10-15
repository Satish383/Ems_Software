import { useMemo, useState } from "react";
import {
  CalendarCheck,
  UserX,
  Clock,
  ClipboardList,
  Plus,
  CalendarDays,
  List,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import SearchInput from "@/components/common/SearchInput";
import ExportButton from "@/components/common/ExportButton";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import Modal from "@/components/common/Modal";
import EmptyState from "@/components/common/EmptyState";
import FormSelect from "@/components/forms/FormSelect";
import FormInput from "@/components/forms/FormInput";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils/format";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AttendancePage() {
  const {
    attendance,
    employees,
    departments,
    updateAttendance,
    addAttendance,
  } = useData();
  const toast = useToast();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [view, setView] = useState("list");
  const [manual, setManual] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const dayRecords = useMemo(
    () => attendance.filter((a) => a.date === date),
    [attendance, date],
  );

  const stats = useMemo(
    () => ({
      present: dayRecords.filter(
        (a) =>
          a.status === "Present" ||
          a.status === "Late" ||
          a.status === "Half Day",
      ).length,
      absent: dayRecords.filter((a) => a.status === "Absent").length,
      late: dayRecords.filter((a) => a.status === "Late").length,
      onLeave: dayRecords.filter((a) => a.status === "On Leave").length,
    }),
    [dayRecords],
  );

  const filtered = useMemo(() => {
    let list = dayRecords;
    if (dept) list = list.filter((a) => a.department === dept);
    if (status) list = list.filter((a) => a.status === status);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((a) =>
        [a.employeeName, a.employeeId].some((v) =>
          v?.toLowerCase().includes(t),
        ),
      );
    }
    return list;
  }, [dayRecords, dept, status, q]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const checkIn = (record) => {
    updateAttendance(record.id, {
      checkIn: new Date().toTimeString().slice(0, 5),
      status: "Present",
      checkOut: record.checkOut === "—" ? "17:30" : record.checkOut,
    });
    toast.success(`Checked in ${record.employeeName}.`);
  };
  const checkOut = (record) => {
    updateAttendance(record.id, {
      checkOut: new Date().toTimeString().slice(0, 5),
    });
    toast.info(`Checked out ${record.employeeName}.`);
  };

  const handleManual = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const emp = employees.find((x) => x.id === fd.get("employeeId"));
    if (!emp) return;
    const rec = {
      id: `ATT-${date}-${emp.id}-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date,
      status: fd.get("status"),
      checkIn: fd.get("checkIn") || "—",
      checkOut: fd.get("checkOut") || "—",
      hours: Number(fd.get("hours") || 0),
    };
    addAttendance(rec);
    toast.success(`Attendance entry added for ${emp.name}.`);
    setManual(false);
  };

  // Calendar
  const calendarDays = useMemo(() => {
    const first = new Date(calendarYear, calendarMonth, 1);
    const last = new Date(calendarYear, calendarMonth + 1, 0);
    const startWeekday = first.getDay();
    const days = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
  }, [calendarMonth, calendarYear]);

  const statusForDate = (d) => {
    if (!d) return null;
    const iso = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const recs = attendance.filter((a) => a.date === iso);
    if (!recs.length) return null;
    const present = recs.filter((r) => r.status === "Present").length;
    const total = recs.length;
    const ratio = present / total;
    if (ratio > 0.8) return "high";
    if (ratio > 0.5) return "medium";
    return "low";
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Track daily attendance, working hours, and monthly trends."
        actions={
          <>
            <ExportButton
              rows={filtered.map((a) => ({
                Employee: a.employeeName,
                ID: a.employeeId,
                Date: a.date,
                Status: a.status,
                CheckIn: a.checkIn,
                CheckOut: a.checkOut,
                Hours: a.hours,
              }))}
              filename={`attendance-${date}.csv`}
            />
            <button className="btn-primary" onClick={() => setManual(true)}>
              <Plus size={15} /> Manual Entry
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={CalendarCheck}
          label="Present Today"
          value={stats.present}
          tone="success"
        />
        <StatCard
          icon={UserX}
          label="Absent Today"
          value={stats.absent}
          tone="danger"
        />
        <StatCard
          icon={Clock}
          label="Late Arrivals"
          value={stats.late}
          tone="warning"
        />
        <StatCard
          icon={ClipboardList}
          label="On Leave"
          value={stats.onLeave}
          tone="accent"
        />
      </div>

      <div className="card p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="input !py-2.5 !w-auto"
        />
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search employee..."
          className="flex-1 min-w-[180px]"
        />
        <select
          value={dept}
          onChange={(e) => {
            setDept(e.target.value);
            setPage(1);
          }}
          className="input !py-2.5 min-w-[160px]"
        >
          <option value="">Department: All</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="input !py-2.5 min-w-[140px]"
        >
          <option value="">Status: All</option>
          {["Present", "Absent", "Late", "Half Day", "On Leave"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="inline-flex rounded-lg border border-border dark:border-slate-700 p-0.5 self-start">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 ${view === "list" ? "bg-navy-900 dark:bg-accent text-white" : "text-muted hover:text-ink dark:hover:text-white"}`}
          >
            <List size={13} /> List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 ${view === "calendar" ? "bg-navy-900 dark:bg-accent text-white" : "text-muted hover:text-ink dark:hover:text-white"}`}
          >
            <CalendarDays size={13} /> Calendar
          </button>
        </div>
      </div>

      {view === "list" ? (
        filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={CalendarCheck}
              title="No attendance records"
              description="Try a different date or filter."
            />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="th">Employee</th>
                  <th className="th">Department</th>
                  <th className="th">Check In</th>
                  <th className="th">Check Out</th>
                  <th className="th">Hours</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-800">
                {paged.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.employeeName} size="xs" />
                        <div>
                          <p className="font-medium text-ink dark:text-slate-100">
                            {a.employeeName}
                          </p>
                          <p className="text-[11px] text-muted font-mono">
                            {a.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="td">{a.department}</td>
                    <td className="td">{a.checkIn}</td>
                    <td className="td">{a.checkOut}</td>
                    <td className="td">{a.hours}h</td>
                    <td className="td">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="td text-right">
                      <div className="inline-flex gap-1">
                        <button
                          className="btn-secondary !py-1.5 !px-2.5 !text-xs"
                          onClick={() => checkIn(a)}
                          disabled={a.checkIn !== "—"}
                        >
                          Check In
                        </button>
                        <button
                          className="btn-secondary !py-1.5 !px-2.5 !text-xs"
                          onClick={() => checkOut(a)}
                          disabled={a.checkOut !== "—"}
                        >
                          Check Out
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          </div>
        )
      ) : (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-ink dark:text-white">
              Monthly Attendance
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={calendarMonth}
                onChange={(e) => setCalendarMonth(Number(e.target.value))}
                className="input !py-2 !text-sm"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={calendarYear}
                onChange={(e) => setCalendarYear(Number(e.target.value))}
                className="input !py-2 !text-sm"
              >
                {[2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="py-1.5 font-semibold uppercase tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((d, i) => {
              const s = statusForDate(d);
              const color =
                s === "high"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                  : s === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                    : s === "low"
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                      : "bg-surface dark:bg-slate-800 text-muted dark:text-slate-500 border-transparent";
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-sm font-medium ${color}`}
                >
                  {d || ""}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-400" /> Good
              attendance
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400" /> Partial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400" /> Low
            </span>
          </div>
        </div>
      )}

      <Modal
        open={manual}
        onClose={() => setManual(false)}
        title="Manual Attendance Entry"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setManual(false)}>
              Cancel
            </button>
            <button form="manual-form" type="submit" className="btn-primary">
              Save entry
            </button>
          </>
        }
      >
        <form id="manual-form" onSubmit={handleManual} className="space-y-4">
          <FormSelect label="Employee" name="employeeId" required>
            <option value="">Select employee…</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.id})
              </option>
            ))}
          </FormSelect>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Date" type="date" value={date} readOnly />
            <FormSelect label="Status" name="status" required>
              {["Present", "Absent", "Late", "Half Day", "On Leave"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </FormSelect>
            <FormInput label="Check In" name="checkIn" placeholder="09:00" />
            <FormInput label="Check Out" name="checkOut" placeholder="17:30" />
            <FormInput
              label="Hours"
              name="hours"
              type="number"
              step="0.25"
              min="0"
              max="24"
              placeholder="8"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
