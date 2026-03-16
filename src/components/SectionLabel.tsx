interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-3">
      {text}
    </p>
  );
}
