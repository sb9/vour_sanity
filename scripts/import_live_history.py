import argparse
import html
import json
import re
from pathlib import Path


DATE_PATTERN = re.compile(r"(\d{2})\.(\d{2})\.(\d{4})")
ROW_PATTERN = re.compile(r"<tr\b[^>]*>(.*?)</tr\s*>", re.IGNORECASE | re.DOTALL)
CELL_PATTERN = re.compile(r"<td\b[^>]*>(.*?)</td\s*>", re.IGNORECASE | re.DOTALL)
LINK_PATTERN = re.compile(
    r"<a\b[^>]*?\bhref\s*=\s*(['\"])(.*?)\1[^>]*>(.*?)</a\s*>",
    re.IGNORECASE | re.DOTALL,
)


def plain_text(markup):
    markup = re.sub(r"<!--.*?-->", " ", markup, flags=re.DOTALL)
    markup = re.sub(r"<br\s*/?>", "\n", markup, flags=re.IGNORECASE)
    markup = re.sub(r"</(?:p|div|li|h[1-6])\s*>", "\n", markup, flags=re.IGNORECASE)
    markup = re.sub(r"<[^>]*>", " ", markup)
    lines = [" ".join(html.unescape(line).split()) for line in markup.splitlines()]
    return "\n".join(line for line in lines if line)


def parse_event(row, index):
    cells = CELL_PATTERN.findall(row)
    if len(cells) < 2:
        return None

    date_text = plain_text(cells[0]).strip()
    date_match = DATE_PATTERN.search(date_text)
    date_note = None
    date = None
    if date_match:
        day, month, year = date_match.groups()
        date = f"{year}-{month}-{day}"
    elif re.search(r"\bSommer\s+2020\b", date_text, re.IGNORECASE):
        date_note = "Sommer 2020"
    else:
        return None

    description = plain_text(cells[1])
    links = []
    for match in LINK_PATTERN.finditer(cells[1]):
        label = plain_text(match.group(3))
        url = html.unescape(match.group(2)).strip()
        if label and url.startswith(("http://", "https://")):
            links.append({"label": label, "url": url})

    first_link = links[0] if links else None
    map_link = next(
        (link for link in links if "maps" in link["url"].lower() or "goo.gl" in link["url"].lower()),
        None,
    )
    slug_source = first_link["label"] if first_link else description.split("\n", 1)[0]
    slug = re.sub(r"[^a-z0-9]+", "-", slug_source.lower()).strip("-") or f"event-{index}"
    stable_date = date.replace("-", "") if date else "summer-2020"

    return {
        "_id": f"legacy-{stable_date}-{index:02d}",
        "_type": "gig",
        "title": first_link["label"] if first_link else slug_source[:100],
        "slug": {"_type": "slug", "current": f"{stable_date}-{slug}"[:96]},
        "date": date,
        "dateNote": date_note,
        "status": "cancelled" if re.search(r"ABGESAGT", row, re.IGNORECASE) else "confirmed",
        "venue": first_link["label"] if first_link else None,
        "venueUrl": first_link["url"] if first_link else None,
        "mapsUrl": map_link["url"] if map_link else None,
        "location": map_link["label"] if map_link else None,
        "description": description,
        "relatedLinks": links,
        "showInApp": True,
        "showOnWebsite": True,
    }


def main():
    parser = argparse.ArgumentParser(description="Convert the existing VOUR live table to Sanity documents.")
    parser.add_argument("source", type=Path, help="Path to pages/live.html")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/live-history.json"),
        help="Output JSON file (default: data/live-history.json)",
    )
    args = parser.parse_args()

    source = args.source.read_text(encoding="utf-8")
    events = []
    for index, row in enumerate(ROW_PATTERN.findall(source), start=1):
        event = parse_event(row, index)
        if event is not None:
            events.append(event)
    if not events:
        raise SystemExit("No dated concert rows were found; no output written.")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(events, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(events)} events to {args.output}")


if __name__ == "__main__":
    main()
