# TOOLWERK — Industrial Tools & Equipment Website

A complete, production-ready marketing and product-catalogue website for a business dealing in
industrial tools, equipment and machinery — with a WordPress-style admin panel for managing the
catalogue and site content.

Built as plain HTML, CSS and JavaScript. **No build step, no framework, no database, no server
code.** Upload the folder to any host and it runs.

**Live site:** https://vaibhav2304.github.io/toolwerk-website/
**Admin panel:** https://vaibhav2304.github.io/toolwerk-website/admin.html — `admin` / `admin`

---

## Table of contents

1. [Tech stack](#1-tech-stack)
2. [Architecture](#2-architecture)
3. [Data model](#3-data-model)
4. [Pages](#4-pages)
5. [Lead capture](#5-lead-capture-the-commercial-engine)
6. [Admin panel — full operations guide](#6-admin-panel--full-operations-guide)
7. [How saving and publishing works](#7-how-saving-and-publishing-works-important)
8. [Design system](#8-design-system)
9. [Running locally](#9-running-locally)
10. [Deployment](#10-deployment)
11. [Customisation recipes](#11-customisation-recipes)
12. [Security notes](#12-security-notes)
13. [Browser support & accessibility](#13-browser-support--accessibility)
14. [Known limitations & upgrade path](#14-known-limitations--upgrade-path)
15. [File map](#15-file-map)

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Markup | Semantic HTML5 | Crawlable by Google, no JS needed for meta/SEO |
| Styling | Hand-written CSS, custom properties, Grid + Flexbox | No Tailwind/Bootstrap build chain; one `:root` token block controls the entire theme |
| Behaviour | Vanilla JavaScript (ES2020), no dependencies | Zero `npm install`, zero supply-chain risk, nothing to keep updated |
| Data | JSON object in `assets/js/data.js`, overridden by `localStorage` | Editable content with no database |
| Animation | CSS transitions + `IntersectionObserver` + `requestAnimationFrame` | Smooth parallax and scroll reveals without a library |
| Fonts | Google Fonts — Barlow Condensed + Inter | Industrial headline voice, highly legible body |
| Images | Generated inline SVG data-URIs | Site works fully offline; replace with real photos from admin |
| Admin | Hash-routed single-page app in `admin.js` | Feels like WordPress, ships as one file |

**Total payload:** ~210 KB for the entire site. No runtime dependencies whatsoever.

---

## 2. Architecture

The site is a **static multi-page application**. Each page is real HTML with its own `<title>`
and meta description (good for SEO), and shares three scripts:

```
data.js   →  seed content + storage layer (the "database")
site.js   →  shared chrome and page logic (header, footer, nav, modal, catalog, product)
admin.js  →  admin panel (loaded only by admin.html)
```

**Rendering flow on every public page:**

1. `data.js` loads the content — from `localStorage` if the visitor has saved edits, otherwise
   from the `TW_SEED` object baked into the file.
2. `site.js` calls `boot('pagename')`, which injects the header (with the category mega-menu built
   from live data), the footer, the floating call/WhatsApp buttons, the mobile action bar, and the
   global enquiry modal.
3. The page's own inline script renders its sections from the same data.
4. `initMotion()` wires up scroll reveals, parallax layers and stat counters.

This means **the navigation, filters, footer links and homepage grid all rebuild themselves
automatically** when you add a category in the admin panel. Nothing is hard-coded twice.

---

## 3. Data model

Everything lives in one object, persisted to `localStorage` under the key `TW_DB_v1`:

```js
{
  settings:   { brand, tagline, phone, phone2, whatsapp, email, address, hours, gst,
                mapEmbed, heroSlides[], stats[], usps[], about{}, ctaBand{}, marquee[], social{} },
  categories: [ { id, name, slug, icon, desc, img, subs:[{id, name}] } ],
  products:   [ { id, name, slug, cat, sub, brand, model, sku, featured, badge, stock, moq,
                  short, desc, images[], specs[[key,value]], features[], applications[],
                  includes, tags[] } ],
  pages:      { services[], industries[], faqs[], testimonials[] },
  leads:      [ { id, date, name, phone, email, company, city, product, qty,
                  message, source, status } ]
}
```

The `TW` object in `data.js` is the access layer — `TW.prods`, `TW.cat(id)`, `TW.sub(cat,sub)`,
`TW.countIn(cat)`, `TW.addLead(obj)`, `TW.save()`, `TW.reset()`. Every page and the admin panel
go through it, so swapping `localStorage` for a real API later means rewriting one small object.

---

## 4. Pages

| File | Contents |
|---|---|
| `index.html` | Parallax hero slider (3 auto-rotating slides), trust strip, scrolling brand marquee, category grid, featured product rail, why-us blocks, parallax band with animated counters, about split, new-arrivals rail, CTA band, testimonials, enquiry form + Google Map |
| `products.html` | Full catalogue. Sidebar filters (category → sub-category, brand), live search across name/brand/model/SKU/tags, sorting, removable filter chips, URL-synced state so filtered views are shareable and bookmarkable |
| `product.html?id=…` | Image gallery with thumbnails, short + long description, tabbed panel (Description / Technical Specifications / Features / Applications / Enquire), SKU–category–availability–MOQ bar, price-on-enquiry box with three CTAs, related products, closing CTA band |
| `featured.html` | Featured / special range, grouped by category with per-category links |
| `services.html` | Service blocks, AMC parallax CTA, 4-step "enquiry to commissioning" process, service-request form |
| `about.html` | Company story, animated stats, industries served, FAQ accordion |
| `contact.html` | Call / WhatsApp / email / address cards, embedded map, full enquiry form with enquiry-type selector |
| `admin.html` | Admin panel (login gate + hash-routed SPA) |

---

## 5. Lead capture (the commercial engine)

There is **no public price list anywhere** — deliberately. Industrial pricing depends on
configuration, quantity and destination; publishing numbers either loses the buyer or commits you
before you've scoped the job. Every route ends in "price on enquiry", which forces contact.

Every one of these writes to the same **Enquiries** inbox in the admin panel:

- Header **Call Now** and **Get Enquiry** buttons (sticky on scroll)
- Floating WhatsApp + call bubbles, bottom-right, every page
- Sticky mobile bottom bar — Call · WhatsApp · Enquire
- **Enquire** button on every product card in every grid and rail
- Product page: enquiry button, call button, WhatsApp-this-product (pre-fills the product name in
  the chat), plus a full enquiry form in the tab panel
- Homepage enquiry form, contact form, service-request form
- Global enquiry modal — opens from any CTA, pre-fills the product it was launched from
- Empty search results and catalogue footer both convert into "tell us what you need" prompts

Each captured lead records name, phone, email, company, city, product, quantity, message,
**which form it came from**, and a status you can move through New → Contacted → Quoted → Won → Lost.

---

## 6. Admin panel — full operations guide

Open `/admin.html`, log in with `admin` / `admin`.

### Dashboard
Live counts (products, categories, featured, new enquiries), the six most recent enquiries, the
five most recently edited products, and quick-action buttons.

### Products
The main workflow. **Products → Add New** or click any product to edit.

- **Basic information** — name, brand, model number, SKU, short description (shows on cards),
  full description (blank line between paragraphs = new paragraph)
- **Technical specifications** — unlimited key/value rows via *Add specification row*; renders as
  the spec table on the product page
- **Key features** and **Applications** — repeatable bullet lists
- **Publish box** — category, sub-category, "show in Featured range" toggle, badge text
  (Best Seller / New / IS Certified…), availability, MOQ, "supplied with", search tags
- **Images** — upload from your computer (multiple at once), paste an image URL, or generate a
  placeholder. First image is the card thumbnail; the rest become gallery thumbnails
- Delete from the product list; a confirm dialog guards it

The URL slug is generated from the product name automatically.

### Categories
Add, rename and delete categories and sub-categories; set the emoji icon, URL slug, description
and category image. **Changes propagate instantly** to the mega-menu, catalogue filters, homepage
grid and footer. A category containing products can't be deleted until they're moved.

### Homepage & Content
Ten tabs covering every piece of editorial copy on the site:
hero slides (text + background image; wrap a word in `<em>…</em>` to highlight it amber) ·
why-us blocks · stat counters · about section · CTA band · scrolling brand strip · testimonials ·
FAQs · services blocks · industries list.

### Enquiries
Every lead with clickable phone and email links, the requirement, quantity, source form and date.
Change status inline, delete individually, or **Export CSV** for your sales team or CRM.

### Site Settings
Brand name and sub-line, tagline, GSTIN, both phone numbers, WhatsApp number, email, business
hours, address, Google Maps embed URL, social links — and **Admin Access** to change the
username and password from the defaults.

> The phone and WhatsApp numbers here power *every* call and chat CTA across the site. Change
> them once and the whole site updates.

### Tools & Backup
- **Export all content (JSON)** — full backup including enquiries
- **Export as `data-seed.js`** — your content as a drop-in replacement for the seed block
- **Import** — restore from a JSON backup
- **Reset to factory content** — discard all local changes

---

## 7. How saving and publishing works (important)

Admin edits are written to **the browser's `localStorage`**. That's what lets this site run with
zero hosting cost and zero setup — but it has consequences you need to know:

- Your edits live in *your* browser, on *that* machine. They are not automatically visible to
  visitors, and they don't sync between your laptop and your phone.
- Clearing site data or "clear browsing history" wipes them. **Export a backup before you do.**
- Storage caps at roughly 5 MB, so keep uploaded images under ~400 KB each.

**To publish your content to the world:**

1. Admin → **Tools & Backup** → **Export as `data-seed.js`**
2. Open the downloaded file, copy everything
3. Replace the `const TW_SEED = { … };` block in `assets/js/data.js` with it
4. Commit and push — GitHub Pages redeploys in under a minute

```bash
cd ~/Downloads/toolwerk-website
git add assets/js/data.js
git commit -m "Update product catalogue"
git push
```

That's the whole publish loop. Enquiries submitted on the live site are stored in the visitor's
browser, so **for real lead delivery you'll want the forms wired to email or a CRM** — see
[section 14](#14-known-limitations--upgrade-path).

---

## 8. Design system

**Colour** — near-black `#0B0F14`, safety amber `#FFB000`, white, steel grey `#5A6B7C`. Every
text/background pair on the site clears WCAG AA (4.5:1); black-on-amber measures 10.4:1. All of it
is defined once in the `:root` block at the top of `assets/css/style.css` — change a token there
and the entire site follows, contrast intact.

**Typography** — Barlow Condensed for headlines (condensed industrial voice, uppercase, tight
leading), Inter for body text. Headline sizes use `clamp()` so they scale fluidly without
breakpoints.

**Motion** — parallax hero and CTA bands driven by `requestAnimationFrame`, scroll-triggered
reveals with staggered delays, count-up stat animations, auto-advancing hero slider (7s), and
horizontally scrollable snap rails for product carousels. All of it is disabled automatically
under `prefers-reduced-motion: reduce`.

**Layout** — 1240px max content width, CSS Grid throughout, three breakpoints (1080 / 900 / 620px).
Below 900px the desktop nav becomes a slide-in drawer and the sticky mobile action bar appears.

---

## 9. Running locally

Any static server works. With Python (already on macOS):

```bash
cd ~/Downloads/toolwerk-website
python3 -m http.server 8778
```

Then open http://localhost:8778.

You *can* just double-click `index.html`, but serving over HTTP matches production behaviour
exactly and avoids `file://` quirks.

---

## 10. Deployment

**GitHub Pages** (what this repo uses) — repo → **Settings → Pages → Source: Deploy from a branch
→ `main` / `(root)` → Save**. Live in about a minute; every `git push` redeploys automatically.

**Netlify / Vercel** — drag the folder onto the dashboard, or connect this repo. No build command,
no output directory.

**Traditional hosting (cPanel / Hostinger)** — upload the folder's *contents* into `public_html`.
No PHP, no MySQL, nothing to configure.

**Custom domain** — add a `CNAME` file containing your domain at the repo root, and point the
domain's DNS at your host.

---

## 11. Customisation recipes

**Change the entire colour scheme** — edit the `:root` tokens in `assets/css/style.css`. Keep a
dark `--ink` and a bright `--amber` and the contrast ratios hold.

**Change the business name, phone and address** — Admin → Site Settings. Never edit HTML for this.

**Add a new category with products** — Admin → Categories → add it → Products → Add New → pick it.
The menu and filters update themselves.

**Replace placeholder images with real photos** — Admin → Products → edit → Images → upload. For
category and hero images, use Categories and Homepage & Content respectively.

**Change the admin login** — Admin → Site Settings → Admin Access.

**Edit the SEO title/description of a page** — the `<title>` and `<meta name="description">` tags
at the top of each `.html` file.

---

## 12. Security notes

The admin login is a **front-end gate, not authentication**. The credentials are checked in
JavaScript in the browser, which means anyone who reads the page source can bypass it. It exists
to keep the panel out of casual sight, not to protect anything.

Because the site has no backend, there is nothing behind that gate to steal — an attacker can only
edit *their own* browser's copy of the content. Your published content is whatever is committed in
`data.js`. But before putting this in front of the public, you should still:

- Change the default `admin` / `admin` credentials (Site Settings → Admin Access)
- Put HTTP Basic Auth in front of `/admin.html` if your host supports it
- Move to a real server login if you ever add genuine multi-user editing

All user input rendered back into the page is escaped through an `esc()` helper to prevent XSS.

---

## 13. Browser support & accessibility

Chrome, Edge, Safari and Firefox — current and previous major versions. iOS Safari 14+ and Chrome
for Android. No polyfills, no transpilation.

Accessibility: semantic landmarks, `aria-label` on icon-only controls, keyboard-operable modal
with Escape-to-close, visible focus rings via the browser default, `alt` text on every image,
and full `prefers-reduced-motion` support.

---

## 14. Known limitations & upgrade path

| Limitation | Upgrade |
|---|---|
| Content saves per-browser, not globally | Point the same admin screens at a small API (Node + SQLite, or a headless CMS). The `TW` object in `data.js` is the only thing that changes |
| Enquiries stay in the visitor's browser on the live site | Post the form to Formspree / Web3Forms / EmailJS for instant email delivery — a ~10-line change in `site.js`. Or a real backend endpoint |
| Admin login is client-side only | Server-side session auth, or HTTP Basic Auth on the admin path |
| Images stored as base64 in browser storage | Upload to the repo's `assets/img/` folder or a CDN and reference by URL |
| No sitemap or structured data yet | Add `sitemap.xml` and JSON-LD `Product` schema for richer Google results |

None of these block launch — they're the natural next steps as the site earns traffic.

---

## 15. File map

```
toolwerk-website/
├── index.html          Homepage
├── products.html       Catalogue with filters and search
├── product.html        Product detail (?id=…)
├── featured.html       Featured / special range
├── services.html       Services + service request form
├── about.html          About, stats, industries, FAQs
├── contact.html        Contact details, map, enquiry form
├── admin.html          Admin panel shell + login
├── assets/
│   ├── css/
│   │   ├── style.css   Design tokens + all public site styles
│   │   └── admin.css   Admin panel styles
│   └── js/
│       ├── data.js     Seed content + TW storage layer
│       ├── site.js     Header, footer, nav, modal, catalog, product page
│       └── admin.js    Admin panel (routing + all editors)
└── README.md
```

