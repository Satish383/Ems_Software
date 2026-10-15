import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  Eye,
  Pencil,
  Archive,
  Trash2,
  Users,
  ArrowUpDown,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import ExportButton from "@/components/common/ExportButton";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import DropdownMenu from "@/components/common/DropdownMenu";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils/format";

const VIEW_KEY = "employeehub.employees.view";

export default function EmployeesPage() {
  const {
    employees,
    departments,
    designations,
    archiveEmployee,
    deleteEmployee,
  } = useData();
  const toast = useToast();

  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [desig, setDesig] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState(localStorage.getItem(VIEW_KEY) || "table");
  const [confirm, setConfirm] = useState(null);

  const setViewPersist = (v) => {
    setView(v);
    localStorage.setItem(VIEW_KEY, v);
  };

  const filtered = useMemo(() => {
    let list = employees;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((e) =>
        [e.name, e.email, e.id].some((v) => v?.toLowerCase().includes(t)),
      );
    }
    if (dept) list = list.filter((e) => e.department === dept);
    if (desig) list = list.filter((e) => e.designation === desig);
    if (status) list = list.filter((e) => e.status === status);

    const dir = sort.dir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = (a[sort.key] ?? "").toString().toLowerCase();
      const bv = (b[sort.key] ?? "").toString().toLowerCase();
      return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
    });
    return list;
  }, [employees, q, dept, desig, status, sort]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));

  const allChecked =
    paged.length > 0 && paged.every((e) => selected.includes(e.id));
  const toggleAll = () =>
    setSelected(
      allChecked
        ? selected.filter((id) => !paged.some((e) => e.id === id))
        : [...new Set([...selected, ...paged.map((e) => e.id)])],
    );
  const toggleOne = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const handleArchive = (emp) => setConfirm({ type: "archive", emp });
  const handleDelete = (emp) => setConfirm({ type: "delete", emp });

  const runConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "archive") {
      archiveEmployee(confirm.emp.id);
      toast.success(`${confirm.emp.name} has been archived.`);
    } else {
      deleteEmployee(confirm.emp.id);
      toast.success(`${confirm.emp.name} has been permanently removed.`);
    }
  };

  const resetFilters = () => {
    setQ("");
    setDept("");
    setDesig("");
    setStatus("");
    setPage(1);
  };

  const deptOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
  }));
  const desigOptions = designations.map((d) => ({
    value: d.title,
    label: d.title,
  }));

  return (
    <div>
      <PageHeader
        title="Employee Directory"
        subtitle={`${employees.length} employees in the organization.`}
        actions={
          <>
            <ExportButton
              rows={filtered.map((e) => ({
                ID: e.id,
                Name: e.name,
                Email: e.email,
                Department: e.department,
                Designation: e.designation,
                Status: e.status,
                Joined: e.joiningDate,
              }))}
              filename="employees.csv"
            />
            <Link to="/employees/new" className="btn-primary">
              <Plus size={15} /> Add Employee
            </Link>
          </>
        }
      />

      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              setPage(1);
            }}
            placeholder="Search by name, ID, or email..."
            className="flex-1"
          />
          <FilterDropdown
            label="Department"
            value={dept}
            onChange={(v) => {
              setDept(v);
              setPage(1);
            }}
            options={deptOptions}
          />
          <FilterDropdown
            label="Designation"
            value={desig}
            onChange={(v) => {
              setDesig(v);
              setPage(1);
            }}
            options={desigOptions}
          />
          <FilterDropdown
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={["Active", "On Leave", "Probation", "Inactive"]}
          />
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border dark:border-slate-700 p-0.5">
              <button
                onClick={() => setViewPersist("table")}
                className={`p-2 rounded-md ${view === "table" ? "bg-navy-900 dark:bg-accent text-white" : "text-muted hover:text-ink dark:hover:text-white"}`}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewPersist("grid")}
                className={`p-2 rounded-md ${view === "grid" ? "bg-navy-900 dark:bg-accent text-white" : "text-muted hover:text-ink dark:hover:text-white"}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            {(q || dept || desig || status) && (
              <button onClick={resetFilters} className="btn-ghost text-xs">
                Reset
              </button>
            )}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 px-3 py-2">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
              {selected.length} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary !py-1.5 !px-3 !text-xs"
                onClick={() => {
                  selected.forEach(archiveEmployee);
                  toast.success(`Archived ${selected.length} employees`);
                  setSelected([]);
                }}
              >
                <Archive size={13} /> Archive
              </button>
              <button
                className="btn-ghost !py-1.5 !px-3 !text-xs text-danger"
                onClick={() => setSelected([])}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="No employees found"
            description="Try adjusting your search or filter criteria."
            action={
              <button className="btn-secondary" onClick={resetFilters}>
                Reset filters
              </button>
            }
          />
        </div>
      ) : view === "table" ? (
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                {[
                  { key: "name", label: "Employee" },
                  { key: "id", label: "Employee ID" },
                  { key: "department", label: "Department" },
                  { key: "designation", label: "Designation" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "joiningDate", label: "Joining Date" },
                  { key: "status", label: "Status" },
                ].map((c) => (
                  <th key={c.key} className="th">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-ink dark:hover:text-white"
                    >
                      {c.label}{" "}
                      <ArrowUpDown
                        size={12}
                        className={
                          sort.key === c.key ? "text-accent" : "opacity-40"
                        }
                      />
                    </button>
                  </th>
                ))}
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {paged.map((e) => (
                <tr
                  key={e.id}
                  className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                >
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={selected.includes(e.id)}
                      onChange={() => toggleOne(e.id)}
                      aria-label={`Select ${e.name}`}
                    />
                  </td>
                  <td className="td">
                    <Link
                      to={`/employees/${e.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar name={e.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink dark:text-slate-100 group-hover:text-accent truncate">
                          {e.name}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          {e.employmentType}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="td font-mono text-xs">{e.id}</td>
                  <td className="td">{e.department}</td>
                  <td className="td">{e.designation}</td>
                  <td className="td text-muted">{e.email}</td>
                  <td className="td text-muted">{e.phone}</td>
                  <td className="td">{formatDate(e.joiningDate)}</td>
                  <td className="td">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="td text-right">
                    <DropdownMenu
                      trigger={
                        <span className="p-1.5 rounded-lg inline-flex hover:bg-surface dark:hover:bg-slate-800">
                          <MoreVertical size={16} />
                        </span>
                      }
                      items={[
                        {
                          label: "View details",
                          icon: Eye,
                          onClick: () =>
                            (window.location.href = `/employees/${e.id}`),
                        },
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () =>
                            (window.location.href = `/employees/${e.id}`),
                        },
                        { divider: true },
                        {
                          label: "Archive",
                          icon: Archive,
                          onClick: () => handleArchive(e),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDelete(e),
                        },
                      ]}
                    />
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
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paged.map((e) => (
              <div
                key={e.id}
                className="card p-5 hover:shadow-elevated transition"
              >
                <div className="flex items-start justify-between">
                  <Avatar name={e.name} size="lg" />
                  <DropdownMenu
                    trigger={
                      <span className="p-1.5 rounded-lg inline-flex hover:bg-surface dark:hover:bg-slate-800">
                        <MoreVertical size={16} />
                      </span>
                    }
                    items={[
                      {
                        label: "View details",
                        icon: Eye,
                        onClick: () =>
                          (window.location.href = `/employees/${e.id}`),
                      },
                      {
                        label: "Archive",
                        icon: Archive,
                        onClick: () => handleArchive(e),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        danger: true,
                        onClick: () => handleDelete(e),
                      },
                    ]}
                  />
                </div>
                <Link to={`/employees/${e.id}`} className="block mt-3">
                  <p className="font-semibold text-ink dark:text-white truncate">
                    {e.name}
                  </p>
                  <p className="text-xs text-muted truncate">{e.designation}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted font-mono">
                    {e.id}
                  </span>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-3 text-xs text-muted truncate">
                  {e.department}
                </p>
                <p className="text-xs text-muted truncate">{e.email}</p>
              </div>
            ))}
          </div>
          <div className="card mt-4">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        title={
          confirm?.type === "delete" ? "Delete employee?" : "Archive employee?"
        }
        message={
          confirm?.type === "delete"
            ? `This will permanently remove ${confirm?.emp?.name} from the directory. This cannot be undone.`
            : `This will set ${confirm?.emp?.name}'s status to Inactive. You can reactivate them later.`
        }
        confirmLabel={confirm?.type === "delete" ? "Delete" : "Archive"}
      />
    </div>
  );
}
