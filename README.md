# Sonojas (Snojas) Landing Page

Simple static landing page scaffold with inquiry form and partner logo marquee.

Files:
- `index.html` — main page
- `styles.css` — styles
- `script.js` — client logic (form, specialization population)
- `logos/` — placeholder SVG logos
 - `bg/` — placeholder student illustrations and where to place your real background photo

Open `index.html` in a browser to view the page.

Next steps:
- Replace placeholder logos with real university logos in `logos/`.
- Hook `script.js` form submit to a backend endpoint to persist inquiries.
 
Background photo:
- To use a real photo as the page background, place an image named `photo.jpg` in the `bg/` folder (path: `bg/photo.jpg`).
- The stylesheet already falls back to `bg/student1.svg` if `photo.jpg` is missing.
- Recommended size: at least 1600×900 (web-optimized, 200–400 KB) for good quality.
 - To use a real photo as the page background, place an image named `A.png` (preferred) or `B.png` in the `bg/` folder (path: `bg/A.png` or `bg/B.png`).
 - The stylesheet will try `bg/A.png` first, then `bg/B.png`, then `bg/photo.jpg` as fallbacks.
 - Recommended size: at least 1600×900 (web-optimized, 200–400 KB) for good quality.

Place your chosen image in `bg/` (for example `bg/A.png`) and refresh the page.

Notes for best results:
- For the `main` background that fills the page width without cropping, use a wide image (recommended 1920×1080 or wider). The stylesheet uses `background-size: 100% auto` so the image width will match the viewport width.
- For the hero logo area keep text readable — hero now has no image background (logo text shows over page background).
