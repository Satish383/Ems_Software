import { useMemo, useState } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Archive,
  Users,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import DropdownMenu from "@/components/common/DropdownMenu";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";

export default function DepartmentsPage() {
  const { departments, employees, addDepartment, updateDepartment } = useData();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null); // {mode: 'add'|'edit', dept?}
  const [confirm, setConfirm] = useState(null);

  const enriched = useMemo(() => {
    return departments.map((d) => {
      const staff = employees.filter((e) => e.department === d.name);
      return { ...d, employeesCount: staff.length };
    });
  }, [departments, employees]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((d) =>
        [d.name, d.head, d.description].some((v) =>
          v?.toLowerCase().includes(t),
        ),
      );
    }
    if (status) list = list.filter((d) => d.status === status);
    return list;
  }, [enriched, q, status]);

  const handleSave = (values) => {
    if (modal.mode === "add") {
      addDepartment({
        ...values,
        status: "Active",
        head: values.head || "Unassigned",
      });
      toast.success("Department created successfully.");
    } else {
      updateDepartment(modal.dept.id, values);
      toast.success("Department updated successfully.");
    }
    setModal(null);
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle={`${departments.length} departments across the organization.`}
        actions={
          <button
            className="btn-primary"
            onClick={() => setModal({ mode: "add" })}
          >
            <Plus size={15} /> Add Department
          </button>
        }
      />

      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search departments..."
          className="flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input !py-2.5 min-w-[150px]"
        >
          <option value="">Status: All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Building2}
            title="No departments found"
            description="Try adjusting your search."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="card p-5 hover:shadow-elevated transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-navy-50 dark:bg-navy-900/40 text-navy-900 dark:text-blue-200 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <DropdownMenu
                  trigger={
                    <span className="p-1.5 rounded-lg inline-flex hover:bg-surface dark:hover:bg-slate-800">
                      <MoreVertical size={16} />
                    </span>
                  }
                  items={[
                    {
                      label: "Edit",
                      icon: Pencil,
                      onClick: () => setModal({ mode: "edit", dept: d }),
                    },
                    {
                      label: "Archive",
                      icon: Archive,
                      danger: true,
                      onClick: () => setConfirm(d),
                    },
                  ]}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink dark:text-white truncate">
                    {d.name}
                  </h3>
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-1 text-xs text-muted dark:text-slate-400 line-clamp-2 min-h-[32px]">
                  {d.description}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Avatar name={d.head} size="xs" />
                  <span className="truncate">{d.head}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink dark:text-slate-200">
                  <Users size={13} /> {d.employeesCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Department" : "Add Department"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button form="dept-form" type="submit" className="btn-primary">
              {modal?.mode === "edit" ? "Save changes" : "Create department"}
            </button>
          </>
        }
      >
        <form
          id="dept-form"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSave({
              name: fd.get("name"),
              code: fd.get("code"),
              head: fd.get("head"),
              description: fd.get("description"),
            });
          }}
          className="space-y-4"
        >
          <FormInput
            label="Department name"
            name="name"
            required
            defaultValue={modal?.dept?.name || ""}
          />
          <FormInput
            label="Code"
            name="code"
            required
            placeholder="e.g. ENG"
            defaultValue={modal?.dept?.code || ""}
          />
          <FormInput
            label="Department head"
            name="head"
            placeholder="e.g. Aarav Sharma"
            defaultValue={modal?.dept?.head || ""}
          />
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows="3"
              defaultValue={modal?.dept?.description || ""}
              className="input"
              placeholder="What does this department do?"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            updateDepartment(confirm.id, { status: "Inactive" });
            toast.info(`${confirm.name} archived.`);
          }
        }}
        title="Archive department?"
        message={`This will mark ${confirm?.name} as Inactive. Employees will not be reassigned in this demo.`}
        confirmLabel="Archive"
      />
    </div>
  );
}
