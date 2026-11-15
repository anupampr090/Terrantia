// Booking request references: RS-<year>-<6 chars>.
// The alphabet leaves out 0, O, 1, I and L so a reference survives being read
// aloud or copied by hand. 31^6 is about 887 million combinations per year.

import { randomInt } from "node:crypto";
import { hasReference } from "./store";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const MAX_TRIES = 5;

// References issued by this process. Covers the case where the file store is
// unavailable, and two requests racing before either one is saved.
const g = globalThis as unknown as { __terrantiaRefs?: Set<string> };
const issued = (g.__terrantiaRefs ??= new Set<string>());

function chars(n: number) {
  let out = "";
  for (let i = 0; i < n; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** A correctly shaped reference with no uniqueness check (used for honeypot replies). */
export function randomReference(length = 6): string {
  return `RS-${new Date().getFullYear()}-${chars(length)}`;
}

/** A reference not used by any stored booking or by this process. Never throws. */
export async function newReference(): Promise<string> {
  for (let i = 0; i < MAX_TRIES; i++) {
    const ref = randomReference();
    if (issued.has(ref)) continue;
    if (await hasReference(ref)) continue;
    issued.add(ref);
    return ref;
  }
  // Five collisions in a row is practically impossible. A longer code keeps the
  // request moving and cannot clash with any 6 character reference.
  const ref = randomReference(10);
  issued.add(ref);
  return ref;
}
