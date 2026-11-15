import Image from "next/image";
import { Check } from "lucide-react";
import ArrowLink from "./ArrowLink";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";
import Reveal from "./Reveal";
import { offers } from "@/lib/offers";

export default function Offers() {
  return (
    <section id="offers" className="section-pad relative z-10 bg-surface">
      <div className="container-x">
        <MaskHeading className="mb-4 text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Offers</MaskHeading>
        <PlaceholderNote className="mb-12 md:mb-16" text="Offers are samples until the resort sets them." />
        <div className="grid gap-16 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          {offers.map((o) => (
            <article key={o.id}>
              <ClipReveal className="aspect-[4/3]">
                <Image
                  src={o.image}
                  alt={o.alt}
                  fill
                  sizes="(min-width: 1200px) 530px, (min-width: 768px) 45vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </ClipReveal>
              <Reveal className="mt-6">
                <h3 className="mb-2 text-[26px] leading-[1.2] md:text-[30px]">{o.title}</h3>
                <p className="m-0 max-w-[30em]">{o.summary}</p>
                <ul className="m-0 mt-6 grid list-none gap-3 p-0">
                  {o.includes.map((line) => (
                    <li key={line} className="flex items-center gap-3 text-[15px] leading-[1.35] text-body">
                      <Check size={18} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-accent" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="m-0 mt-6 text-[14px] leading-[1.5] text-muted">{o.terms}</p>
                <ArrowLink href={`/book?offer=${o.id}`} className="mt-3">Request this offer</ArrowLink>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
