# WAG Corporate Website — Architecture & Reference Guide

> **Last updated:** 2026-03-13
> **Domain:** worldauto.group
> **Repo:** rayzhux/wag-me.com
> **Deploy:** Vercel (auto-deploy on push to `main`)
> **Dev server:** `npx serve -l 3456 .` (configured in `.claude/launch.json`)

---

## 1. Project Structure

```
cc-wag-me.com/
├── index.html                 # Homepage (hero, stats, verticals, flywheel)
├── about.html                 # Company story & timeline
├── aftermarket.html           # Vertical: quick service operations (ExpressFit)
├── data-software.html         # Vertical: AutoData, Vicimus, Axxion
├── fintech.html               # Vertical: F&I marketplace (venture stage)
├── consulting.html            # Vertical: knowledge systems & advisory
├── presence.html              # Global presence (9 countries, 32+ locations)
├── leadership.html            # Executive team profiles
├── venture-studio.html        # Venture studio program
├── contact.html               # Contact form (→ Slack via serverless function)
├── privacy.html               # Privacy policy
├── terms.html                 # Terms & conditions
│
├── styles.css                 # Shared design system (905 lines)
├── script.js                  # Shared interactions (149 lines)
│
├── api/
│   └── contact.js             # Vercel serverless: form → Slack webhook
│
├── logos/
│   ├── autodata-logo.png      # AutoData color logo
│   ├── autodata-logo-white.png# AutoData white variant
│   ├── axxion-logo.png        # Axxion blue logo (needs white bg on dark)
│   ├── vicimus-logo-dark.svg  # Vicimus dark logo
│   ├── vicimus-logo-full.svg  # Vicimus full logo
│   ├── expressfit-logo.png    # ExpressFit brand
│   └── fasttrack.png          # FastTrack brand
│
├── profile photos/
│   ├── Amin.jpg               # Chairman
│   ├── Terence.jpeg           # CSO
│   ├── Thomas.jpeg            # Aftermarket CEO
│   ├── Khalid.jpg             # President PAG Direct
│   ├── Raymond.jpeg           # CTO
│   └── Alexander.jpeg         # COO
│
├── wag-logo.svg               # Primary WAG logo (stroke: #a2aab5)
├── favicon.svg                # Browser favicon
├── og-image.png               # Social sharing image (1200×630)
├── world-map.svg              # Map graphic for presence page
│
├── robots.txt                 # Crawl directives (all bots allowed)
├── sitemap.xml                # 12 pages with priorities
├── llms.txt                   # AI/LLM discovery file
│
├── .claude/launch.json        # Dev server config (port 3456)
└── .vercel/project.json       # Vercel project/org IDs
```

---

## 2. Design System

### 2.1 Color Palette (CSS Variables in `styles.css`)

| Variable        | Hex       | Usage                                |
|-----------------|-----------|--------------------------------------|
| `--coal`        | `#0B1215` | Primary dark background, nav, footer |
| `--coal-90`     | `#141D22` | Lighter dark variant                 |
| `--coal-80`     | `#1C2830` | Card backgrounds on dark sections    |
| `--slate`       | `#2A3640` | Body text on light backgrounds       |
| `--mist`        | `#8B9DAF` | Secondary/muted text                 |
| `--silver`      | `#C4CDD6` | Body text on dark backgrounds        |
| `--pearl`       | `#E8ECF0` | Card borders, light backgrounds      |
| `--white`       | `#F7F8FA` | Page background (off-white)          |
| `--gold`        | `#C09A53` | Primary accent (buttons, links, labels) |
| `--gold-light`  | `#D4B577` | Hover state                          |
| `--gold-dark`   | `#A07D3A` | Disabled/subtle accent               |
| `--accent`      | `#3A7CA5` | Blue secondary accent                |

### 2.2 Typography

| Role    | Font     | Type  | Weights Used       |
|---------|----------|-------|--------------------|
| Display | Fraunces | Serif | 300, 400, 500, 600, 700 |
| Body    | DM Sans  | Sans  | 300, 400, 500, 600 |

- Loaded via Google Fonts with `display=swap`
- `<link rel="preconnect">` to fonts.googleapis.com and fonts.gstatic.com

### 2.3 Spacing & Layout

- **Container max-width:** 1280px (`--container-narrow`: 900px)
- **Section padding:** `clamp(80px, 12vh, 160px) 0`
- **Card border-radius:** 8px (cards), 4px (buttons), 12-16px (large containers)
- **Easing:** `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`

