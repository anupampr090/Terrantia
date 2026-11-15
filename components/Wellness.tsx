import Image from "next/image";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";
import Reveal from "./Reveal";
import RoomDetails from "./RoomDetails";
import type { Detail } from "@/lib/rooms";

// PLACEHOLDER: facilities until the resort supplies its treatment list.
const items: Detail[] = [
  { icon: "spa", label: "Spa treatments" },
  { icon: "sauna", label: "Sauna and steam" },
  { icon: "yoga", label: "Yoga" },
  { icon: "gym", label: "Gym" },
  { icon: "pool", label: "Pool" },
];

export default function Wellness() {
  return (
    <section id="wellness" className="section-pad relative z-10 bg-surface">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="lg:col-span-6 lg:pt-28">
            <MaskHeading className="mb-6 text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Wellness</MaskHeading>
            <Reveal>
              <p className="m-0 max-w-[30em]">
                Treatments are given in the open air, with the sea close by. Yoga starts at sunrise, and the pool stays quiet through the afternoon.
              </p>
              <RoomDetails items={items} className="mt-8 max-w-[30em]" />
              <PlaceholderNote className="mt-8" text="Treatments and facilities are placeholders." />
            </Reveal>
          </div>
          <ClipReveal parallax className="aspect-[4/5] lg:col-span-5 lg:col-start-8 lg:aspect-[3/4]">
            <Image
              src="/media/experiences/spa.jpg"
              alt="An open-air massage table covered with a blue striped cloth, beside a glass vase of white frangipani and a bowl of coral and shells"
              fill
              sizes="(min-width: 1200px) 460px, (min-width: 1024px) 40vw, 100vw"
              loading="lazy"
              className="object-cover object-[62%_50%]"
            />
          </ClipReveal>
        </div>
      </div>
    </section>
  );
}
