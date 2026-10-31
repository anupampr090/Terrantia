"""
One soft warm-teal grade for every still in public/media (rooms, experiences, gallery).

- Originals are copied once to public/media/_originals/<same path> and always re-read from there,
  so running this script again never stacks the grade.
- Per image: tame blown highlights, pull saturation toward a shared target, then split-tone
  (shadows lean teal, highlights lean warm) and add a touch of contrast.

Usage: python scripts/grade-media.py
"""
from pathlib import Path
import shutil
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "media"
BACKUP = ROOT / "_originals"
FOLDERS = ["rooms", "experiences", "gallery"]

TARGET_SAT = 0.30          # shared saturation target (0..1, HSV mean)
SHADOW_TINT = np.array([-0.020, 0.012, 0.030])     # lean teal in the shadows
HIGHLIGHT_TINT = np.array([0.026, 0.010, -0.018])  # lean warm in the highlights


def srgb_to_lin(x):
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(x):
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(np.clip(x, 0, None), 1 / 2.4) - 0.055)


def grade(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    lum = (a * np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)).sum(axis=2)
    mean_l = float(lum.mean())

    # 1) tame blown highlights: stronger the brighter the image is overall
    knee = 0.66 if mean_l > 0.60 else 0.82
    strength = 0.75 if mean_l > 0.60 else 0.42
    over = np.clip(a - knee, 0, None)
    a = a - over * strength
    if mean_l > 0.62:                      # washed-out frames also get a little more depth
        a = np.clip((a - 0.5) * 1.14 + 0.5 - 0.05, 0, 1)

    # 2) pull saturation toward the shared target (both directions, bounded)
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    mean_s = float(sat.mean())
    factor = float(np.clip(TARGET_SAT / max(mean_s, 1e-3), 0.62, 1.2))
    gray = a.mean(axis=2, keepdims=True)
    a = np.clip(gray + (a - gray) * factor, 0, 1)

    # 2b) calm yellow-green foliage and lawns (hue 55 to 150 degrees) so greens sit with the teal palette
    hsv = np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8), "RGB").convert("HSV"), dtype=np.float32)
    hue = hsv[..., 0] * (360.0 / 255.0)
    green = np.clip(1 - np.abs(hue - 100) / 50.0, 0, 1)
    hsv[..., 1] = hsv[..., 1] * (1 - 0.28 * green)
    hsv[..., 0] = np.where(green > 0, (hue + 14 * green) * (255.0 / 360.0), hsv[..., 0])  # nudge yellow-green toward green-teal
    a = np.asarray(Image.fromarray(np.clip(hsv, 0, 255).astype(np.uint8), "HSV").convert("RGB"), dtype=np.float32) / 255.0

    # 3) split tone: teal shadows, warm highlights
    lum2 = (a * np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)).sum(axis=2, keepdims=True)
    w_hi = np.clip((lum2 - 0.45) / 0.55, 0, 1)
    w_lo = np.clip((0.55 - lum2) / 0.55, 0, 1)
    a = a + w_lo * SHADOW_TINT + w_hi * HIGHLIGHT_TINT

    # 4) gentle S-curve for contrast
    a = np.clip(a, 0, 1)
    a = a + 0.10 * (a - 0.5) * (1 - np.abs(a - 0.5) * 2) * 2

    out = (np.clip(a, 0, 1) * 255.0 + 0.5).astype(np.uint8)
    return Image.fromarray(out, "RGB")


def main():
    n = 0
    for folder in FOLDERS:
        for src in sorted((ROOT / folder).glob("*.jpg")):
            rel = src.relative_to(ROOT)
            backup = BACKUP / rel
            if not backup.exists():
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, backup)
            with Image.open(backup) as im:
                exif = im.info.get("exif")
                graded = grade(im)
            kwargs = {"quality": 86, "optimize": True, "progressive": True}
            if exif:
                kwargs["exif"] = exif
            graded.save(src, "JPEG", **kwargs)
            n += 1
            print(f"graded {rel}  ({src.stat().st_size // 1024} KB)")
    print(f"done: {n} images, originals in {BACKUP}")


if __name__ == "__main__":
    main()
