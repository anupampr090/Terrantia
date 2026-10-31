import Image from "next/image";
import ClipReveal, { MaskHeading } from "./ClipReveal";

type Item = { title: string; text: string; img: string; alt: string };

const items: Item[] = [
  { title: "Dining", text: "Seasonal menus, served on the beach after dark.", img: "/media/experiences/dining.jpg", alt: "A candlelit dinner table set on the sand between dark rocks, with the sea and a sunset sky behind" },
  { title: "On the water", text: "Snorkelling, paddleboards and sunset sailing.", img: "/media/experiences/water.jpg", alt: "Two people on a paddleboard, silhouetted against the setting sun" },
  { title: "Spa", text: "Treatments, yoga at sunrise and a quiet pool for the afternoon.", img: "/media/experiences/spa.jpg", alt: "An open-air massage table with a blue striped towel, beside a vase of white frangipani" },
];

function Caption({ item }: { item: Item }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-56 md:px-12 md:pb-12"
      style={{ background: "linear-gradient(to top, rgba(9,34,42,0.82) 0%, rgba(9,34,42,0.45) 45%, rgba(9,34,42,0) 85%)" }}
    >
      <h3 className="mb-2 text-[34px] leading-[1.1] text-on-dark [text-shadow:0_1px_16px_rgba(9,34,42,0.5)] md:text-[48px]">{item.title}</h3>
      <p className="max-w-[28em] text-on-dark [text-shadow:0_1px_10px_rgba(9,34,42,0.6)]">{item.text}</p>
    </div>
  );
}

export default function Experiences() {
  return (
    <section id="experiences" className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <MaskHeading className="mb-16 text-[38px] leading-[1.08] tracking-[-0.015em] md:mb-24 md:text-[56px]">Time well spent</MaskHeading>
        <div className="flex flex-col gap-24 md:gap-40">
          {items.map((item) => (
            <ClipReveal key={item.title} parallax className="snap-panel h-[70svh] min-h-[420px] md:h-[85svh]" overlay={<Caption item={item} />}>
              <Image
                src={item.img}
                alt={item.alt}
                fill
                sizes="(min-width: 1200px) 1136px, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
