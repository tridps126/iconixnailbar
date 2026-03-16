import type { Metadata } from "next";
import GalleryContent from "@/components/GalleryContent";
import { SALON_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `Gallery — ${SALON_NAME}`,
  description: "Browse our nail art gallery. From classic elegance to bold nail art — see what we create.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}
