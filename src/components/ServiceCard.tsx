interface ServiceCardProps {
  name: string;
  description: string;
  price: string;
  duration: string;
}

export default function ServiceCard({ name, description, price, duration }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-almond p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-semibold text-charcoal text-base">{name}</h3>
        <span className="font-display text-deep-berry text-lg font-semibold shrink-0">{price}</span>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-3">{description}</p>
      <p className="text-xs text-muted/70 uppercase tracking-[0.1em]">{duration}</p>
    </div>
  );
}
