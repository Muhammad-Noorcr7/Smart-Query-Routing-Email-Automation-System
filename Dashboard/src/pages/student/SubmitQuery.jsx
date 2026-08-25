import { useState } from "react";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { submitQuery } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import Card, { CardHeader } from "../../components/ui/Card";

export default function SubmitQuery() {
  const { token } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [routedDepartment, setRoutedDepartment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") ?? "").trim();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await submitQuery({ message, token });
      setSubmitted(true);
      setRoutedDepartment(response.department_name ?? "Admin");
      form.reset();
    } catch (submissionError) {
      setSubmitted(false);
      setRoutedDepartment("");
      setError(submissionError.message || "Unable to submit query.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader
          title="How can we help?"
          subtitle="Write your query below and it will be routed to the right department automatically."
        />

        {submitted && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-status-resolved-soft px-4 py-3 text-sm text-status-resolved">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Query submitted</p>
              <p className="mt-0.5 text-xs">
                It has been routed to {routedDepartment || "the right department"} and will appear in My Queries.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-status-escalated-soft px-4 py-3 text-sm text-status-escalated">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Submission failed</p>
              <p className="mt-0.5 text-xs">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="query-message" className="mb-2 block text-sm font-medium text-ink">Query / Message</label>
            <textarea id="query-message" name="message" required rows={10} placeholder="Write your query here..."
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-ring disabled:cursor-not-allowed disabled:opacity-70">
            <Send size={16} />
            {isSubmitting ? "Submitting..." : "Submit query"}
          </button>
        </form>
      </Card>
    </div>
  );
}
