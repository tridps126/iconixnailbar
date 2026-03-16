import { createServiceClient } from "@/utils/supabase/service";

export const dynamic = "force-dynamic";

const SPOTS_CAP = 50;

interface Reservation {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  confirmed: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReservationsPage() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("soft_opening_reservations")
    .select("id, created_at, name, email, phone, confirmed")
    .order("created_at", { ascending: false });

  const reservations: Reservation[] = error || !data ? [] : data;
  const spotsUsed = reservations.length;
  const spotsRemaining = SPOTS_CAP - spotsUsed;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-deep-berry">
            Soft Opening Reservations
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {spotsRemaining} spot{spotsRemaining !== 1 ? "s" : ""} remaining
          </p>
        </div>

        {/* Spots counter badge */}
        <div className="flex items-center gap-2 bg-white border border-almond rounded-xl px-4 py-2.5">
          <div className="text-right">
            <p className="text-xs text-muted font-medium uppercase tracking-widest">
              Spots Used
            </p>
            <p className="font-display text-xl text-deep-berry leading-tight">
              {spotsUsed}
              <span className="text-sm text-muted font-sans font-normal">
                {" "}
                / {SPOTS_CAP}
              </span>
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-24 h-2 rounded-full bg-almond overflow-hidden">
            <div
              className="h-full rounded-full bg-deep-berry transition-all"
              style={{ width: `${(spotsUsed / SPOTS_CAP) * 100}%` }}
            />
          </div>
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
                  Confirmed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-almond/60">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-almond/10 transition-colors">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    <a
                      href={`mailto:${r.email}`}
                      className="hover:text-deep-berry transition-colors"
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {r.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
                        r.confirmed
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-almond text-muted border-almond"
                      }`}
                    >
                      {r.confirmed ? "Yes" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 && (
          <div className="py-16 text-center text-muted">
            No reservations yet.
          </div>
        )}
      </div>
    </div>
  );
}
