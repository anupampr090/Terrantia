import Link from "next/link";
import { Map, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import Newsletter from "./Newsletter";
import { RiseIn } from "./ClipReveal";

const colStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--color-on-dark)",
  marginBottom: 8,
  lineHeight: "44px",
  height: 44,
};
const a = "inline-flex min-h-11 items-center hover:text-on-dark";
const row = "flex min-h-11 items-center gap-3 leading-[1.4]";
const ia = "inline-flex min-h-11 items-center gap-3 hover:text-on-dark";

function Ico({ I }: { I: LucideIcon }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-on-dark/80" aria-hidden>
      <I size={18} strokeWidth={1.5} aria-hidden />
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-dark pb-6 pt-24 text-[15px] text-on-dark-muted">
      <div className="container-x">
        <div className="grid items-start gap-x-10 gap-y-8 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 style={colStyle}>Stay</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li><Link className={a} href="/#rooms">Rooms</Link></li>
              <li><Link className={a} href="/book">Request a stay</Link></li>
              <li><Link className={a} href="/book">Check availability</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={colStyle}>Experiences</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li><Link className={a} href="/#experiences">Spa, dining and water</Link></li>
              <li><Link className={a} href="/#facilities">Facilities</Link></li>
              <li><Link className={a} href="/#nearby">Nearby places</Link></li>
              <li><Link className={a} href="/#faq">Good to know</Link></li>
              <li><Link className={a} href="/#gallery">Gallery</Link></li>
              <li><Link className={a} href="/#experiences">All experiences</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={colStyle}>Contact</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li className={row}><Ico I={MapPin} />Shoreline Road (placeholder)</li>
              <li><a className={ia} href="tel:+10000000000"><Ico I={Phone} />Call us (placeholder)</a></li>
              <li><a className={ia} href="https://wa.me/10000000000"><Ico I={MessageCircle} />WhatsApp (placeholder)</a></li>
              <li><a className={ia} href="https://maps.google.com/"><Ico I={Map} />Map (placeholder)</a></li>
            </ul>
          </div>
          <div>
            <h3 style={colStyle}>Newsletter</h3>
            <Newsletter />
          </div>
        </div>
        <p className="pt-6 text-[13px] md:pt-8">&copy; Terrantia. Concept demo. All media, prices and copy are placeholders.</p>
      </div>
      <RiseIn className="mt-12 select-none md:mt-14 whitespace-nowrap text-center font-display text-[20vw] font-light leading-[0.9] tracking-[-0.02em] text-on-dark/10 min-[1500px]:text-[300px]">
        Terrantia
      </RiseIn>
    </footer>
  );
}
