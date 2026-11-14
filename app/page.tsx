import Nav from "@/components/Nav";
import SkipLink from "@/components/SkipLink";
import ScrollProgress from "@/components/ScrollProgress";
import StickyReserve from "@/components/StickyReserve";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Rooms from "@/components/Rooms";
import Experiences from "@/components/Experiences";
import Facilities from "@/components/Facilities";
import Gallery from "@/components/Gallery";
import Nearby from "@/components/Nearby";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import SectionSnap from "@/components/SectionSnap";

export default function Home() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Nav />
      <SectionSnap />
      <main id="main">
        <Hero />
        <Intro />
        <Rooms />
        <Experiences />
        <Facilities />
        <Gallery />
        <Nearby />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <StickyReserve />
    </>
  );
}
