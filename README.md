# XTND Connect — Website Redesign

A modern, responsive redesign of [xtndconnect.com](https://xtndconnect.com) — fiber optic, copper, enclosure and rack infrastructure.

## Stack
Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

- `index.html` — page markup
- `styles.css` — design system & layout
- `script.js` — navigation, scroll reveals, solution tabs, quote form, hero animation

## Features
- Animated "fiber light" hero, sticky glass navigation
- Product catalog grid linking to the existing shop categories
- Accessible tabbed Solutions section (keyboard arrow navigation)
- Featured products, company stats with count-up, global office contacts
- Quote request form that opens a pre-filled email to sales
- Fully responsive, respects `prefers-reduced-motion`

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy
Enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root).
