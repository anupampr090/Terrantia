// Append-only JSON Lines file store.
//
// IMPORTANT: this is a file store for a SINGLE long-running server (self-hosting
// and local dev). Each record is one JSON line in <DATA_DIR>/<kind>.jsonl.
// Serverless hosts such as Vercel have a read-only or throwaway filesystem, so
// nothing written here survives there: those hosts need a database
// (plan.md phase 2: Postgres with Drizzle). On such hosts every function below
// reports failure quietly instead of throwing, and mail is the only delivery.
//
// The files hold guest personal data. Keep DATA_DIR out of git and out of any
// publicly served folder.

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type RecordKind = "booking" | "newsletter" | "enquiry";

function dataDir() {
  // path.resolve is relative to process.cwd() when DATA_DIR is not absolute.
  const dir = process.env.DATA_DIR?.trim() || ".data";
  // turbopackIgnore: a runtime data folder, not part of the build. Without it the bundler traces the whole project.
  return path.isAbsolute(dir) ? dir : path.join(/* turbopackIgnore: true */ process.cwd(), dir);
}

function fileFor(kind: RecordKind) {
  return path.join(dataDir(), `${kind}.jsonl`);
}

let warned = false;
function warnOnce(action: string, err: unknown) {
  if (warned) return;
  warned = true;
  const code = (err as NodeJS.ErrnoException | null)?.code ?? "unknown";
  console.warn(
    `[store:unavailable] ${action} failed (${code}) in ${dataDir()}. Records are not being stored. ` +
      "This file store needs a writable disk on a single server; use a database on serverless hosts.",
  );
}

/** Appends one record as a JSON line. Never throws. */
export async function saveRecord(kind: RecordKind, record: Record<string, unknown>): Promise<{ ok: boolean }> {
  try {
    await mkdir(dataDir(), { recursive: true });
    const line = JSON.stringify({ savedAt: new Date().toISOString(), ...record }) + "\n";
    await appendFile(fileFor(kind), line, "utf8");
    return { ok: true };
  } catch (err) {
    warnOnce("write", err);
    return { ok: false };
  }
}

/** Reads all lines of a kind. A missing file is an empty list. Never throws. */
async function readLines(kind: RecordKind): Promise<Record<string, unknown>[]> {
  let raw: string;
  try {
    raw = await readFile(fileFor(kind), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException | null)?.code !== "ENOENT") warnOnce("read", err);
    return [];
  }
  const out: Record<string, unknown>[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const v: unknown = JSON.parse(line);
      if (v && typeof v === "object") out.push(v as Record<string, unknown>);
    } catch {
      // A torn or hand-edited line is skipped, not fatal.
    }
  }
  return out;
}

/** True when a stored booking already uses this reference. Never throws. */
export async function hasReference(ref: string): Promise<boolean> {
  const rows = await readLines("booking");
  return rows.some((r) => r.reference === ref);
}

/** True when this address is already on the newsletter list. Never throws. */
export async function hasNewsletterEmail(email: string): Promise<boolean> {
  const wanted = email.trim().toLowerCase();
  const rows = await readLines("newsletter");
  return rows.some((r) => typeof r.email === "string" && r.email.toLowerCase() === wanted);
}
