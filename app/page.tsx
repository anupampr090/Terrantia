import Nav from "@/components/Nav";
import SkipLink from "@/components/SkipLink";
import ScrollProgress from "@/components/ScrollProgress";
import StickyReserve from "@/components/StickyReserve";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Rooms from "@/components/Rooms";
import Experiences from "@/components/Experiences";
import Gallery from "@/components/Gallery";
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
        <Gallery />
        <CtaBand />
      </main>
      <Footer />
      <StickyReserve />
    </>
  );
}
