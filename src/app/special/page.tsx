import type { Metadata } from "next";
import { SALON_NAME } from "@/lib/config";
import SpecialPageContent from "@/components/SpecialPageContent";

export const metadata: Metadata = {
  title: `Soft Opening Special — ${SALON_NAME}`,
  description:
    "Reserve your spot for our exclusive soft opening offer. Limited to 50 guests.",
};

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-deep-berry flex flex-col items-center justify-start pt-40 pb-24 px-6">
      <SpecialPageContent />
    </div>
  );
}
