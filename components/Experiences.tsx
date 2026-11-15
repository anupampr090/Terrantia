import Image from "next/image";
import { Fish, Sailboat, Waves, type LucideIcon } from "lucide-react";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";
import Reveal from "./Reveal";

// PLACEHOLDER: sample activities until the resort supplies its own list.
const activities: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Waves, title: "Paddleboards", text: "Boards wait on the sand each morning." },
  { Icon: Fish, title: "Snorkelling", text: "Masks and fins for the reef close to shore." },
  { Icon: Sailboat, title: "Sunset sailing", text: "An hour under sail as the light goes." },
];

function Caption() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-56 md:px-12 md:pb-12"
      style={{ background: "linear-gradient(to top, rgba(9,34,42,0.82) 0%, rgba(9,34,42,0.45) 45%, rgba(9,34,42,0) 85%)" }}
    >
      <span aria-hidden className="mb-3 block h-px w-10 bg-on-dark/50" />
      <h3 className="mb-2 text-[34px] leading-[1.1] text-on-dark [text-shadow:0_1px_16px_rgba(9,34,42,0.5)] md:text-[48px]">On the water</h3>
      <p className="m-0 max-w-[28em] text-on-dark [text-shadow:0_1px_10px_rgba(9,34,42,0.6)]">Calm, warm sea from first light to sunset.</p>
    </div>
  );
}

export default function Experiences() {
  return (
    <section id="experiences" className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <MaskHeading className="mb-12 text-[38px] leading-[1.08] tracking-[-0.015em] md:mb-16 md:text-[56px]">Time on the water</MaskHeading>
        <ClipReveal parallax className="h-[70svh] min-h-[420px]" overlay={<Caption />}>
          <Image
            src="/media/experiences/water.jpg"
            alt="Two people on a paddleboard, one sitting and one kneeling with a paddle, silhouetted against a low golden sun on the sea"
            fill
            sizes="(min-width: 1200px) 1136px, 100vw"
            loading="lazy"
            className="object-cover object-[50%_70%]"
          />
        </ClipReveal>
        <Reveal stagger className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {activities.map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" className="mb-4 text-accent" />
              <h3 className="mb-2 text-[24px] leading-[1.2] md:text-[28px]">{title}</h3>
              <p className="m-0 max-w-[24em] text-[15px] leading-[1.5]">{text}</p>
            </div>
          ))}
        </Reveal>
        <PlaceholderNote className="mt-10" text="Activities are placeholders." />
      </div>
    </section>
  );
}
