import { createServiceClient } from "@/utils/supabase/service";

export const dynamic = "force-dynamic";

interface Subscriber {
  id: string;
  created_at: string;
  email: string;
  source: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsletterPage() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, created_at, email, source")
    .order("created_at", { ascending: false });

  const subscribers: Subscriber[] = error || !data ? [] : data;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-deep-berry">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-muted mt-0.5">
            All email signups from the site popup
          </p>
        </div>

        {/* Total count badge */}
        <div className="bg-white border border-almond rounded-xl px-4 py-2.5 text-right">
          <p className="text-xs text-muted font-medium uppercase tracking-widest">
            Total Subscribers
          </p>
          <p className="font-display text-2xl text-deep-berry leading-tight">
            {subscribers.length}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border border-almond rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-almond bg-almond/30">
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Date Signed Up
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-almond/60">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-almond/10 transition-colors">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    <a
                      href={`mailto:${s.email}`}
                      className="hover:text-deep-berry transition-colors"
                    >
                      {s.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border bg-almond/50 text-muted border-almond capitalize">
                      {s.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscribers.length === 0 && (
          <div className="py-16 text-center text-muted">
            No subscribers yet.
          </div>
        )}
      </div>
    </div>
  );
}
