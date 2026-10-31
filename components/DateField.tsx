"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { X } from "lucide-react";
import "react-day-picker/style.css";

export function toISO(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function fromISO(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function label(s: string) {
  const d = fromISO(s);
  return d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "";
}

type Props = {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

/**
 * Renders two grid cells (check-in, check-out) as fragment children so the parent grid lays them out.
 * Both open one shared range picker: a bottom sheet on phones, a centred panel from md up.
 */
export default function DateRangeFields({ checkIn, checkOut, onChange, invalid, describedBy }: Props) {
  const [open, setOpen] = useState<null | "in" | "out">(null);
  const [mounted, setMounted] = useState(false);
  const [months, setMonths] = useState(1);
  const inBtn = useRef<HTMLButtonElement>(null);
  const outBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setMonths(window.matchMedia("(min-width: 768px)").matches ? 2 : 1);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); setOpen(null); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(
        panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), [tabindex='0']"),
      );
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      opener.current?.focus();
    };
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = fromISO(checkIn);
  const to = fromISO(checkOut);

  function pick(day: Date) {
    const iso = toISO(day);
    if (!from || to) {
      onChange(iso, "");
      setOpen("out");
    } else if (iso < checkIn) {
      onChange(iso, "");
    } else if (iso === checkIn) {
      return;
    } else {
      onChange(checkIn, iso);
      setOpen(null);
    }
  }

  function trigger(kind: "in" | "out") {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      opener.current = e.currentTarget;
      setOpen(kind);
    };
  }

  const value = (iso: string) => label(iso) || <span className="text-muted">Add date</span>;
  const btnCls =
    "field flex items-center text-left hover:border-accent";

  return (
    <>
      <div>
        <label className="field-label" id="bb-in-l" htmlFor="bb-in">Check-in</label>
        <button
          ref={inBtn} id="bb-in" type="button" className={btnCls}
          aria-haspopup="dialog" aria-expanded={open === "in"}
          aria-invalid={invalid || undefined} aria-describedby={describedBy}
          onClick={trigger("in")}
        >
          {value(checkIn)}
        </button>
      </div>
      <div>
        <label className="field-label" id="bb-out-l" htmlFor="bb-out">Check-out</label>
        <button
          ref={outBtn} id="bb-out" type="button" className={btnCls}
          aria-haspopup="dialog" aria-expanded={open === "out"}
          aria-invalid={invalid || undefined} aria-describedby={describedBy}
          onClick={trigger("out")}
        >
          {value(checkOut)}
        </button>
      </div>

      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
            <div className="absolute inset-0 bg-dark/60" aria-hidden="true" onClick={() => setOpen(null)} />
            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={open === "in" ? "Choose check-in date" : "Choose check-out date"}
              tabIndex={-1}
              className="relative max-h-[92dvh] w-full overflow-auto rounded-t-2xl bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink shadow-2xl outline-none md:w-auto md:rounded-2xl md:p-6"
              style={
                {
                  "--rdp-accent-color": "var(--color-accent)",
                  "--rdp-accent-background-color": "var(--color-surface)",
                  "--rdp-range_start-color": "var(--color-on-accent)",
                  "--rdp-range_end-color": "var(--color-on-accent)",
                  "--rdp-today-color": "var(--color-ink)",
                  "--rdp-range_start-date-background-color": "var(--color-accent)",
                  "--rdp-range_end-date-background-color": "var(--color-accent)",
                  "--rdp-range_start-background": "var(--color-accent)",
                  "--rdp-range_end-background": "var(--color-accent)",
                  "--rdp-range_middle-background-color": "var(--color-surface)",
                  "--rdp-range_middle-color": "var(--color-ink)",
                  "--rdp-selected-border": "2px solid var(--color-accent)",
                  fontSize: "15px",
                } as React.CSSProperties
              }
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-[24px] leading-none text-ink">
                  {open === "in" ? "Choose check-in" : "Choose check-out"}
                </p>
                <button type="button" aria-label="Close calendar" onClick={() => setOpen(null)} className="-mr-2 inline-flex h-11 w-11 items-center justify-center">
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              <div className="flex justify-center">
                <DayPicker
                  mode="range"
                  numberOfMonths={months}
                  selected={from ? { from, to } : undefined}
                  defaultMonth={from ?? today}
                  startMonth={today}
                  disabled={{ before: today }}
                  onDayClick={(d, modifiers) => { if (!modifiers.disabled) pick(d); }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
