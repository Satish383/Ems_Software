import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Upload, X } from "lucide-react";
import Modal from "@/components/common/Modal";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import Avatar from "@/components/common/Avatar";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";

export default function EditEmployeeModal({ open, onClose, employee }) {
  const { departments, designations, updateEmployee } = useData();
  const toast = useToast();
  const [photo, setPhoto] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset the form whenever the modal opens with a new employee
  useEffect(() => {
    if (open && employee) {
      reset({
        firstName: employee.firstName || employee.name?.split(" ")[0] || "",
        lastName:
          employee.lastName ||
          employee.name?.split(" ").slice(1).join(" ") ||
          "",
        email: employee.email || "",
        phone: employee.phone || "",
        dob: employee.dob || "",
        gender: employee.gender || "Female",
        department: employee.department || "",
        designation: employee.designation || "",
        reportingManager: employee.reportingManager || "",
        employmentType: employee.employmentType || "Full-time",
        status: employee.status || "Active",
        joiningDate: employee.joiningDate || "",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        postalCode: employee.postalCode || "",
        emergencyContact: employee.emergencyContact || "",
      });
      setPhoto(null);
    }
  }, [open, employee, reset]);

  const first = watch("firstName") || "";
  const last = watch("lastName") || "";
  const previewName = `${first} ${last}`.trim() || employee?.name || "Employee";

  const onSubmit = async (values) => {
    if (!employee) return;
    await new Promise((r) => setTimeout(r, 350));

    const updated = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      email: values.email.trim(),
      phone: values.phone.trim(),
      dob: values.dob,
      gender: values.gender,
      department: values.department,
      designation: values.designation,
      reportingManager: values.reportingManager || "—",
      employmentType: values.employmentType,
      status: values.status,
      joiningDate: values.joiningDate,
      address: values.address || "",
      city: values.city || "",
      state: values.state || "",
      postalCode: values.postalCode || "",
      emergencyContact: values.emergencyContact || "",
      avatarColorSeed: `${values.firstName} ${values.lastName}`,
    };

    if (photo) updated.avatar = photo;

    updateEmployee(employee.id, updated);
    toast.success(`${updated.name}'s profile updated successfully.`);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Profile — ${employee?.name || ""}`}
      size="xl"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            form="edit-employee-form"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            <Save size={15} /> {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </>
      }
    >
      <form
        id="edit-employee-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* -------------------- PHOTO -------------------- */}
        <section>
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">
            Profile Photo
          </h3>
          <div className="flex items-center gap-5">
            <Avatar
              name={previewName}
              size="xl"
              src={photo || employee?.avatar}
            />
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
                  <X size={13} /> Remove
                </button>
              )}
              <p className="text-xs text-muted dark:text-slate-500 mt-2">
                JPG or PNG, max 2MB. Stored locally in this demo.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------- PERSONAL -------------------- */}
        <section>
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </section>

        {/* -------------------- EMPLOYMENT -------------------- */}
        <section>
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">
            Employment Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Employee ID</label>
              <input
                className="input !bg-surface dark:!bg-slate-800 font-mono"
                value={employee?.id || ""}
                readOnly
              />
              <p className="text-xs text-muted mt-1">Read-only in this demo.</p>
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
              {...register("department", {
                required: "Department is required",
              })}
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
          </div>
        </section>

        {/* -------------------- ADDITIONAL -------------------- */}
        <section>
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </section>
      </form>
    </Modal>
  );
}
