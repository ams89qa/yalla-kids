# Yalla Kids

Qatar's kids' classes and places — one place to book. Bilingual (EN/AR), built in Doha.

## Status

Static-site prototype, being wired up to a real backend (Supabase).

## Running locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Stack

- Static HTML + CSS + vanilla JS (no framework)
- Shared files: `yalla-kids-shared.css`, `yalla-kids-shared.js`, `yalla-kids-data.js`
- Bilingual: `.en-only` / `.ar-only` span toggle, RTL via `<html dir="rtl">`
- Hosting: Netlify
- Backend (in progress): Supabase

## Structure

- `index.html` — homepage (copy of `yalla-kids-home-wireframe.html` for `/` routing)
- `yalla-kids-*.html` — all pages, flat folder
- `yalla-kids-data.js` — seed data (will move to Supabase)
- `sitemap.xml`, `robots.txt` — SEO
