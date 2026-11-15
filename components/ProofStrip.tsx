import { Award, Star } from "lucide-react";
import { resort } from "@/lib/resort";

// PLACEHOLDER: the rating and awards are sample content from lib/resort.ts.
function Stars({ className }: { className: string }) {
  return (
    <span className={`flex gap-1 ${className}`}>
      {Array.from({ length: resort.rating.outOf }, (_, i) => (
        <Star key={i} size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      ))}
    </span>
  );
}

export default function ProofStrip() {
  const { score, outOf, count, source } = resort.rating;
  const filled = `${Math.max(0, Math.min(1, score / outOf)) * 100}%`;

  return (
    <section aria-label="Ratings and awards" className="relative z-10 border-b border-hairline bg-canvas">
      <div className="container-x">
        <div className="flex flex-col gap-5 py-8 lg:min-h-24 lg:flex-row lg:items-center lg:gap-10 lg:py-5">
          <div className="flex items-center gap-4">
            <p className="sr-only">Rated {score} out of {outOf} from {count} {source}.</p>
            <span aria-hidden="true" className="font-display text-[44px] leading-none text-ink [font-variant-numeric:lining-nums_tabular-nums]">
              {score}
            </span>
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="relative inline-flex w-max">
                <Stars className="text-hairline" />
                <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: filled }}>
                  <Stars className="text-accent [&_svg]:fill-current" />
                </span>
              </span>
              <span className="text-[14px] leading-[1.4] text-muted">{count} {source}</span>
            </span>
          </div>

          <ul className="m-0 flex list-none flex-col gap-4 p-0 sm:flex-row sm:gap-0 lg:ml-auto">
            {resort.awards.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border-t border-hairline pt-4 sm:border-l sm:border-t-0 sm:px-8 sm:pt-0 max-lg:sm:first:border-l-0 max-lg:sm:first:pl-0"
              >
                <Award size={24} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-accent" />
                <span className="flex flex-col">
                  <span className="text-[15px] font-medium leading-[1.4] text-ink">{a.title}</span>
                  <span className="text-[14px] leading-[1.4] text-muted">{a.issuer}, {a.year}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="m-0 border-t border-hairline pt-4 text-[14px] leading-[1.4] text-muted lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            Sample ratings and awards
          </p>
        </div>
      </div>
    </section>
  );
}
