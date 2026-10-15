import { useMemo, useState } from "react";
import {
  Wallet,
  Users,
  Clock3,
  DollarSign,
  Eye,
  Download,
  FileText,
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
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/format";

export default function PayrollPage() {
  const { employees } = useData();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [view, setView] = useState(null);
  const [month, setMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" }),
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [generated, setGenerated] = useState(true);

  const records = useMemo(() => {
    return employees.map((e, i) => ({
      ...e,
      month,
      year,
      status: ["Paid", "Paid", "Pending", "Paid"][i % 4],
    }));
  }, [employees, month, year]);

  const stats = useMemo(
    () => ({
      totalPayroll: records.reduce((s, r) => s + r.net, 0),
      processed: records.filter((r) => r.status === "Paid").length,
      pending: records.filter((r) => r.status === "Pending").length,
      avg: records.length
        ? Math.round(records.reduce((s, r) => s + r.net, 0) / records.length)
        : 0,
    }),
    [records],
  );

  const filtered = useMemo(() => {
    let list = records;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((r) =>
        [r.name, r.id].some((v) => v?.toLowerCase().includes(t)),
      );
    }
    if (dept) list = list.filter((r) => r.department === dept);
    return list;
  }, [records, q, dept]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const depts = [...new Set(employees.map((e) => e.department))];

  const generate = () => {
    setGenerated(true);
    toast.success(`Payroll generated for ${month} ${year} (demo).`);
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Manage salary processing and payslips. All values are fictional demo data."
        actions={
          <>
            <ExportButton
              rows={filtered.map((r) => ({
                ID: r.id,
                Employee: r.name,
                Department: r.department,
                Base: r.baseSalary,
                Allowances: r.allowances,
                Deductions: r.deductions,
                Gross: r.gross,
                Net: r.net,
                Status: r.status,
              }))}
              filename={`payroll-${month}-${year}.csv`}
            />
            <button className="btn-primary" onClick={generate}>
              <FileText size={15} /> Generate Payroll
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={Wallet}
          label="Total Monthly Payroll"
          value={formatCurrency(stats.totalPayroll)}
          tone="navy"
        />
        <StatCard
          icon={Users}
          label="Employees Processed"
          value={stats.processed}
          tone="success"
        />
        <StatCard
          icon={Clock3}
          label="Pending Payments"
          value={stats.pending}
          tone="warning"
        />
        <StatCard
          icon={DollarSign}
          label="Average Salary"
          value={formatCurrency(stats.avg)}
          tone="accent"
        />
      </div>

      <div className="card p-4 mb-4 flex flex-col lg:flex-row gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input !py-2.5 min-w-[160px]"
        >
          {[
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
          ].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="input !py-2.5 min-w-[120px]"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search by name or ID..."
          className="flex-1"
        />
        <select
          value={dept}
          onChange={(e) => {
            setDept(e.target.value);
            setPage(1);
          }}
          className="input !py-2.5 min-w-[180px]"
        >
          <option value="">Department: All</option>
          {depts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {!generated ? (
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="Payroll not generated"
            description="Generate payroll to see records for this month."
            action={
              <button className="btn-primary" onClick={generate}>
                Generate Payroll
              </button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={Wallet} title="No payroll records" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th">Employee</th>
                <th className="th">Department</th>
                <th className="th">Base</th>
                <th className="th">Allowances</th>
                <th className="th">Deductions</th>
                <th className="th">Gross</th>
                <th className="th">Net</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {paged.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                >
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.name} size="xs" />
                      <div>
                        <p className="font-medium text-ink dark:text-slate-100">
                          {r.name}
                        </p>
                        <p className="text-[11px] text-muted font-mono">
                          {r.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="td">{r.department}</td>
                  <td className="td">{formatCurrency(r.baseSalary)}</td>
                  <td className="td text-success">
                    +{formatCurrency(r.allowances)}
                  </td>
                  <td className="td text-danger">
                    −{formatCurrency(r.deductions)}
                  </td>
                  <td className="td">{formatCurrency(r.gross)}</td>
                  <td className="td font-semibold">{formatCurrency(r.net)}</td>
                  <td className="td">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="td text-right">
                    <button
                      className="btn-ghost !px-2 !py-1.5"
                      onClick={() => setView(r)}
                      title="View payslip"
                    >
                      <Eye size={15} />
                    </button>
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
      )}

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title="Payslip Preview"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setView(null)}>
              Close
            </button>
            <button className="btn-primary" onClick={() => window.print()}>
              <Download size={15} /> Print / Save
            </button>
          </>
        }
      >
        {view && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                  EmployeeHub Inc.
                </p>
                <p className="text-lg font-bold text-ink dark:text-white mt-1">
                  {view.name}
                </p>
                <p className="text-xs text-muted font-mono">
                  {view.id} · {view.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                  Payslip Period
                </p>
                <p className="text-sm font-semibold text-ink dark:text-slate-100">
                  {view.month} {view.year}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border dark:border-slate-800 divide-y divide-border dark:divide-slate-800">
              {[
                ["Base Salary", formatCurrency(view.baseSalary)],
                ["Allowances", `+ ${formatCurrency(view.allowances)}`],
                ["Deductions", `− ${formatCurrency(view.deductions)}`],
                ["Gross Salary", formatCurrency(view.gross)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between px-4 py-2.5 text-sm"
                >
                  <span className="text-muted dark:text-slate-400">{k}</span>
                  <span className="text-ink dark:text-slate-100 font-medium">
                    {v}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-blue-50 dark:bg-blue-950/40 rounded-b-lg">
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  Net Pay
                </span>
                <span className="text-base font-bold text-blue-900 dark:text-blue-200">
                  {formatCurrency(view.net)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted">
              Demo payslip — not a real payment document.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
