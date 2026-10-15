import { useMemo, useState } from "react";

import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  UserMinus,
  Plus,
  Eye,
  Check,
  X,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import StatCard from "@/components/common/StatCard";

import Tabs from "@/components/common/Tabs";

import SearchInput from "@/components/common/SearchInput";

import ExportButton from "@/components/common/ExportButton";

import Avatar from "@/components/common/Avatar";

import StatusBadge from "@/components/common/StatusBadge";

import Pagination from "@/components/common/Pagination";

import Modal from "@/components/common/Modal";

import EmptyState from "@/components/common/EmptyState";

import FormInput from "@/components/forms/FormInput";

import FormSelect from "@/components/forms/FormSelect";

import { useData } from "@/context/DataContext";

import { useToast } from "@/context/ToastContext";

import { formatDate, daysBetween } from "@/utils/format";

export default function LeavesPage() {
  const data = useData() ?? {};
  const leaves = Array.isArray(data.leaves) ? data.leaves : [];
  const employees = Array.isArray(data.employees) ? data.employees : [];
  const leaveTypes = Array.isArray(data.leaveTypes) ? data.leaveTypes : [];
  const { updateLeaveStatus, addLeave } = data;

  const toast = useToast();

  const [tab, setTab] = useState("all");

  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);

  const [pageSize] = useState(10);

  const [detail, setDetail] = useState(null);

  const [reject, setReject] = useState(null);

  const [rejectReason, setRejectReason] = useState("");

  const [apply, setApply] = useState(false);

  const stats = useMemo(
    () => ({
      pending: leaves.filter((l) => l.status === "Pending").length,

      approved: leaves.filter((l) => l.status === "Approved").length,

      rejected: leaves.filter((l) => l.status === "Rejected").length,

      onLeave: employees.filter((e) => e.status === "On Leave").length,
    }),

    [leaves, employees],
  );

  const filtered = useMemo(() => {
    let list = leaves;

    if (tab === "pending") list = list.filter((l) => l.status === "Pending");

    if (tab === "approved") list = list.filter((l) => l.status === "Approved");

    if (tab === "rejected") list = list.filter((l) => l.status === "Rejected");

    if (q.trim()) {
      const t = q.toLowerCase();

      list = list.filter((l) =>
        [l.employeeName, l.leaveType, l.reason].some((v) =>
          v?.toLowerCase().includes(t),
        ),
      );
    }

    return list;
  }, [leaves, tab, q]);

  const total = filtered.length;

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const approve = (l) => {
    updateLeaveStatus(l.id, "Approved");

    toast.success(`Approved ${l.leaveType} for ${l.employeeName}.`);

    setDetail(null);
  };

  const doReject = () => {
    if (!reject) return;

    updateLeaveStatus(
      reject.id,

      "Rejected",

      rejectReason || "No reason provided",
    );

    toast.info(`Rejected leave for ${reject.employeeName}.`);

    setReject(null);

    setRejectReason("");

    setDetail(null);
  };

  const handleApply = (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const emp = employees.find((x) => x.id === fd.get("employeeId"));

    if (!emp) return;

    const start = fd.get("startDate");

    const end = fd.get("endDate");

    if (!start || !end || new Date(end) < new Date(start)) {
      toast.error("End date must be on or after start date.");

      return;
    }

    const days = daysBetween(start, end);

    addLeave({
      id: `LV-${Date.now()}`,

      employeeId: emp.id,

      employeeName: emp.name,

      department: emp.department,

      avatarColorSeed: emp.name,

      leaveType: fd.get("leaveType"),

      startDate: start,

      endDate: end,

      days,

      appliedOn: new Date().toISOString().slice(0, 10),

      reason: fd.get("reason") || "—",

      status: "Pending",
    });

    toast.success("Leave request submitted.");

    setApply(false);
  };

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Review, approve, and track employee leave requests."
        actions={
          <>
            <ExportButton
              rows={filtered.map((l) => ({
                Employee: l.employeeName,

                Type: l.leaveType,

                Start: l.startDate,

                End: l.endDate,

                Days: l.days,

                Status: l.status,
              }))}
              filename="leaves.csv"
            />

            <button className="btn-primary" onClick={() => setApply(true)}>
              <Plus size={15} /> Apply Leave
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={ClipboardList}
          label="Pending"
          value={stats.pending}
          tone="warning"
        />

        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={stats.approved}
          tone="success"
        />

        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          tone="danger"
        />

        <StatCard
          icon={UserMinus}
          label="On Leave"
          value={stats.onLeave}
          tone="accent"
        />
      </div>

      <div className="card">
        <div className="px-4 sm:px-5 pt-4">
          <Tabs
            active={tab}
            onChange={(v) => {
              setTab(v);

              setPage(1);
            }}
            tabs={[
              { value: "all", label: "All Requests", count: leaves.length },

              { value: "pending", label: "Pending", count: stats.pending },

              { value: "approved", label: "Approved", count: stats.approved },

              { value: "rejected", label: "Rejected", count: stats.rejected },
            ]}
          />
        </div>

        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);

              setPage(1);
            }}
            placeholder="Search requests..."
            className="flex-1"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No leave requests"
            description="There are no requests matching this view."
          />
        ) : (
          <div className="table-wrap !rounded-none !border-0 border-t border-border dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="th">Employee</th>

                  <th className="th">Leave Type</th>

                  <th className="th">Start</th>

                  <th className="th">End</th>

                  <th className="th">Days</th>

                  <th className="th">Applied On</th>

                  <th className="th">Status</th>

                  <th className="th text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border dark:divide-slate-800">
                {paged.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={l.employeeName} size="xs" />

                        <div>
                          <p className="font-medium text-ink dark:text-slate-100">
                            {l.employeeName}
                          </p>

                          <p className="text-[11px] text-muted">
                            {l.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="td">{l.leaveType}</td>

                    <td className="td">{formatDate(l.startDate)}</td>

                    <td className="td">{formatDate(l.endDate)}</td>

                    <td className="td">{l.days}</td>

                    <td className="td">{formatDate(l.appliedOn)}</td>

                    <td className="td">
                      <StatusBadge status={l.status} />
                    </td>

                    <td className="td text-right">
                      <div className="inline-flex gap-1">
                        <button
                          className="btn-ghost !px-2 !py-1.5"
                          onClick={() => setDetail(l)}
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>

                        {l.status === "Pending" && (
                          <>
                            <button
                              className="btn-ghost !px-2 !py-1.5 text-success"
                              onClick={() => approve(l)}
                              title="Approve"
                            >
                              <Check size={15} />
                            </button>

                            <button
                              className="btn-ghost !px-2 !py-1.5 text-danger"
                              onClick={() => setReject(l)}
                              title="Reject"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
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
        )}
      </div>

      {/* Detail modal */}

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Leave Request Details"
        footer={
          detail?.status === "Pending" && (
            <>
              <button
                className="btn-secondary"
                onClick={() => setReject(detail)}
              >
                Reject
              </button>

              <button className="btn-primary" onClick={() => approve(detail)}>
                Approve
              </button>
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={detail.employeeName} size="md" />

              <div>
                <p className="font-semibold text-ink dark:text-white">
                  {detail.employeeName}
                </p>

                <p className="text-xs text-muted">
                  {detail.department} · {detail.employeeId}
                </p>
              </div>

              <div className="ml-auto">
                <StatusBadge status={detail.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Leave Type", detail.leaveType],

                ["Days", detail.days],

                ["Start Date", formatDate(detail.startDate)],

                ["End Date", formatDate(detail.endDate)],

                ["Applied On", formatDate(detail.appliedOn)],

                ["Department", detail.department],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg border border-border dark:border-slate-800 p-3"
                >
                  <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">
                    {k}
                  </p>

                  <p className="text-sm text-ink dark:text-slate-100 mt-0.5">
                    {v}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] uppercase font-semibold text-muted tracking-wider mb-1">
                Reason
              </p>

              <p className="text-sm text-ink dark:text-slate-100">
                {detail.reason}
              </p>
            </div>

            {detail.rejectionReason && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3">
                <p className="text-[11px] uppercase font-semibold text-danger tracking-wider">
                  Rejection reason
                </p>

                <p className="text-sm text-ink dark:text-slate-100 mt-0.5">
                  {detail.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject modal */}

      <Modal
        open={!!reject}
        onClose={() => {
          setReject(null);

          setRejectReason("");
        }}
        title="Reject Leave Request"
        size="sm"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                setReject(null);

                setRejectReason("");
              }}
            >
              Cancel
            </button>

            <button className="btn-danger" onClick={doReject}>
              Reject request
            </button>
          </>
        }
      >
        <p className="text-sm text-muted dark:text-slate-400 mb-4">
          Provide a reason for rejecting {reject?.employeeName}&apos;s request.
        </p>

        <label className="label">Rejection reason</label>

        <textarea
          rows="3"
          className="input"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Insufficient team coverage"
        />
      </Modal>

      {/* Apply modal */}

      <Modal
        open={apply}
        onClose={() => setApply(false)}
        title="Apply for Leave"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setApply(false)}>
              Cancel
            </button>

            <button form="leave-form" type="submit" className="btn-primary">
              Submit request
            </button>
          </>
        }
      >
        <form id="leave-form" onSubmit={handleApply} className="space-y-4">
          <FormSelect label="Employee" name="employeeId" required>
            <option value="">Select employee…</option>

            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.id})
              </option>
            ))}
          </FormSelect>

          <FormSelect label="Leave Type" name="leaveType" required>
            {leaveTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </FormSelect>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
            />

            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div>
            <label className="label">Reason</label>

            <textarea
              rows="3"
              name="reason"
              className="input"
              placeholder="Briefly explain the reason..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
