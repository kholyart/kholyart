# KHOLY ART website

Static site for GitHub Pages (kholyart.com). No build step here; the files are generated.

- `index.html`, `css/site.css`, `js/site.js`: the site (home and every work page, routed by `#work-<id>`)
- `js/data.js`: the works; `js/i18n.js`: English layer (Arabic is the source; first visit follows the device language, the header button switches, `?lang=en|ar` forces)
- `js/mosaic3d.js` + `js/three.module.min.js`: the tile transition in the opening picture
- `img/`, `video/`, `fonts/`: media and self-hosted fonts
- `CNAME`, `.htaccess`, `logo.png`, `favicon.png`: keep

External requests: WhatsApp links (wa.me/201096622627) and the photo upload (Google Apps Script, to the owner's Drive). Nothing else.

The previous site is kept on the branch `backup-before-2026-11-14`.
