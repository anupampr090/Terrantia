import Link from "next/link";
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
const row = "flex min-h-11 items-center leading-[1.4]";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-dark pb-6 pt-24 text-[15px] text-on-dark-muted">
      <div className="container-x">
        <div className="grid items-start gap-x-10 gap-y-8 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 style={colStyle}>Stay</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li><a className={a} href="/#rooms">Rooms</a></li>
              <li><Link className={a} href="/book">Request a stay</Link></li>
              <li><Link className={a} href="/book">Check availability</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={colStyle}>Experiences</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li><a className={a} href="/#experiences">Spa, dining and water</a></li>
              <li><a className={a} href="/#gallery">Gallery</a></li>
              <li><a className={a} href="/#experiences">All experiences</a></li>
            </ul>
          </div>
          <div>
            <h3 style={colStyle}>Contact</h3>
            <ul className="m-0 list-none space-y-0 p-0">
              <li className={row}>Shoreline Road (placeholder)</li>
              <li><a className={a} href="tel:+10000000000">Call us (placeholder)</a></li>
              <li><a className={a} href="https://wa.me/10000000000">WhatsApp (placeholder)</a></li>
              <li><a className={a} href="https://maps.google.com/">Map (placeholder)</a></li>
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
