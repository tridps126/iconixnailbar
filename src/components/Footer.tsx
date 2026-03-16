import Link from "next/link";
import JoinMailingListButton from "@/components/JoinMailingListButton";
import Image from "next/image";
import {
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const socialIcons: Record<string, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
};
import {
  SALON_NAME,
  ADDRESS_LINE1,
  ADDRESS_LINE2,
  PHONE,
  EMAIL,
  HOURS_SHORT,
  SOCIALS,
} from "@/lib/config";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Soft Opening Special", href: "/special" },
];

const contactInfo = [
  {
    icon: <FaMapPin className="w-4 h-4 shrink-0 mt-0.5" />,
    text: `${ADDRESS_LINE1}\n${ADDRESS_LINE2}`,
    sub: "Copperfield • Houston Nail Salon",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_LINE1}, ${ADDRESS_LINE2}`)}`,
  },
  {
    icon: <FaPhone className="w-4 h-4 shrink-0 mt-0.5" />,
    text: PHONE,
    href: `tel:${PHONE.replace(/[^+\d]/g, "")}`,
  },
  {
    icon: <FaEnvelope className="w-4 h-4 shrink-0 mt-0.5" />,
    text: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: <FaClock className="w-4 h-4 shrink-0 mt-0.5" />,
    text: HOURS_SHORT,
    href: undefined,
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1 — Brand + Quick Links */}
        <div>
          <Image
            src="/images/logo/transparent/logo_iconix_new-02.png"
            alt={SALON_NAME}
            width={1080}
            height={1130}
            className="h-20 w-auto mb-3"
          />
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            Premium nail care in a warm, welcoming space. Every visit is a
            moment of luxury.
          </p>
        </div>

        <div>
          <ul className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-6">
              Pages
            </h3>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Contact Info */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-6">
            Contact
          </h3>
          <ul className="space-y-4">
            {contactInfo.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                {item.icon}
                <div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-pre-line hover:text-gold transition-colors duration-200"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="whitespace-pre-line">{item.text}</span>
                  )}
                  {"sub" in item && item.sub && (
                    <p className="text-xs text-white/40 mt-1">{item.sub}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Social Media */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.15em] text-gold font-semibold mb-6">
            Follow Us
          </h3>
          <ul className="space-y-3">
            {SOCIALS.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:text-gold transition-colors duration-200"
                  >
                    {Icon ? (
                      <Icon className="w-4 h-4" />
                    ) : (
                      <span>{s.icon}</span>
                    )}
                    <span>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <p className="text-xs text-white/40 mb-3">Stay in the loop</p>
            <JoinMailingListButton />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-12 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} {SALON_NAME}. All rights reserved.
          </p>
          <p>Designed with care </p>
        </div>
      </div>
    </footer>
  );
}
