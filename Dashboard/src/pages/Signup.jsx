import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  UsersRound,
  Waypoints,
} from "lucide-react";
import { getActiveDepartments } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getDashboardPath } from "../utils/auth";

const BENEFITS = [
  "Submit and track queries in one place",
  "Get routed to the correct department",
  "Receive updates as your query progresses",
];

export default function Signup() {
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getActiveDepartments()
      .then((items) => {
        setDepartments(
          items.filter((department) => {
            const name = department.name.trim().toLowerCase();
            return department.is_active && name !== "admin" && name !== "student";
          })
        );
      })
      .catch(() => setError("Could not load roles. Make sure the backend is running."))
      .finally(() => setDepartmentsLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = form.get("password");

    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = await signup({
        fullName: form.get("fullName"),
        email: form.get("email"),
        password,
        departmentName: form.get("role"),
      });
      navigate(getDashboardPath(user), { replace: true });
    } catch (signupError) {
      setError(
        signupError.message === "Failed to fetch"
          ? "Cannot reach the backend. Make sure the API is running on port 8000."
          : signupError.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-bg">
      <section className="relative hidden w-[44%] overflow-hidden bg-ink px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="absolute -left-32 -top-36 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-44 -right-28 h-[28rem] w-[28rem] rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
            <Waypoints size={21} strokeWidth={2.3} />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">QueryRoute</p>
            <p className="text-xs text-white/55">Email automation</p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-lg py-12">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            Create your workspace
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Your queries, routed intelligently.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/60">
            Register with your role and start using the portal designed for your account.
          </p>
          <div className="mt-9 space-y-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-white/75">
                <CheckCircle2 size={18} className="shrink-0 text-teal" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/35">
          Admin accounts are created by an existing administrator.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Waypoints size={19} strokeWidth={2.3} />
            </div>
            <p className="font-display text-base font-bold tracking-tight text-ink">QueryRoute</p>
          </div>

          <p className="text-sm font-semibold text-primary">Get started</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            Create your account
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Choose your role and enter your account information.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
              <div className="relative">
                <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input id="signup-name" name="fullName" required autoComplete="name" placeholder="Enter your full name"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-role" className="mb-1.5 block text-sm font-medium text-ink">Role</label>
              <div className="relative">
                <UsersRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <select id="signup-role" name="role" defaultValue="" required disabled={departmentsLoading}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-surface pl-11 pr-10 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary-soft disabled:opacity-60">
                  <option value="" disabled>{departmentsLoading ? "Loading roles..." : "Select your role"}</option>
                  <option value="Student">STUDENT</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>{department.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">▼</span>
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input id="signup-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
              </div>
            </div>

            <PasswordField
              id="signup-password"
              name="password"
              label="Password"
              visible={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
            />
            <PasswordField
              id="signup-confirm-password"
              name="confirmPassword"
              label="Confirm password"
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((current) => !current)}
              autoComplete="new-password"
            />

            {error && (
              <p role="alert" className="rounded-xl border border-status-escalated/20 bg-status-escalated-soft px-4 py-3 text-sm text-status-escalated">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading || departmentsLoading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-ring disabled:cursor-not-allowed disabled:opacity-65">
              {loading ? (
                <><LoaderCircle size={17} className="animate-spin" />Creating account...</>
              ) : (
                <>Create account<ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-primary hover:text-primary-dark">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function PasswordField({ id, name, label, visible, onToggle, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input id={id} name={name} type={visible ? "text" : "password"} required minLength={8}
          autoComplete={autoComplete} placeholder="Minimum 8 characters"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-12 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-sunken hover:text-ink-muted"
          aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
