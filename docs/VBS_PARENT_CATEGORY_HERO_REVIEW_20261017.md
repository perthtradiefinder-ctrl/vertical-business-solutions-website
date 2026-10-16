# Vertical Business Solutions — category-image homepage hero

**Owner design direction — 17 October 2026:** "Vertical Business Solutions will have category of products as the main hero images."

## Interpretation (for owner review)

- **Vertical Business Solutions stays the umbrella homepage brand.** The first screen is an image-led navigation gallery of product families rather than a single trade workflow.
- **Five initial clickable categories:** Contracts & Tender Services (WA mining **and** Perth construction/tradie work), Quoting & Visualisation, Training & Workforce, AI Inbox & Admin, and Business Operations.
- A large featured tender card plus four peer cards use original internal SVG illustrations / existing driveway hero artwork. Each entire tile is a semantic keyboard-focusable link, with heading, summary and destination. No fake testimonials, awards, bid results, product readiness or client details.
- Existing /contractflow/ path is retained internally until Manager HQ clears final tender-service naming. Other categories route to the *existing* #products and #platform sections; no broken speculative product pages.
- Existing cinematic "From enquiry to completed job" workflow remains intact **below** the category gallery and becomes an H2. Homepage maintains one H1.
- Responsive CSS has 980 px and 620 px layout breakpoints and reduced-motion settings. Gallery is static (no rotating carousel), keeping links accessible and content visible on phones.
- Product stage caveat remains visible: some categories include demos, early-access work or proposed services; no universal production-readiness claim.

## Source

Branch: `design/vbs-category-hero-20261017`, based on existing `main` of `perthtradiefinder-ctrl/vertical-business-solutions-website`.

Changed:
- `index.html` — category first-screen and nav, existing workflow retained.
- `assets/category-hero/categories.css` — responsive gallery CSS.
- `assets/category-hero/*.svg` — four original editable illustration files.
- `assets/hero/hero.css` — existing cinematic H1 selectors switched to existing title ID for H2 semantics.

## Basic code checks

- One H1; gallery appears before `#workflow`.
- All five card image paths are local, and original four SVG assets exist on branch; the QuickQuote/driveway card reuses the already-referenced existing `assets/hero/driveway.webp`.
- All card destinations point to currently known onsite sections or `/contractflow/`; no new external signup links, tokens, client data or forms.
- Separate category CSS loaded after existing styles; old cinematic title ID and workflow links retained.
- **Full mobile browser, screen reader and visual acceptance are pending.** Code-presence tests are not device tests.

## Release status / handoff

**This is an owner-review design branch only. No merge, no production publication and no Netlify Deploy Preview unless owner explicitly approves a preview.** All branch commits marked `[skip netlify]`/ `[skip ci]`; PR should remain draft with `[skip netlify]`.

Handoff:
- **01 Manager HQ:** incorporate VBS umbrella category-first owner design decision into product architecture, while keeping mining + Perth tradie tender service one of the product families.
- **05 Marketing:** agree category taxonomy/order, asset art direction and VBS homepage copy; final tender-service external brand remains unapproved.
- **04 Website:** conduct mobile/desktop screenshot checks, accessible link tests, asset validation and page visual QA before presenting final homepage release request.
- **08 QA/Security:** independent responsive/accessibility/performance tests and consent review for production release.

Do not acquire a domain or create another repository, hosting site or database.
