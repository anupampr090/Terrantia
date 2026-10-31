import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Decorative arrow that nudges 4px on hover or focus of its `group` parent. */
export function ArrowIcon() {
  return (
    <ArrowRight
      size={16}
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
    />
  );
}

export default function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link group inline-flex min-h-11 items-center gap-2 ${className}`}>
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
