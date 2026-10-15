import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Upload } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import Avatar from "@/components/common/Avatar";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";

const Section = ({ title, subtitle, children }) => (
  <div className="card p-5 sm:p-6">
    <div className="mb-5">
      <h3 className="text-base font-semibold text-ink dark:text-white">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-muted dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

export default function AddEmployeePage() {
  const { employees, departments, designations, addEmployee } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  const nextId = useMemo(() => {
    const nums = employees.map(
      (e) => parseInt(e.id.replace(/\D/g, ""), 10) || 0,
    );
    const max = nums.length ? Math.max(...nums) : 1000;
    return `EMP-${String(max + 1).padStart(4, "0")}`;
  }, [employees]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: "Active",
      employmentType: "Full-time",
      gender: "Female",
      joiningDate: new Date().toISOString().slice(0, 10),
    },
  });

  const first = watch("firstName") || "";
  const last = watch("lastName") || "";
  const previewName = `${first} ${last}`.trim() || "New Employee";

  const onSubmit = async (v) => {
    await new Promise((r) => setTimeout(r, 400));
    const base = 60000 + Math.floor(Math.random() * 50000);
    const allowances = Math.round(base * 0.12);
    const deductions = Math.round(base * 0.08);
    const emp = {
      id: nextId,
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      name: `${v.firstName.trim()} ${v.lastName.trim()}`,
      email: v.email.trim(),
      phone: v.phone.trim(),
      dob: v.dob,
      gender: v.gender,
      department: v.department,
      designation: v.designation,
      employmentType: v.employmentType,
      status: v.status,
      joiningDate: v.joiningDate,
      reportingManager: v.reportingManager || "—",
      address: v.address || "",
      city: v.city || "",
      state: v.state || "",
      postalCode: v.postalCode || "",
      emergencyContact: v.emergencyContact || "",
      baseSalary: base,
      allowances,
      deductions,
      gross: base + allowances,
      net: base + allowances - deductions,
      performanceRating: 3.5,
      avatarColorSeed: `${v.firstName} ${v.lastName}`,
    };
    addEmployee(emp);
    toast.success(`${emp.name} added successfully as ${emp.id}.`);
    navigate(`/employees/${emp.id}`);
  };

  return (
    <div>
      <PageHeader
        title="Add New Employee"
        subtitle="Create a new employee profile. Fields marked * are required."
        actions={
          <Link to="/employees" className="btn-ghost">
            <ArrowLeft size={15} /> Back to directory
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Section
          title="Profile Photo"
          subtitle="Optional — a placeholder will be shown if skipped."
        >
          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-5">
            <Avatar name={previewName} size="xl" src={photo} />
            <div>
              <label className="btn-secondary cursor-pointer">
                <Upload size={15} /> Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {photo && (
                <button
                  type="button"
                  className="btn-ghost text-xs ml-2"
                  onClick={() => setPhoto(null)}
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-muted mt-2">
                JPG or PNG, max 2MB. Stored locally in the demo.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Personal Information"
          subtitle="Basic identity and contact details."
        >
          <FormInput
            label="First name"
            required
            error={errors.firstName?.message}
            {...register("firstName", { required: "First name is required" })}
          />
          <FormInput
            label="Last name"
            required
            error={errors.lastName?.message}
            {...register("lastName", { required: "Last name is required" })}
          />
          <FormInput
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
          />
          <FormInput
            label="Phone"
            required
            error={errors.phone?.message}
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[+()\-\s\d]{7,20}$/,
                message: "Enter a valid phone number",
              },
            })}
          />
          <FormInput
            label="Date of birth"
            type="date"
            required
            error={errors.dob?.message}
            {...register("dob", { required: "Date of birth is required" })}
          />
          <FormSelect label="Gender" required {...register("gender")}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </FormSelect>
        </Section>

        <Section
          title="Employment Information"
          subtitle="Role, department, and status."
        >
          <div>
            <label className="label">Employee ID</label>
            <input
              className="input !bg-surface dark:!bg-slate-800 font-mono"
              value={nextId}
              readOnly
            />
            <p className="text-xs text-muted mt-1">
              Auto-generated. Read-only in this demo.
            </p>
          </div>
          <FormInput
            label="Joining date"
            type="date"
            required
            error={errors.joiningDate?.message}
            {...register("joiningDate", {
              required: "Joining date is required",
            })}
          />
          <FormSelect
            label="Department"
            required
            error={errors.department?.message}
            {...register("department", { required: "Department is required" })}
          >
            <option value="">Select department…</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </FormSelect>
          <FormSelect
            label="Designation"
            required
            error={errors.designation?.message}
            {...register("designation", {
              required: "Designation is required",
            })}
          >
            <option value="">Select designation…</option>
            {designations.map((d) => (
              <option key={d.id} value={d.title}>
                {d.title}
              </option>
            ))}
          </FormSelect>
          <FormInput
            label="Reporting manager"
            placeholder="e.g. Aarav Sharma"
            {...register("reportingManager")}
          />
          <FormSelect label="Employment type" {...register("employmentType")}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Intern</option>
          </FormSelect>
          <FormSelect label="Employment status" {...register("status")}>
            <option>Active</option>
            <option>Probation</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </FormSelect>
        </Section>

        <Section
          title="Additional Information"
          subtitle="Address and emergency contact."
        >
          <FormInput
            label="Address"
            className="sm:col-span-2 lg:col-span-3"
            placeholder="Street address"
            {...register("address")}
          />
          <FormInput label="City" {...register("city")} />
          <FormInput label="State" {...register("state")} />
          <FormInput label="Postal code" {...register("postalCode")} />
          <FormInput
            label="Emergency contact"
            placeholder="+1 (415) 555-0100"
            {...register("emergencyContact")}
          />
        </Section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          <Link to="/employees" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <Save size={15} /> {isSubmitting ? "Saving…" : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
