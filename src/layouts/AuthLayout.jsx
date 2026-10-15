import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-blue-500/20 blur-3xl" />
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold">
              EH
            </div>
            <div>
              <p className="text-lg font-bold">EmployeeHub</p>
              <p className="text-[11px] tracking-widest uppercase text-white/60">
                HR Suite
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Manage your people,
            <br />
            beautifully.
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            A modern HR platform for teams that care about their people —
            attendance, payroll, performance, and more in one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { k: "24+", v: "Employees" },
              { k: "6", v: "Departments" },
              { k: "99.9%", v: "Uptime" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur"
              >
                <p className="text-xl font-bold">{s.k}</p>
                <p className="text-[11px] text-white/60">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/50">
          © {new Date().getFullYear()} EmployeeHub Inc. — Frontend demo, no real
          data.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
