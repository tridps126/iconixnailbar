"use client";

export default function JoinMailingListButton() {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("open-email-popup"));
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block px-5 py-2.5 rounded-full bg-gold text-charcoal text-xs font-semibold uppercase tracking-widest hover:scale-105 transition-transform duration-200"
    >
      Join Mailing List
    </button>
  );
}
