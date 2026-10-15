import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-slate-950 p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto">
          <Compass size={28} />
        </div>
        <p className="mt-6 text-5xl font-extrabold text-ink dark:text-white tracking-tight">
          404
        </p>
        <h1 className="mt-3 text-xl font-semibold text-ink dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-flex">
          <Home size={15} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
