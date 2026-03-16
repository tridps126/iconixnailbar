import StatusSelect from "./StatusSelect";
import { createServiceClient } from "@/utils/supabase/service";

export const dynamic = "force-dynamic";

type Status = "new" | "in_progress" | "resolved" | "spam";

interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: Status;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(text: string, max = 80) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default async function ContactsPage() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, created_at, name, email, phone, message, status")
    .order("created_at", { ascending: false });

  const contacts: ContactSubmission[] = error || !data ? [] : data;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-deep-berry">
            Contact Submissions
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {contacts.length} submission{contacts.length !== 1 ? "s" : ""}
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
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Message
                </th>
                <th className="text-left px-4 py-3 font-semibold text-charcoal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-almond/60">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-almond/10 transition-colors">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:text-deep-berry transition-colors"
                    >
                      {c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {c.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-charcoal max-w-xs">
                    <span title={c.message}>{truncate(c.message)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect id={c.id} currentStatus={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contacts.length === 0 && (
          <div className="py-16 text-center text-muted">
            No contact submissions yet.
          </div>
        )}
      </div>
    </div>
  );
}
