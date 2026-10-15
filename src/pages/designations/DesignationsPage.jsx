import { useMemo, useState } from "react";
import { Plus, MoreVertical, Pencil, Archive, BadgeCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import DropdownMenu from "@/components/common/DropdownMenu";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";

export default function DesignationsPage() {
  const { designations, departments, addDesignation, updateDesignation } =
    useData();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(() => {
    let list = designations;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((d) =>
        [d.title, d.department, d.description].some((v) =>
          v?.toLowerCase().includes(t),
        ),
      );
    }
    if (dept) list = list.filter((d) => d.department === dept);
    return list;
  }, [designations, q, dept]);

  const handleSave = (v) => {
    if (modal.mode === "add") {
      addDesignation({ ...v, employees: 0 });
      toast.success("Designation created successfully.");
    } else {
      updateDesignation(modal.d.title, v);
      toast.success("Designation updated successfully.");
    }
    setModal(null);
  };

  const idOf = (d) => d.id;

  return (
    <div>
      <PageHeader
        title="Designations"
        subtitle={`${designations.length} roles defined across departments.`}
        actions={
          <button
            className="btn-primary"
            onClick={() => setModal({ mode: "add" })}
          >
            <Plus size={15} /> Add Designation
          </button>
        }
      />

      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search designations..."
          className="flex-1"
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="input !py-2.5 min-w-[180px]"
        >
          <option value="">Department: All</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={BadgeCheck} title="No designations found" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th">Designation</th>
                <th className="th">Department</th>
                <th className="th">Level</th>
                <th className="th">Employees</th>
                <th className="th">Description</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {filtered.map((d) => (
                <tr
                  key={idOf(d)}
                  className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                >
                  <td className="td font-semibold text-ink dark:text-slate-100">
                    {d.title}
                  </td>
                  <td className="td">{d.department}</td>
                  <td className="td">
                    <span className="badge bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
                      {d.level}
                    </span>
                  </td>
                  <td className="td">{d.employees}</td>
                  <td className="td text-muted max-w-xs truncate">
                    {d.description}
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
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => setModal({ mode: "edit", d }),
                        },
                        {
                          label: "Archive",
                          icon: Archive,
                          danger: true,
                          onClick: () => setConfirm(d),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Designation" : "Add Designation"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button form="desig-form" type="submit" className="btn-primary">
              {modal?.mode === "edit" ? "Save changes" : "Create designation"}
            </button>
          </>
        }
      >
        <form
          id="desig-form"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSave({
              title: fd.get("title"),
              department: fd.get("department"),
              level: fd.get("level"),
              description: fd.get("description"),
            });
          }}
          className="space-y-4"
        >
          <FormInput
            label="Title"
            name="title"
            required
            defaultValue={modal?.d?.title || ""}
          />
          <FormSelect
            label="Department"
            name="department"
            defaultValue={modal?.d?.department || ""}
            required
          >
            <option value="">Select department…</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </FormSelect>
          <FormSelect
            label="Level"
            name="level"
            defaultValue={modal?.d?.level || "Mid"}
          >
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
            <option>Lead</option>
            <option>Executive</option>
          </FormSelect>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows="3"
              className="input"
              defaultValue={modal?.d?.description || ""}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            updateDesignation(confirm.id, {
              employees: 0,
              description: "[Archived] " + confirm.description,
            });
            toast.info(`${confirm.title} archived.`);
          }
        }}
        title="Archive designation?"
        message={`This will archive ${confirm?.title}. Existing employees will keep their title.`}
        confirmLabel="Archive"
      />
    </div>
  );
}
