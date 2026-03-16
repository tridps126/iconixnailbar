"use client";

import { useState } from "react";

type Status = "new" | "in_progress" | "resolved" | "spam";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "spam", label: "Spam" },
];

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-gold/20 text-gold border-gold/30",
  in_progress: "bg-blush/30 text-deep-berry border-blush",
  resolved: "bg-green-100 text-green-700 border-green-200",
  spam: "bg-muted/20 text-muted border-muted/30",
};

interface Props {
  id: string;
  currentStatus: Status;
}

export default function StatusSelect({ id, currentStatus }: Props) {
  const [status, setStatus] = useState<Status>(currentStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    const previous = status;
    setStatus(newStatus); // optimistic update

    const res = await fetch(`/api/admin/contacts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setStatus(previous); // revert on failure
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-deep-berry/20 transition ${STATUS_STYLES[status]}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
