import { createServiceClient } from "@/utils/supabase/service";
import NotificationsClient from "./NotificationsClient";

export const dynamic = "force-dynamic";

export type ContactRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  status: string;
};

export type ReservationRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  confirmed: boolean;
};

export type SubscriberRow = {
  id: string;
  created_at: string;
  email: string;
  source: string;
};

export default async function NotificationsPage() {
  const supabase = createServiceClient();

  const [contactsRes, reservationsRes, newsletterRes] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id, created_at, name, email, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("soft_opening_reservations")
      .select("id, created_at, name, email, confirmed")
      .order("created_at", { ascending: false }),
    supabase
      .from("newsletter_subscribers")
      .select("id, created_at, email, source")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-deep-berry">
          Send Email Notification
        </h1>
        <p className="text-sm text-muted mt-0.5">
          Compose and send an email to your audience
        </p>
      </div>

      <NotificationsClient
        contacts={(contactsRes.data ?? []) as ContactRow[]}
        reservations={(reservationsRes.data ?? []) as ReservationRow[]}
        subscribers={(newsletterRes.data ?? []) as SubscriberRow[]}
      />
    </div>
  );
}
