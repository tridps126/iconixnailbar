// Business Info
export const SALON_NAME = process.env.NEXT_PUBLIC_SALON_NAME || "Lumière Nails";

// Contact
export const ADDRESS_LINE1 = process.env.NEXT_PUBLIC_ADDRESS_LINE1 || "123 Blossom Avenue, Suite 101";
export const ADDRESS_LINE2 = process.env.NEXT_PUBLIC_ADDRESS_LINE2 || "Your City, ST 00000";
export const PHONE = process.env.NEXT_PUBLIC_PHONE || "(555) 123-4567";
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "hello@lumierenails.com";

// Hours
export const HOURS_MON_SAT = process.env.NEXT_PUBLIC_HOURS_MON_SAT || "9:30 AM – 7:00 PM";
export const HOURS_SUN = process.env.NEXT_PUBLIC_HOURS_SUN || "10:00 AM – 5:00 PM";

export const HOURS = [
  { day: "Monday – Saturday", time: HOURS_MON_SAT },
  { day: "Sunday", time: HOURS_SUN },
];

// A compact version for the footer
export const HOURS_SHORT = `Mon–Sat: ${HOURS_MON_SAT}\nSun: ${HOURS_SUN}`;

// Social Media
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "";
export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || "";

export const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL || "#", icon: "instagram" },
  { label: "Facebook", href: FACEBOOK_URL || "#", icon: "facebook" },
  { label: "TikTok", href: TIKTOK_URL || "#", icon: "tiktok" },
];

// Soft Opening
export const SOFT_OPENING_DATE = new Date(process.env.NEXT_PUBLIC_SOFT_OPENING_DATE || "2026-04-15T23:59:59");
export const SOFT_OPENING_SPOTS = Number(process.env.NEXT_PUBLIC_SOFT_OPENING_SPOTS) || 50;