### 2.4 Breakpoints

| Width       | Behavior                                              |
|-------------|-------------------------------------------------------|
| ≤ 1100px    | Mobile nav (hamburger menu, side drawer)               |
| ≤ 900px     | Contact form single column                            |
| ≤ 768px     | Grid layouts collapse, footer single column           |
| ≤ 700px     | Pathway cards 3-column                                |
| ≤ 480px     | Single column everything, full-width stats            |

---

## 3. Navigation

### 3.1 Structure

```
Home → index.html
Story → about.html
Aftermarket → aftermarket.html
Data & Software → data-software.html
Verticals (dropdown) →
  ├── Aftermarket → aftermarket.html
  ├── Data & Software → data-software.html
  ├── Automotive FinTech → fintech.html
  └── Consulting → consulting.html
Global Presence → presence.html
Leadership → leadership.html
Venture Studio → venture-studio.html
[Partner With Us] → contact.html (CTA button)
```

### 3.2 Nav Behavior

- **Default:** transparent background, 72px height
- **Scrolled (>60px):** coal bg with 0.97 opacity, 60px height, backdrop blur, 1px gold border-bottom
- **Mobile (<1100px):** hamburger toggle, side drawer from right (min 360px, max 85vw)
- **Dropdown:** click-to-toggle (not hover), click-outside-to-close
- **Active page:** nav link gets white color; if page is a vertical, "Verticals" toggle gets white color

### 3.3 Footer Columns

1. **Brand:** WAG logo, company name, tagline, address, Google Maps link
2. **Company:** Our Story, Leadership, Global Presence, Venture Studio, Contact
3. **Verticals:** Aftermarket, Data & Software, Automotive FinTech, Consulting
4. **Bottom bar:** Copyright (ADGM No. 31285), Terms, Privacy

---

## 4. JavaScript Features (`script.js`)

| Feature                | Trigger / Mechanism                        |
|------------------------|--------------------------------------------|
| Nav scroll state       | `scroll` event, toggles `.scrolled` at 60px |
| Scroll progress bar    | `scroll` event, scales `#scrollProgress`    |
| Active section tracking| `scroll` event, highlights nav links by section ID |
| Mobile nav toggle      | Click on `#navToggle`, shows `#navLinks` + `#navOverlay` |
| Current page highlight | Compares `location.pathname` to nav link hrefs |
| Dropdown menu          | Click `.nav-dropdown-toggle`, toggles `.open` class |
| Reveal on scroll       | `IntersectionObserver` (8% threshold), adds `.visible` |
| Smooth scroll          | `click` on `a[href^="#"]`, 80px offset for nav |
| Animated counters      | `IntersectionObserver` (50%), 1500ms ease-out, `data-count` attribute |

### Counter Data Attributes

```html
<span class="counter" data-count="330000" data-suffix="+">0</span>
<!-- Supports: data-count, data-suffix, data-prefix, data-decimals -->
```

---

## 5. Page Architecture Pattern

