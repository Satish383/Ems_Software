import { useState } from "react";
import {
  Save,
  User,
  Building2,
  Palette,
  Bell,
  Clock,
  ClipboardList,
  Info,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Tabs from "@/components/common/Tabs";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useData } from "@/context/DataContext";
import { mockDB } from "@/services/mock/db";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const { resetDemoData } = useData();

  const save = (e) => {
    e?.preventDefault();
    toast.success("Settings saved (demo only).");
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your workspace preferences."
      />

      <div className="mb-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 flex gap-3">
        <Info size={18} className="text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <span className="font-semibold">Demo-only settings.</span> Some
          preferences are saved locally in your browser. Production settings
          like billing, security policies, and integrations would require a
          backend.
        </p>
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "profile", label: "My Profile" },
          { value: "company", label: "Company" },
          { value: "appearance", label: "Appearance" },
          { value: "notifications", label: "Notifications" },
          { value: "schedule", label: "Work Schedule" },
          { value: "leavetypes", label: "Leave Types" },
        ]}
      />

      <div className="mt-5">
        {tab === "profile" && (
          <form onSubmit={save} className="card p-5 sm:p-6 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <User size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                My Profile
              </h3>
            </div>
            <FormInput label="Full name" defaultValue={user?.name} />
            <FormInput label="Email" type="email" defaultValue={user?.email} />
            <FormInput label="Role" defaultValue={user?.role} readOnly />
            <button type="submit" className="btn-primary">
              <Save size={15} /> Save changes
            </button>
          </form>
        )}

        {tab === "company" && (
          <form onSubmit={save} className="card p-5 sm:p-6 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Company Information
              </h3>
            </div>
            <FormInput
              label="Company name"
              defaultValue={mockDB.company.name}
            />
            <FormInput
              label="Legal name"
              defaultValue={mockDB.company.legalName}
            />
            <FormInput
              label="Email"
              type="email"
              defaultValue={mockDB.company.email}
            />
            <FormInput label="Phone" defaultValue={mockDB.company.phone} />
            <FormInput label="Website" defaultValue={mockDB.company.website} />
            <FormInput label="Address" defaultValue={mockDB.company.address} />
            <FormInput
              label="Tax ID (demo)"
              defaultValue={mockDB.company.taxId}
              readOnly
            />
            <button type="submit" className="btn-primary">
              <Save size={15} /> Save changes
            </button>
          </form>
        )}

        {tab === "appearance" && (
          <div className="card p-5 sm:p-6 space-y-5 max-w-2xl">
            <div className="flex items-center gap-3">
              <Palette size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Appearance
              </h3>
            </div>
            <div>
              <p className="label">Theme</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {["light", "dark"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`rounded-xl border p-4 text-left transition ${theme === t ? "border-accent ring-2 ring-accent/30" : "border-border dark:border-slate-700 hover:border-slate-300"}`}
                  >
                    <div
                      className={`h-12 rounded-lg mb-2 ${t === "dark" ? "bg-slate-900" : "bg-slate-100"}`}
                    />
                    <p className="text-sm font-semibold text-ink dark:text-slate-100 capitalize">
                      {t}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="card p-5 sm:p-6 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Notifications
              </h3>
            </div>
            {[
              [
                "Leave request updates",
                "Get notified when a leave is approved or rejected.",
              ],
              [
                "New employee added",
                "Receive an alert when a new team member joins.",
              ],
              ["Payroll reminders", "Remind me before monthly payroll runs."],
              [
                "Performance reviews",
                "Notify me about review cycles and due dates.",
              ],
            ].map(([title, desc]) => (
              <label
                key={title}
                className="flex items-start gap-3 rounded-lg border border-border dark:border-slate-800 p-3.5 cursor-pointer hover:bg-surface/60 dark:hover:bg-slate-800/40"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 rounded border-border text-accent focus:ring-accent/40"
                />
                <div>
                  <p className="text-sm font-medium text-ink dark:text-slate-100">
                    {title}
                  </p>
                  <p className="text-xs text-muted dark:text-slate-400 mt-0.5">
                    {desc}
                  </p>
                </div>
              </label>
            ))}
            <button className="btn-primary" onClick={save}>
              <Save size={15} /> Save preferences
            </button>
          </div>
        )}

        {tab === "schedule" && (
          <form onSubmit={save} className="card p-5 sm:p-6 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Work Schedule
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Start time" type="time" defaultValue="09:00" />
              <FormInput label="End time" type="time" defaultValue="17:30" />
              <FormInput
                label="Lunch break (minutes)"
                type="number"
                defaultValue={60}
              />
              <FormInput label="Weekly hours" type="number" defaultValue={40} />
            </div>
            <FormSelect label="Week starts on" defaultValue="Monday">
              <option>Monday</option>
              <option>Sunday</option>
            </FormSelect>
            <button type="submit" className="btn-primary">
              <Save size={15} /> Save schedule
            </button>
          </form>
        )}

        {tab === "leavetypes" && (
          <div className="card p-5 sm:p-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList size={18} className="text-accent" />
              <h3 className="text-base font-semibold text-ink dark:text-white">
                Leave Types
              </h3>
            </div>
            <ul className="divide-y divide-border dark:divide-slate-800">
              {mockDB.leaveTypes.map((t) => (
                <li key={t} className="py-3 flex items-center justify-between">
                  <span className="text-sm text-ink dark:text-slate-100">
                    {t}
                  </span>
                  <span className="text-xs text-muted">
                    Configurable in production
                  </span>
                </li>
              ))}
            </ul>
            <button className="btn-secondary mt-4" onClick={save}>
              Manage leave types
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 card p-5 max-w-2xl border-red-200 dark:border-red-900">
        <h3 className="text-base font-semibold text-danger">Reset demo data</h3>
        <p className="text-xs text-muted dark:text-slate-400 mt-1">
          Restores all mock employees, leaves, attendance, and notifications to
          their original state.
        </p>
        <button
          className="btn-danger mt-4"
          onClick={() => {
            resetDemoData();
            toast.info("Demo data has been reset.");
          }}
        >
          Reset all demo data
        </button>
      </div>
    </div>
  );
}
