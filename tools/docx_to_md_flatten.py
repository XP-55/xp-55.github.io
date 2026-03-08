from docx2python import docx2python
from pathlib import Path
import argparse
import os
import re


def flatten(x):
    if isinstance(x, str):
        return [x]
    out = []
    try:
        for y in x:
            out.extend(flatten(y))
    except TypeError:
        pass
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--date", required=True)  # YYYY-MM-DD
    args = ap.parse_args()

    input_path = Path(args.input).expanduser()
    output_md = Path(args.output)
    os.makedirs(output_md.parent, exist_ok=True)

    with docx2python(str(input_path)) as doc:
        parts = flatten(doc.body)
        text = "\n\n".join(p for p in parts if isinstance(p, str) and p.strip())

    # Remove author lines
    text = re.sub(r"^\s*作\s*者[:：].*$", "", text, flags=re.M | re.I)
    text = re.sub(r"^\s*Author[:：].*$", "", text, flags=re.M | re.I)
    text = re.sub(r"\n{3,}", "\n\n", text)

    front = "\n".join(
        [
            "---",
            f"date: {args.date}",
            "categories:",
            "  - Check Point",
            "  - Network Security",
            f"title: {args.title}",
            "---",
            "",
        ]
    )

    output_md.write_text(front + text + "\n", encoding="utf-8")
    print(f"Written: {output_md}")


if __name__ == "__main__":
    main()

