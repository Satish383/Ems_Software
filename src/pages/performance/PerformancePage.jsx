import { useMemo, useState } from "react";
import {
  TrendingUp,
  Target,
  Star,
  UserCheck,
  Plus,
  Eye,
  Pencil,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/common/ChartCard";
import SearchInput from "@/components/common/SearchInput";
import Avatar from "@/components/common/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/common/Modal";
import EmptyState from "@/components/common/EmptyState";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { mockDB } from "@/services/mock/db";

const RATING_COLORS = ["#DC2626", "#D97706", "#3B82F6", "#16A34A", "#172554"];

export default function PerformancePage() {
  const { employees } = useData();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(null);

  const reviews = mockDB.performanceReviews.map((r, i) => ({
    ...r,
    employee: employees.find((e) => e.id === r.employeeId) || {
      name: r.employeeName,
      id: r.employeeId,
      department: r.department,
    },
  }));

  const filtered = useMemo(() => {
    if (!q.trim()) return reviews;
    const t = q.toLowerCase();
    return reviews.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(t) ||
        r.reviewer.toLowerCase().includes(t),
    );
  }, [reviews, q]);

  const ratingDist = useMemo(() => {
    const buckets = { "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0 };
    reviews.forEach((r) => {
      if (r.rating < 2) buckets["1-2"]++;
      else if (r.rating < 3) buckets["2-3"]++;
      else if (r.rating < 4) buckets["3-4"]++;
      else buckets["4-5"]++;
    });
    return Object.entries(buckets).map(([k, v]) => ({ range: k, count: v }));
  }, [reviews]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)
    : "0.00";
  const avgGoal = reviews.length
    ? Math.round(
        reviews.reduce((s, r) => s + r.goalCompletion, 0) / reviews.length,
      )
    : 0;
  const completed = reviews.filter((r) => r.status === "Completed").length;

  return (
    <div>
      <PageHeader
        title="Performance"
        subtitle="Track reviews, goals, and team performance."
        actions={
          <button
            className="btn-primary"
            onClick={() =>
              toast.info("Demo: create-review flow would open here.")
            }
          >
            <Plus size={15} /> New Review
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={Star}
          label="Average Rating"
          value={avgRating}
          tone="warning"
        />
        <StatCard
          icon={Target}
          label="Avg Goal Completion"
          value={`${avgGoal}%`}
          tone="accent"
        />
        <StatCard
          icon={UserCheck}
          label="Reviews Completed"
          value={completed}
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Reviews"
          value={reviews.length}
          tone="navy"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Rating Distribution"
            subtitle="Across all active reviews"
            height={260}
          >
            <ResponsiveContainer>
              <BarChart
                data={ratingDist}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {ratingDist.map((_, i) => (
                    <Cell
                      key={i}
                      fill={RATING_COLORS[i % RATING_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-ink dark:text-white mb-4">
            Top Performers
          </h3>
          <ul className="space-y-3">
            {[...reviews]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((r) => (
                <li key={r.id} className="flex items-center gap-3">
                  <Avatar name={r.employeeName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink dark:text-slate-100 truncate">
                      {r.employeeName}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {r.department}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star size={13} fill="currentColor" /> {r.rating}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Search reviews by employee or reviewer..."
            className="flex-1"
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Star} title="No reviews found" />
        ) : (
          <div className="table-wrap !rounded-none !border-0 border-t border-border dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="th">Employee</th>
                  <th className="th">Period</th>
                  <th className="th">Goal Completion</th>
                  <th className="th">Rating</th>
                  <th className="th">Reviewer</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-800">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-surface/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={r.employeeName} size="xs" />
                        <div>
                          <p className="font-medium text-ink dark:text-slate-100">
                            {r.employeeName}
                          </p>
                          <p className="text-[11px] text-muted">
                            {r.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="td">{r.reviewPeriod}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-surface dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${r.goalCompletion}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {r.goalCompletion}%
                        </span>
                      </div>
                    </td>
                    <td className="td">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star
                          size={13}
                          className="text-warning"
                          fill="currentColor"
                        />{" "}
                        {r.rating}
                      </span>
                    </td>
                    <td className="td">{r.reviewer}</td>
                    <td className="td">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="td text-right">
                      <div className="inline-flex gap-1">
                        <button
                          className="btn-ghost !px-2 !py-1.5"
                          onClick={() => setDetail(r)}
                          title="View feedback"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-ghost !px-2 !py-1.5"
                          onClick={() => setEditing(r)}
                          title="Edit goals"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Review Feedback"
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
                  {detail.reviewPeriod} · Reviewer: {detail.reviewer}
                </p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={detail.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border dark:border-slate-800 p-3">
                <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">
                  Rating
                </p>
                <p className="text-lg font-bold text-warning mt-0.5">
                  {detail.rating} / 5
                </p>
              </div>
              <div className="rounded-lg border border-border dark:border-slate-800 p-3">
                <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">
                  Goal Completion
                </p>
                <p className="text-lg font-bold text-accent mt-0.5">
                  {detail.goalCompletion}%
                </p>
              </div>
            </div>
            <p className="text-sm text-muted dark:text-slate-400">
              Consistently delivers high-quality work. Strong collaborator and
              mentor. Continue to focus on cross-team communication and
              documentation.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Goals"
      >
        {editing && (
          <ul className="space-y-3">
            {editing.goals.map((g) => (
              <li
                key={g.id}
                className="rounded-lg border border-border dark:border-slate-800 p-3"
              >
                <p className="text-sm font-medium text-ink dark:text-slate-100">
                  {g.title}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={g.progress}
                    className="flex-1"
                  />
                  <span className="text-xs font-semibold w-10 text-right">
                    {g.progress}%
                  </span>
                </div>
              </li>
            ))}
            <button
              className="btn-primary w-full"
              onClick={() => {
                toast.success("Goals updated (demo).");
                setEditing(null);
              }}
            >
              Save goals
            </button>
          </ul>
        )}
      </Modal>
    </div>
  );
}
