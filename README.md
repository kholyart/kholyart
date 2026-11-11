# KHOLY ART website

Static site for GitHub Pages (kholyart.com). No build step.

## Files
- `index.html`: the page (Arabic, RTL, Modern Standard Arabic copy)
- `css/site.css`: site styles, built on Arabesque tokens (`--al-*`)
- `js/site.js`: carousel, works filter, reveals, project view (`#project/<id>`), WhatsApp message
- `vendor/arabesque/`: Arabesque v0.9.0, the Arabesque Labs design system (MIT; see its `LICENSE` and `NOTICE.md`): the CSS bundle, self-hosted fonts (OFL) and the pattern tile
- `vendor/lenis.min.js`: Lenis 1.0.29 smooth scroll (off under reduced motion)
- `img/`: photos, `tesserae.svg` / `tesserae-dark.svg` (the glass-tile fill for headings, dark and light themes), `pattern-quiet-light.svg` (Arabesque's quiet pattern in dark ink, for the light theme) and `mark-light.png` (the logo star, light on transparent)
- `logo.png`, `CNAME`, `.htaccess`: keep

## Design rules in use
- Dark theme only (`data-theme="dark"` on `<html>`).
- Colours, type sizes, spacing and durations come from Arabesque tokens; layout uses logical properties only.
- Section headings use the mosaic lettering (Amiri filled with glass tiles). The tiles are still.
- The carousel turns only when the page is scrolled, the carousel is dragged, or with the arrow keys. To bring back an idle spin, set `IDLE` in `js/site.js` (and add a pause control, per WCAG 2.2.2).
- Digits are Western (123) throughout, as Arabesque recommends.

## External requests
- WhatsApp links to wa.me/201096622627. Nothing else is loaded from a third party.

## Content notes
- The first testimonial is quoted verbatim, so it stays in the customer's own (Egyptian) words.
- The "kitchens and floors" service has no hover image yet (`data-img=""`).
