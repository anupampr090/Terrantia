import Image from "next/image";
import { facilityGroups, facilityHighlights } from "@/lib/facilities";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import Reveal from "./Reveal";
import RoomIcon from "./RoomIcon";
import PlaceholderNote from "./PlaceholderNote";

export default function Facilities() {
  return (
    <section id="facilities" className="section-pad relative z-10 bg-surface">
      <div className="container-x">
        <div className="mb-12 grid items-center gap-10 md:mb-20 md:grid-cols-2 md:gap-16">
          <div>
            <span className="eyebrow">Facilities</span>
            <MaskHeading className="mb-6 text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Everything you need</MaskHeading>
            <p className="mb-8 max-w-[34em]">From a quick coffee to a working day, the practical things are already taken care of.</p>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {facilityHighlights.map((d) => (
                <li key={d.label} className="flex min-h-11 items-center gap-2 rounded-full border border-hairline bg-canvas px-4 text-[15px] text-ink">
                  <RoomIcon name={d.icon} />
                  <span>{d.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <ClipReveal className="aspect-[4/3]">
            <Image
              src="/media/gallery/gallery-6.jpg"
              alt="Sun loungers under white umbrellas beside a pool, with tall palm trees behind"
              fill
              sizes="(min-width: 1200px) 552px, (min-width: 768px) 45vw, 100vw"
              loading="lazy"
              className="object-cover"
              style={{ objectPosition: "50% 78%" }}
            />
          </ClipReveal>
        </div>
        <Reveal stagger className="grid gap-6 md:grid-cols-2">
          {facilityGroups.map((group) => (
            <div key={group.id} className="rounded-xl border border-hairline bg-canvas p-6 md:p-8">
              <h3 className="mb-2 text-[28px] font-medium leading-[1.1] text-ink md:text-[32px]">{group.title}</h3>
              <p className="mb-6 text-[15px] text-muted">{group.blurb}</p>
              <ul className="m-0 grid list-none gap-y-3 p-0">
                {group.items.map((d) => (
                  <li key={d.label} className="flex items-center gap-3 text-[15px] leading-[1.35] text-body">
                    <RoomIcon name={d.icon} />
                    <span>{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
        <PlaceholderNote className="mt-10" />
      </div>
    </section>
  );
}
