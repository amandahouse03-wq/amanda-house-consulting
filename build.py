#!/usr/bin/env python3
"""Wrap each page source in src/ into a full HTML page and write it to site/."""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "site"
DOMAIN = "https://www.amandahouseconsulting.com"
SITE_NAME = "Amanda House | Consulting and Advisory"
DESC = ("I help organizations find the path forward, align the people who need "
        "to make it work, and build momentum that lasts.")

PAGES = {
    "index.html": {"title": SITE_NAME, "description": DESC, "path": "/"},
}

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Amanda House Consulting">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{domain}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{domain}/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap">
<link rel="stylesheet" href="/styles.css">
<script>window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body id="top">
{body}
<script src="/main.js" defer></script>
</body>
</html>
"""

def main():
    for name, meta in PAGES.items():
        body = (SRC / name).read_text(encoding="utf-8")
        html = TEMPLATE.format(
            title=meta["title"], description=meta["description"],
            url=DOMAIN + meta["path"], domain=DOMAIN, body=body)
        (OUT / name).write_text(html, encoding="utf-8")
        print("built", name)

    urls = "".join(f"  <url><loc>{DOMAIN}{m['path']}</loc></url>\n" for m in PAGES.values())
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n",
        encoding="utf-8")
    (OUT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n", encoding="utf-8")
    print("wrote sitemap.xml, robots.txt")

if __name__ == "__main__":
    main()
