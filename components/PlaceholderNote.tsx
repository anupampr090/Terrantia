import { Info } from "lucide-react";

/** The honesty note that used to sit inside the description sentence. One quiet line, rendered once. */
export default function PlaceholderNote({ className = "" }: { className?: string }) {
  return (
    <p className={`m-0 flex items-center gap-2 text-[13px] leading-[1.4] text-muted ${className}`}>
      <Info size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      <span>Placeholder copy until final text is supplied.</span>
    </p>
  );
}
