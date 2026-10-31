import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100dvh] items-center bg-canvas">
      <div className="container-x w-full py-32">
        <p className="mb-6 text-[13px] uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mb-6 max-w-[14ch] text-[48px] leading-[1.05] tracking-[-0.02em] md:text-[88px]">
          This page has drifted off
        </h1>
        <p className="mb-10 max-w-[40ch] text-[17px] text-ink md:text-[19px]">
          The page you are looking for is not here. The shoreline is a short walk back.
        </p>
        <Link href="/" className="btn btn-primary">Back to the resort</Link>
      </div>
    </main>
  );
}
