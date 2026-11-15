import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { directPerks, faqs } from "@/lib/faq";
import { MaskHeading } from "./ClipReveal";
import Reveal from "./Reveal";
import RoomIcon from "./RoomIcon";
import PlaceholderNote from "./PlaceholderNote";

export default function Faq() {
  return (
    <section id="faq" className="section-pad relative z-10 bg-surface">
      <div className="container-x">
        <MaskHeading className="mb-12 text-[38px] leading-[1.08] tracking-[-0.015em] md:mb-20 md:text-[56px]">Good to know</MaskHeading>
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-hairline first:border-t">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <p className="m-0 max-w-[52ch] pb-5 text-body">{f.a}</p>
              </details>
            ))}
          </Reveal>
          <Reveal className="rounded-xl border border-hairline bg-canvas p-6 md:col-span-5 md:p-8">
            <h3 className="mb-2 text-[28px] font-medium leading-[1.1] text-ink md:text-[32px]">Book with us directly</h3>
            <p className="mb-6 text-[15px] text-muted">A few small extras when you send your request to us.</p>
            <ul className="m-0 mb-8 grid list-none gap-y-3 p-0">
              {directPerks.map((d) => (
                <li key={d.label} className="flex items-center gap-3 text-[15px] leading-[1.35] text-body">
                  <RoomIcon name={d.icon} />
                  <span>{d.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/book" className="btn btn-primary">Check availability</Link>
          </Reveal>
        </div>
        <PlaceholderNote className="mt-10" text="Answers and perks are placeholders until the resort confirms them." />
      </div>
    </section>
  );
}
