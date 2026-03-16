import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { SALON_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `Contact — ${SALON_NAME}`,
  description: `Get in touch with ${SALON_NAME}. Find our location, hours, and send us a message.`,
};

export default function ContactPage() {
  return <ContactContent />;
}
