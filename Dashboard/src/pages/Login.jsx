import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound, Waypoints } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getDashboardPath } from "../utils/auth";

const FEATURES = [
  "Route incoming queries automatically",
  "Track tickets across every department",
  "Monitor escalations from one dashboard",
];

const ROLES = ["Exam", "Finance", "Registrar", "Instructor", "IT Dept", "STUDENT", "Admin"];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const user = await login({
        selectedRole: form.get("role"),
        email: form.get("email"),
        password: form.get("password"),
        remember: form.get("remember") === "on",
      });
      navigate(getDashboardPath(user), { replace: true });
    } catch (loginError) {
      setError(
        loginError.message === "Failed to fetch"
          ? "Cannot reach the backend. Make sure the API is running on port 8000."
          : loginError.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-bg">
      <section className="relative hidden w-[46%] overflow-hidden bg-ink px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="absolute -left-32 -top-36 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-44 -right-28 h-[28rem] w-[28rem] rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-lg shadow-black/10">
            <Waypoints size={21} strokeWidth={2.3} />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">QueryRoute</p>
            <p className="text-xs text-white/55">Email automation</p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-lg py-16">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            Smart query routing
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Every email reaches the right team.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/60">
            Manage your automated email workflow, department queues, and escalations from one clear workspace.
          </p>
          <div className="mt-9 space-y-4">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-white/75">
                <CheckCircle2 size={18} className="shrink-0 text-teal" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/35">QueryRoute · Secure administration portal</p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Waypoints size={19} strokeWidth={2.3} />
            </div>
            <div>
              <p className="font-display text-base font-bold tracking-tight text-ink">QueryRoute</p>
              <p className="text-[11px] text-ink-faint">Email automation</p>
            </div>
          </div>

          <p className="text-sm font-semibold text-primary">Welcome back</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Enter your credentials to access the QueryRoute dashboard.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-ink">Role</label>
              <div className="relative">
                <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <select
                  id="role"
                  name="role"
                  defaultValue=""
                  required
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-surface pl-11 pr-10 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-soft"
                >
                  <option value="" disabled>Select your role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">▼</span>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">Email address</label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input id="email" name="email" type="email" autoComplete="email" placeholder="admin@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
                <button type="button" className="text-xs font-medium text-primary hover:text-primary-dark">Forgot password?</button>
              </div>
              <div className="relative">
                <LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input id="password" name="password" type={showPassword ? "text" : "password"}
                  autoComplete="current-password" placeholder="Enter your password" required
                  className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-sunken hover:text-ink-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded border-border-strong accent-primary" />
              Keep me signed in
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-status-escalated/20 bg-status-escalated-soft px-4 py-3 text-sm text-status-escalated">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-ring disabled:cursor-not-allowed disabled:opacity-65">
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-xs leading-5 text-ink-faint">
            Protected access for authorized staff only.
          </p>
        </div>
      </section>
    </main>
  );
}
