# KHOLY ART — website update (11 Nov 2026)

Static site for GitHub Pages. No build step.

## What is in this archive
- `index.html` — the whole site (markup, styles and page script inline)
- `gsap.min.js`, `ScrollTrigger.min.js` — GSAP 3.12.2, shipped locally
- `lenis.min.js` — Lenis 1.0.29 smooth scroll, shipped locally
- `img/` — 44 JPEG images, every one referenced by `index.html`

## How to deploy
1. Copy everything in this archive into the root of the Pages branch, replacing the current `index.html`.
2. KEEP these files that are already in the repo — they are not in this archive:
   - `logo.png` (the hero loads `logo.png` from the site root; the original 1638x1638 file must stay)
   - `CNAME` (custom domain kholyart.com)
   - favicon files, `robots.txt`, `sitemap.xml`, analytics or verification files, if present
3. Old gallery images (`gallery-*.jpg` and similar) are no longer referenced and can be removed, but nothing breaks if they stay.
4. Commit and push. No Jekyll processing is needed.

## External requests the page makes
- Google Fonts: Amiri, IBM Plex Sans Arabic, IBM Plex Mono, Cormorant Garamond
- WhatsApp links to wa.me/201096622627
Nothing else is loaded from a third party.

## Tested
- Headless Chrome at 1440x900 and 390x844: no script errors, no horizontal overflow.
- Not tested: real phones, Safari, and rendering with the web fonts loaded (the test machine could not reach Google Fonts).

## Known open items (content, not code)
- Some photos are screen captures of Facebook posts and are lower resolution than the rest; originals will replace them later under the same file names.
- The "kitchens and floors" service row has no hover image yet (`data-img=""`), which the script handles.
- Page direction is RTL (`dir="rtl"`, Arabic). The brand name stays in Latin as KHOLY ART.
