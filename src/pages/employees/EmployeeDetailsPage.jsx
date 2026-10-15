import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Building2,
  Wallet,
  ClipboardList,
  FileText,
  TrendingUp,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import Tabs from "@/components/common/Tabs";
import EmptyState from "@/components/common/EmptyState";
import { useData } from "@/context/DataContext";
import { formatCurrency, formatDate } from "@/utils/format";

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    {Icon && (
      <div className="w-9 h-9 rounded-lg bg-surface dark:bg-slate-800 text-muted dark:text-slate-300 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-slate-500">
        {label}
      </p>
      <p className="text-sm text-ink dark:text-slate-100 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { employees, attendance, leaves } = useData();
  const [tab, setTab] = useState("overview");

  const employee = employees.find((e) => e.id === id);

  const empAttendance = useMemo(
    () =>
      attendance
        .filter((a) => a.employeeId === id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, id],
  );
  const empLeaves = useMemo(
    () => leaves.filter((l) => l.employeeId === id),
    [leaves, id],
  );

  if (!employee) {
    return (
      <div className="card">
        <EmptyState
          icon={UserCheck}
          title="Employee not found"
          description={`No employee matches ID ${id}. It may have been removed.`}
          action={
            <Link className="btn-secondary" to="/employees">
              Back to directory
            </Link>
          }
        />
      </div>
    );
  }

  const attendanceSummary = {
    present: empAttendance.filter((a) => a.status === "Present").length,
    absent: empAttendance.filter((a) => a.status === "Absent").length,
    late: empAttendance.filter((a) => a.status === "Late").length,
    leave: empAttendance.filter((a) => a.status === "On Leave").length,
    avgHours:
      empAttendance.length > 0
        ? (
            empAttendance.reduce((s, a) => s + a.hours, 0) /
            empAttendance.length
          ).toFixed(2)
        : "0.00",
  };

  const leaveBalance = {
    annual: { used: 4, total: 20 },
    sick: { used: 2, total: 10 },
    casual: { used: 1, total: 5 },
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employee Profile"
        subtitle="Detailed profile, attendance, leave, and salary information."
        actions={
          <>
            <Link to="/employees" className="btn-ghost">
              <ArrowLeft size={15} /> Directory
            </Link>
            <button className="btn-primary">Edit Profile</button>
          </>
        }
      />

      {/* Hero card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <Avatar name={employee.name} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-ink dark:text-white">
                {employee.name}
              </h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-muted dark:text-slate-400 mt-1">
              {employee.designation} · {employee.department} ·{" "}
              <span className="font-mono">{employee.id}</span>
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field icon={Mail} label="Email" value={employee.email} />
              <Field icon={Phone} label="Phone" value={employee.phone} />
              <Field
                icon={MapPin}
                label="Location"
                value={`${employee.city}, ${employee.state} ${employee.postalCode}`}
              />
              <Field
                icon={Calendar}
                label="Joined"
                value={formatDate(employee.joiningDate)}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "overview", label: "Overview" },
          {
            value: "attendance",
            label: "Attendance",
            count: empAttendance.length,
          },
          { value: "leave", label: "Leave History", count: empLeaves.length },
          { value: "salary", label: "Salary" },
          { value: "documents", label: "Documents" },
        ]}
      />

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-ink dark:text-white mb-4">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                icon={Briefcase}
                label="Designation"
                value={employee.designation}
              />
              <Field
                icon={Building2}
                label="Department"
                value={employee.department}
              />
              <Field
                icon={UserCheck}
                label="Employment Type"
                value={employee.employmentType}
              />
              <Field
                icon={UserCheck}
                label="Reporting Manager"
                value={employee.reportingManager}
              />
              <Field
                icon={Calendar}
                label="Joining Date"
                value={formatDate(employee.joiningDate)}
              />
              <Field
                icon={Calendar}
                label="Date of Birth"
                value={formatDate(employee.dob)}
              />
              <Field
                icon={MapPin}
                label="Address"
                value={`${employee.address}, ${employee.city}, ${employee.state} ${employee.postalCode}`}
              />
              <Field
                icon={Phone}
                label="Emergency Contact"
                value={employee.emergencyContact}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="text-base font-semibold text-ink dark:text-white mb-4">
                Attendance Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Present",
                    value: attendanceSummary.present,
                    tone: "text-success",
                  },
                  {
                    label: "Absent",
                    value: attendanceSummary.absent,
                    tone: "text-danger",
                  },
                  {
                    label: "Late",
                    value: attendanceSummary.late,
                    tone: "text-warning",
                  },
                  {
                    label: "On Leave",
                    value: attendanceSummary.leave,
                    tone: "text-accent",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-border dark:border-slate-800 p-3"
                  >
                    <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">
                      {s.label}
                    </p>
                    <p className={`text-xl font-bold mt-1 ${s.tone}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted">
                Average working hours:{" "}
                <span className="font-semibold text-ink dark:text-slate-200">
                  {attendanceSummary.avgHours}h
                </span>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-base font-semibold text-ink dark:text-white mb-4">
                Leave Balance
              </h3>
              <div className="space-y-3">
                {[
                  { key: "annual", label: "Annual" },
                  { key: "sick", label: "Sick" },
                  { key: "casual", label: "Casual" },
                ].map((l) => {
                  const b = leaveBalance[l.key];
                  const pct = Math.round(((b.total - b.used) / b.total) * 100);
                  return (
                    <div key={l.key}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-ink dark:text-slate-200">
                          {l.label}
                        </span>
                        <span className="text-muted">
                          {b.total - b.used} of {b.total} remaining
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "attendance" && (
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th">Date</th>
                <th className="th">Check In</th>
                <th className="th">Check Out</th>
                <th className="th">Hours</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {empAttendance.slice(0, 15).map((a) => (
                <tr key={a.id}>
                  <td className="td">{formatDate(a.date)}</td>
                  <td className="td">{a.checkIn}</td>
                  <td className="td">{a.checkOut}</td>
                  <td className="td">{a.hours}h</td>
                  <td className="td">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {empAttendance.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No attendance records"
              description="This employee has no attendance records yet."
            />
          )}
        </div>
      )}

      {tab === "leave" && (
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th">Type</th>
                <th className="th">From</th>
                <th className="th">To</th>
                <th className="th">Days</th>
                <th className="th">Applied</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {empLeaves.map((l) => (
                <tr key={l.id}>
                  <td className="td">{l.leaveType}</td>
                  <td className="td">{formatDate(l.startDate)}</td>
                  <td className="td">{formatDate(l.endDate)}</td>
                  <td className="td">{l.days}</td>
                  <td className="td">{formatDate(l.appliedOn)}</td>
                  <td className="td">
                    <StatusBadge status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {empLeaves.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title="No leave records"
              description="No leave requests submitted for this employee."
            />
          )}
        </div>
      )}

      {tab === "salary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-ink dark:text-white mb-4">
              Salary Summary (Demo)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Base Salary",
                  value: employee.baseSalary,
                  tone: "text-ink dark:text-white",
                },
                {
                  label: "Allowances",
                  value: employee.allowances,
                  tone: "text-success",
                },
                {
                  label: "Deductions",
                  value: employee.deductions,
                  tone: "text-danger",
                },
                {
                  label: "Net Salary",
                  value: employee.net,
                  tone: "text-accent",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border dark:border-slate-800 p-3"
                >
                  <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">
                    {s.label}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${s.tone}`}>
                    {formatCurrency(s.value)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              All values are fictional demo data. No real payments are
              processed.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-ink dark:text-white mb-3">
              Payslip
            </h3>
            <p className="text-sm text-muted mb-4">
              Download or print a demo payslip for the current month.
            </p>
            <button
              className="btn-primary w-full"
              onClick={() => window.print()}
            >
              <FileText size={15} /> Print Payslip
            </button>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="card">
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Documents like offer letters, ID proofs, and contracts will appear here."
            action={
              <button className="btn-secondary">
                <TrendingUp size={15} /> Upload document
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
