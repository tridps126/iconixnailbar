import type { Metadata } from "next";
import { SALON_NAME } from "@/lib/config";
import AppBookContent from "@/components/AppBook";
// import SpecialPageContent from "@/components/SpecialPageContent";

export const metadata: Metadata = {
  title: `Booking — ${SALON_NAME}`,
  description:
    "Appointment Book",
};

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-deep-berry flex flex-col items-center justify-start pt-40 pb-24 px-6">
      <AppBookContent></AppBookContent>
    </div>
  );
}
