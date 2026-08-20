import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import Card, { CardHeader } from "../../components/ui/Card";

export default function SubmitQuery() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
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
              <p className="mt-0.5 text-xs">It will appear in My Queries once the backend query endpoint is connected.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="query-message" className="mb-2 block text-sm font-medium text-ink">Query / Message</label>
            <textarea id="query-message" name="message" required rows={10} placeholder="Write your query here..."
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft" />
          </div>
          <button type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-ring">
            <Send size={16} />
            Submit query
          </button>
        </form>
      </Card>
    </div>
  );
}
