import argparse
import os
import re
from datetime import datetime
from pathlib import Path

import mammoth


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def convert_docx_to_markdown(input_path: Path, output_md: Path, assets_dir: Path):
    ensure_dir(assets_dir)
    output_dir = output_md.parent
    ensure_dir(output_dir)

    counter = {"i": 0}

    def convert_image(image):
        content_type = image.content_type or "image/png"
        ext = content_type.split("/")[-1].split(";")[0].strip()
        if not ext or ext == "jpeg":
            ext = "jpg"
        counter["i"] += 1
        filename = f"image{counter['i']}.{ext}"
        abs_path = assets_dir / filename
        with image.open() as image_bytes:
            with open(abs_path, "wb") as f:
                f.write(image_bytes.read())
        rel_path = os.path.relpath(abs_path, output_dir)
        return {"src": rel_path}

    with open(input_path, "rb") as docx_file:
        result = mammoth.convert_to_markdown(docx_file, convert_image=convert_image)
        md = result.value

    # Remove author lines (中文/英文常见格式)
    author_patterns = [
        r"^作\s*者[:：].*$",
        r"^\s*Author[:：].*$",
        r"^\s*作者信息[:：].*$",
    ]
    for pat in author_patterns:
        md = re.sub(pat, "", md, flags=re.IGNORECASE | re.MULTILINE)

    # Collapse multiple blank lines
    md = re.sub(r"\n{3,}", "\n\n", md)

    return md


def write_with_frontmatter(md_body: str, output_md: Path, title: str, date_str: str):
    frontmatter = [
        "---",
        f"date: {date_str}",
        "categories:",
        "  - Check Point",
        "  - Network Security",
        f"title: {title}",
        "---",
        "",
    ]
    with open(output_md, "w", encoding="utf-8") as f:
        f.write("\n".join(frontmatter))
        f.write(md_body.strip() + "\n")


def main():
    parser = argparse.ArgumentParser(description="Convert .docx to Markdown (MkDocs blog post)")
    parser.add_argument("--input", required=True, help="Path to input .docx")
    parser.add_argument("--output", required=True, help="Path to output .md")
    parser.add_argument("--assets-dir", required=True, help="Directory to store extracted images")
    parser.add_argument("--title", required=True, help="Post title")
    parser.add_argument("--date", required=True, help="Post date YYYY-MM-DD")
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_md = Path(args.output).resolve()
    assets_dir = Path(args.assets_dir).resolve()

    # Validate date
    try:
        datetime.strptime(args.date, "%Y-%m-%d")
    except ValueError:
        raise SystemExit("Invalid --date format, expected YYYY-MM-DD")

    md_body = convert_docx_to_markdown(input_path, output_md, assets_dir)
    write_with_frontmatter(md_body, output_md, args.title, args.date)
    print(f"Converted {input_path} -> {output_md}")


if __name__ == "__main__":
    main()