Every page follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta: charset, viewport, theme-color (#0B1215) -->
  <!-- Title + description -->
  <!-- Canonical URL: https://worldauto.group/[page].html -->
  <!-- Google Fonts preconnect + stylesheet -->
  <!-- styles.css -->
  <style>/* Page-specific CSS */</style>
  <!-- Open Graph + Twitter Card meta tags -->
  <!-- JSON-LD structured data -->
</head>
<body>
  <!-- Scroll progress bar -->
  <!-- Navigation (identical across all pages) -->
  <!-- Nav overlay -->
  <!-- Page hero section -->
  <!-- Content sections (page-specific) -->
  <!-- FAQ section (vertical pages only) -->
  <!-- Footer (identical across all pages) -->
  <script defer src="script.js"></script>
  <!-- Page-specific inline scripts (e.g., contact form handler) -->
  <!-- Vercel Analytics -->
  <!-- Vercel Speed Insights -->
</body>
</html>
```

### Page-Specific Styles

Each page has its own `<style>` block in the `<head>`. These are NOT in `styles.css`. Examples:

- **index.html:** `.hero`, `.flywheel-*`, `.vertical-card-*`, `.proof-strip`
- **aftermarket.html:** `.am-hero-*`, `.eco-*`, `.partner-*`
- **data-software.html:** `.ds-hero-*`, `.product-card-dark`, `.product-list-item`
- **fintech.html:** `.venture-badge`, `.pain-*`, `.evolution-step`, `.status-banner`
- **contact.html:** `.contact-form`, `.contact-info-card`, `.pathway-card`
- **leadership.html:** `.leader-*` (profile cards, photos)

---

## 6. Integrations

### 6.1 Contact Form → Slack (`api/contact.js`)

**Endpoint:** `POST /api/contact`

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, validated)",
  "company": "string (optional)",
  "interest": "aftermarket | data-software | insurance | fintech | venture-studio | general",
  "message": "string (required)"
}
```

**Slack Message:** Block Kit format with header, 2×2 fields, blockquoted message, timestamp

**Environment Variable:** `SLACK_WEBHOOK_URL` (set in Vercel dashboard)

**Interest Label Mapping:**
| Value           | Display Label               |
|-----------------|-----------------------------|
| aftermarket     | Aftermarket Partnership     |
| data-software   | Data & Software Solutions   |
| insurance       | Insurance & Claims          |
| fintech         | Fintech & F&I               |
| venture-studio  | Venture Studio              |
| general         | General Inquiry             |

### 6.2 Vercel Analytics & Speed Insights

Both added to all 12 pages before `</body>`:
```html
<script>window.va = window.va || function(){(window.vaq=window.vaq||[]).push(arguments)};</script>
<script defer src="/_vercel/insights/script.js"></script>
<script>window.si = window.si || function(){(window.siq=window.siq||[]).push(arguments)};</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

Must be enabled in Vercel dashboard under project Settings.

### 6.3 Deployment Pipeline

```
git push origin main → GitHub → Vercel auto-deploy → worldauto.group
```

**Vercel Project ID:** `prj_coU7k0JFjNoZ8VUnV7UuG8hNM0pd`
**Vercel Org ID:** `team_lPB1AfjhewDHMjoAGhjvKg9L`

---

## 7. SEO Configuration

### 7.1 Traditional SEO

| Asset          | Purpose                                      |
|----------------|----------------------------------------------|
| `robots.txt`   | Allow all crawlers, point to sitemap         |
| `sitemap.xml`  | 12 pages with priority weights (0.3–1.0)     |
| Canonical tags | On every page → `https://worldauto.group/`   |
| OG + Twitter   | Social sharing meta on every page            |
| `og-image.png` | 1200×630 branded preview image               |
| JSON-LD        | Organization, WebSite, LocalBusiness, BreadcrumbList, FAQPage |

### 7.2 AI/LLM SEO

| Asset       | Purpose                                        |
|-------------|------------------------------------------------|
| `llms.txt`  | Company summary, page index, entities for LLMs |
| FAQ sections| Q&A format on 4 vertical pages (2x citation boost) |
| FAQ schema  | FAQPage JSON-LD for rich results               |

### 7.3 JSON-LD Schema Locations

| Page              | Schema Types                       |
|-------------------|------------------------------------|
| index.html        | Organization, WebSite              |
| contact.html      | LocalBusiness                      |
| aftermarket.html  | BreadcrumbList, FAQPage            |
| data-software.html| BreadcrumbList, FAQPage            |
| fintech.html      | BreadcrumbList, FAQPage            |
| consulting.html   | BreadcrumbList, FAQPage            |
| about.html        | BreadcrumbList                     |
| presence.html     | BreadcrumbList                     |
| leadership.html   | BreadcrumbList                     |
| venture-studio.html| BreadcrumbList                    |

---

## 8. Company Information (Static Content)

### 8.1 Legal Entity

- **Full name:** World Automotive Group International Holdings Ltd.
- **ADGM No.:** 31285
- **HQ:** Suite 203, Floor 11, Al Sarab Tower, ADGM Square, Abu Dhabi, UAE
- **Phone:** +971 04 339 5922
- **Email:** info@wag-me.com / ventures@wag-me.com

### 8.2 Leadership Team

| Name              | Title                    | Photo File       |
|-------------------|--------------------------|------------------|
| Amin Kadrie       | Co-Founder & CEO         | Amin.jpg         |
| Alex Kadrie       | Co-Founder & COO         | Alexander.jpeg   |
| Terence Johnsson  | Chief Strategy Officer   | Terence.jpeg     |
| Thomas Rebeyrol   | CEO, Aftermarket         | Thomas.jpeg      |
| Khalid Kadrie     | President, PAG Direct    | Khalid.jpg       |
| Raymond Zhu       | Chief Technology Officer | Raymond.jpeg     |

### 8.3 Operating Companies

| Company    | Domain          | Focus                       | Logo File                  |
|------------|-----------------|-----------------------------|-----------------------------|
| AutoData   | autodatame.com  | Data & analytics APIs       | autodata-logo-white.png     |
| Vicimus    | vicimus.com     | Dealer software             | vicimus-logo-dark.svg       |
| Axxion     | axxion.co       | Insurance claims mgmt       | axxion-logo.png (needs white bg on dark) |
| ExpressFit | —               | Quick service aftermarket   | expressfit-logo.png         |
| FastTrack  | fasttrackemarat.com | Legacy quick service     | fasttrack.png               |

### 8.4 Homepage Stats (Animated Counters)

| Stat    | Value   | Suffix | Label                      |
|---------|---------|--------|----------------------------|
| Years   | 40      | +      | Years of Automotive Leadership |
| Customers| 330000 | +      | Active Customers            |
| Companies| 6      | +      | Operating Companies         |
| Locations| 32     | +      | Service Locations           |
| Verticals| 4     |        | Integrated Verticals        |

---

## 9. Key Design Decisions & History

### Design Philosophy
- **Refined luxury meets institutional authority** — Abu Dhabi aesthetic
- Not generic startup energy, but measured confidence of a proven operator
- Target audience: ADNOC, government entities, OEMs, insurers, banks

### Navigation Evolution
1. Started with individual vertical links in main nav
2. Renamed "About" → "Story", added "Home" link
3. Shortened "Aftermarket Solutions" → "Aftermarket", "Data & Software Solutions" → "Data & Software"
4. Added "Verticals" dropdown containing all 4 verticals
5. Kept Aftermarket & Data & Software as standalone links alongside the dropdown
6. Footer "Solutions" → "Verticals"

### Logo Decisions
- WAG logo: SVG with subtle border frame (1px rgba white, 4px radius)
- Axxion logo on dark backgrounds: white background + border-radius (not CSS filter)
- AutoData: white variant (`autodata-logo-white.png`) for dark backgrounds
- Vicimus: dark SVG variant for dark backgrounds

### FinTech Page Fix
- Evolution steps (Phase 1/2/3) were invisible: white text on white background
- Fixed by changing to dark coal background with proper light text colors

### Venture Studio Visual Enhancement
- Added funnel diagram (Idea → Validate → Build → Standalone)
- Added process connector line between 4 steps with gold gradient

### Text Size Increases
- Labels: 11px → 12px
- Footer copy: 11px → 12px
- Card text: 13px → 14px

---

## 10. How to Make Common Updates

### Add a new page
1. Copy an existing page (e.g., `about.html`) as template
2. Update `<title>`, `<meta description>`, canonical URL, OG tags
3. Add page-specific `<style>` block
4. Add JSON-LD BreadcrumbList schema
5. Keep nav, footer, analytics scripts identical
6. Add to `sitemap.xml`
7. Add to `llms.txt` pages list
8. Update nav/footer across all 12 pages if adding to navigation

### Update navigation across all pages
- Nav HTML is duplicated in all 12 files (no templating)
- Use a script (Python with `glob.glob("*.html")`) to find-and-replace
- Same for footer changes

### Update the Google Map (contact.html)
- Map is an `<iframe>` embed from Google Maps
- Styled with: `filter: grayscale(1) contrast(1.1) brightness(0.7)`
- Gradient overlay: coal at top, transparent in middle, white at bottom
- Address pin overlay positioned at bottom center

### Add a new team member (leadership.html)
- Add photo to `profile photos/` directory
- Add `.leader-card` block following existing pattern
- Photos: `object-fit: cover; object-position: top;` with 100×100px circle
- Bio format: name (h3), title (gold-dark span), bio paragraph (slate text)

### Add a new company logo
- Place in `logos/` directory
- For dark backgrounds: provide white variant OR use `background: #fff; border-radius: 4px; padding: 2px 6px` on the `<img>`
- Reference in appropriate page's company section

### Modify contact form fields
1. Update HTML form in `contact.html`
2. Update `api/contact.js` — destructuring, validation, Slack payload
3. Update interest label mapping in the serverless function

### Run locally
```bash
npx serve -l 3456 .
# OR via Claude Code preview:
# .claude/launch.json → name: "wag-site"
```

### Deploy
```bash
git add [files]
git commit -m "Description"
git push origin main
# Auto-deploys to Vercel → worldauto.group
```
