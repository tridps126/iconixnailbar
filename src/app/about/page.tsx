import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import { SALON_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `About Us — ${SALON_NAME}`,
  description: `Learn about ${SALON_NAME} — our philosophy, our team, and what makes our salon different.`,
};

export default function AboutPage() {
  return <AboutContent />;
}
