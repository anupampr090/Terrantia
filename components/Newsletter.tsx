"use client";
import { useState } from "react";

export default function Newsletter() {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), website: fd.get("website") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Please check your email address and try again.");
      setState("ok");
      setMsg("Thank you. You are on the list.");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex items-stretch gap-2">
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-describedby="nl-status"
          placeholder="Email address"
          className="field !min-h-11 !border-[#1c3d46] !bg-transparent !text-on-dark"
        />
        <button type="submit" disabled={state === "busy"} className="btn btn-primary min-h-11 shrink-0 px-4">Join</button>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p id="nl-status" role="status" className={`mt-1 min-h-[1.5em] text-[14px] ${state === "error" ? "text-[#e08a8f]" : "text-on-dark-muted"}`}>
        {msg}
      </p>
    </form>
  );
}
