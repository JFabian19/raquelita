from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


IMAGE_ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def max_size_for(path: Path) -> tuple[int, int]:
    if "referencias" in {part.lower() for part in path.parts}:
        return (960, 760)
    return (1920, 1280)


def normalized_mode(image: Image.Image) -> Image.Image:
    if image.mode in {"RGBA", "LA"} or "transparency" in image.info:
        return image.convert("RGBA")
    return image.convert("RGB")


def optimize_group(files: list[Path]) -> tuple[int, int, Path]:
    webp_files = [path for path in files if path.suffix.lower() == ".webp"]
    source = webp_files[0] if webp_files else max(files, key=lambda path: path.stat().st_size)
    output = source.with_suffix(".webp")
    temporary = output.with_name(f".{output.stem}-optimized.webp")

    before = sum(path.stat().st_size for path in files)
    with Image.open(source) as raw:
        image = normalized_mode(ImageOps.exif_transpose(raw))
        image.thumbnail(max_size_for(source), Image.Resampling.LANCZOS)
        image.save(temporary, "WEBP", quality=80, method=6)

    if output.exists() and temporary.stat().st_size >= output.stat().st_size:
        temporary.unlink()
    else:
        temporary.replace(output)

    with Image.open(output) as check:
        check.verify()

    for path in files:
        if path != output and path.exists():
            path.unlink()

    after = output.stat().st_size
    return before, after, output


groups: dict[tuple[Path, str], list[Path]] = {}
for path in IMAGE_ROOT.rglob("*"):
    if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS:
        groups.setdefault((path.parent, path.stem.lower()), []).append(path)

total_before = 0
total_after = 0
for files in groups.values():
    before, after, output = optimize_group(files)
    total_before += before
    total_after += after
    print(f"{output.relative_to(IMAGE_ROOT)}: {before // 1024} KB -> {after // 1024} KB")

saved = total_before - total_after
print(f"TOTAL: {total_before / 1024 / 1024:.2f} MB -> {total_after / 1024 / 1024:.2f} MB")
print(f"AHORRO: {saved / 1024 / 1024:.2f} MB")
