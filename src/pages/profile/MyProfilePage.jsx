import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Save,
  Key,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import FormInput from "@/components/forms/FormInput";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function MyProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [pwdOpen, setPwdOpen] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 (415) 555-0142",
      role: user?.role || "",
      department: "Human Resources",
      designation: "HR Administrator",
      location: "San Francisco, CA",
    },
  });

  const pwdForm = useForm();

  const onSubmitProfile = async () => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Profile updated (demo).");
  };

  const onSubmitPassword = async () => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Password changed (demo — nothing was actually saved).");
    pwdForm.reset();
    setPwdOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 flex flex-col items-center text-center">
          <Avatar name={user?.name || "User"} size="xl" />
          <h3 className="mt-4 text-lg font-bold text-ink dark:text-white">
            {user?.name}
          </h3>
          <p className="text-sm text-muted dark:text-slate-400">{user?.role}</p>
          <div className="mt-5 w-full space-y-2 text-left">
            {[
              { icon: Mail, value: user?.email },
              { icon: Phone, value: "+1 (415) 555-0142" },
              { icon: Building2, value: "Human Resources" },
              { icon: Briefcase, value: "HR Administrator" },
              { icon: MapPin, value: "San Francisco, CA" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm text-muted dark:text-slate-400"
              >
                <row.icon size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{row.value}</span>
              </div>
            ))}
          </div>
          <button
            className="btn-secondary mt-5 w-full"
            onClick={() => setPwdOpen(true)}
          >
            <Key size={15} /> Change password
          </button>
        </div>

        <form
          onSubmit={profileForm.handleSubmit(onSubmitProfile)}
          className="card p-5 sm:p-6 lg:col-span-2 space-y-4"
        >
          <h3 className="text-base font-semibold text-ink dark:text-white">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full name"
              {...profileForm.register("name", { required: true })}
            />
            <FormInput
              label="Email"
              type="email"
              {...profileForm.register("email", { required: true })}
            />
            <FormInput label="Phone" {...profileForm.register("phone")} />
            <FormInput
              label="Role"
              readOnly
              {...profileForm.register("role")}
            />
            <FormInput
              label="Department"
              {...profileForm.register("department")}
            />
            <FormInput
              label="Designation"
              {...profileForm.register("designation")}
            />
            <FormInput
              label="Location"
              className="sm:col-span-2"
              {...profileForm.register("location")}
            />
          </div>
          <div className="flex justify-end">
            <button className="btn-primary" type="submit">
              <Save size={15} /> Save changes
            </button>
          </div>
        </form>
      </div>

      <Modal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        title="Change Password"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setPwdOpen(false)}>
              Cancel
            </button>
            <button form="pwd-form" type="submit" className="btn-primary">
              Update password
            </button>
          </>
        }
      >
        <form
          id="pwd-form"
          onSubmit={pwdForm.handleSubmit(onSubmitPassword)}
          className="space-y-4"
        >
          <FormInput
            label="Current password"
            type="password"
            {...pwdForm.register("current", { required: "Required" })}
          />
          <FormInput
            label="New password"
            type="password"
            {...pwdForm.register("next", {
              required: "Required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
            error={pwdForm.formState.errors.next?.message}
          />
          <FormInput
            label="Confirm new password"
            type="password"
            {...pwdForm.register("confirm", { required: "Required" })}
          />
        </form>
      </Modal>
    </div>
  );
}
