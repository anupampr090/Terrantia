import Reveal from "./Reveal";

/** One sentence at full contrast with a single short fade. Nothing here is tied to scroll position. */
export default function Intro() {
  return (
    <section className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <Reveal>
          <p className="m-0 max-w-[20em] font-display text-[32px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[56px]">
            Slow mornings, warm water and long evenings on the sand.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
