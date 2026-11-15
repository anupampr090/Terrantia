import Image from "next/image";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";
import Reveal from "./Reveal";
import RoomDetails from "./RoomDetails";
import type { Detail } from "@/lib/rooms";

// PLACEHOLDER: outlets and services until the resort supplies menus and hours.
const items: Detail[] = [
  { icon: "restaurant", label: "Restaurant" },
  { icon: "bar", label: "Bar" },
  { icon: "breakfast", label: "Breakfast" },
  { icon: "roomservice", label: "Room service" },
];

export default function Dining() {
  return (
    <section id="dining" className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <ClipReveal parallax className="aspect-[5/4] lg:col-span-7 lg:aspect-[4/5]">
            <Image
              src="/media/experiences/dining.jpg"
              alt="A low candlelit table with floor cushions set on the sand between dark rocks, facing the sea under a cloudy sunset sky"
              fill
              sizes="(min-width: 1200px) 650px, (min-width: 1024px) 56vw, 100vw"
              loading="lazy"
              className="object-cover"
            />
          </ClipReveal>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-10">
            <MaskHeading className="mb-6 text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Dining</MaskHeading>
            <Reveal>
              <p className="m-0 max-w-[30em]">
                Dinner is served on the sand after dark, by candlelight. Breakfast is laid out by the water and runs late.
              </p>
              <RoomDetails items={items} className="mt-8" />
              <PlaceholderNote className="mt-8" text="Menus and opening hours are placeholders." />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
