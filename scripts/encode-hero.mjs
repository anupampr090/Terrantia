// Re-encodes the hero film from the untouched source in public/media/_originals/hero/source.mp4.
//   hero.mp4        H.264, full 1920px, no audio, faststart (plays everywhere)
//   hero-poster.jpg the real first frame (1920px), so the still and the film match
// Usage: node scripts/encode-hero.mjs   (needs the ffmpeg-static dev dependency)
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import ffmpeg from "ffmpeg-static";

const root = join(import.meta.dirname, "..", "public", "media");
const src = join(root, "_originals", "hero", "source.mp4");
const out = join(root, "hero");
const kb = (p) => Math.round(statSync(p).size / 1024) + " KB";
const run = (args) => execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
// Full source size (1920x1080) and frame rate (25 fps): do not downscale or retime the hero film.
const scale = "format=yuv420p";

run(["-i", src, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "7000k", "-bufsize", "14000k", "-movflags", "+faststart", join(out, "hero.mp4")]);
console.log("hero.mp4", kb(join(out, "hero.mp4")));

run(["-i", src, "-frames:v", "1", "-vf", "scale=1920:-2:flags=lanczos", "-q:v", "2", join(out, "hero-poster.jpg")]);
console.log("hero-poster.jpg", kb(join(out, "hero-poster.jpg")));
