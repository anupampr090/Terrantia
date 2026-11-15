import Nav from "@/components/Nav";
import SkipLink from "@/components/SkipLink";
import ScrollProgress from "@/components/ScrollProgress";
import StickyReserve from "@/components/StickyReserve";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Intro from "@/components/Intro";
import Rooms from "@/components/Rooms";
import Dining from "@/components/Dining";
import Wellness from "@/components/Wellness";
import Experiences from "@/components/Experiences";
import Offers from "@/components/Offers";
import Facilities from "@/components/Facilities";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

// Order follows what guests look for: what and where it is, proof, rooms, then dining, wellness
// and things to do, offers, practical details, photos, getting here, questions, and the request.
export default function Home() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Intro />
        <Rooms />
        <Dining />
        <Wellness />
        <Experiences />
        <Offers />
        <Facilities />
        <Gallery />
        <Location />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <StickyReserve />
    </>
  );
}
