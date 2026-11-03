# XTND Connect — Website Redesign

A modern, responsive, multi-page redesign of [xtndconnect.com](https://xtndconnect.com) — fiber optic, copper, enclosure and rack infrastructure.

**Live:** https://panarabia2026.github.io/xtndconnect-website/

## Pages
| Page | What it does |
|---|---|
| `index.html` | Home — hero, product families, solution tabs, featured products, certifications |
| `products.html` | Full catalog of 130 products with category filters, sub-category chips, search, sort and product detail pop-ups. Deep links: `?cat=racks`, `?q=mtp`, `?id=4622` |
| `solutions.html` | Data Center, Telco & FTTx, Enterprise LAN, Ultra High Density, Industrial & Hazardous |
| `catalogs.html` | Downloadable PDF catalogues and data sheets |
| `resources.html` | ISO certificates, technical data sheets, manuals, FAQ |
| `partners.html` | Partner program and application form |
| `about.html` | Company story, values, certifications |
| `contact.html` | Contact channels, regional offices, quote request form |

## Structure
- `assets/css/styles.css` — design system and layout
- `assets/js/layout.js` — shared header, footer, menu, product modal, tabs, forms
- `assets/js/pages.js` — page-specific rendering (catalog, downloads, tiles)
- `data/products.js` — product data (name, category, description, image, link)
- `assets/products/` — product photos, cropped and centred on a uniform white square

Plain HTML, CSS and JavaScript — no build step. Forms open a pre-filled email to `sales@xtndconnect.com`; PDFs and "Full specifications" links point to the existing xtndconnect.com files.

## Run locally
Open `index.html` in a browser, or serve the folder with any static server.

## Refreshing products
`tools/build-data.ps1` rebuilds `data/products.js` and the cleaned product images from the shop's product feed (see comments in the script).
