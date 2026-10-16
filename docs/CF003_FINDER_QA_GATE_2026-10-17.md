# CF-003 ContractFlow Finder — 17 October 2026 QA / release gate

**Owner approval interpretation:** On 17 October, owner said "Approve" in response to 04's recommendation to run independent QA 08 and 02 source re-verification before a separate production release request. Authorisation covers **those next-phase checks**. It is **not** a waiver of outstanding release checks, a go-live instruction, or permission to submit bids, register clients, contact buyers, buy services or merge to production.

**Current GitHub:** Draft [PR #2](https://github.com/perthtradiefinder-ctrl/vertical-business-solutions-website/pull/2) against `main`, marked `[skip netlify]` and **unmerged**. No new hosting or domain. The project uses existing Netlify site `vertical-business-solutions` and path `/contractflow/`.

## Files

- `contractflow/finder/index.html`: static responsive Finder (review-only; `noindex,nofollow`).
- `contractflow/finder/opportunities.json`: static public ICN listing subset, not a live feed; no Airtable credentials, no confidential contractor records.
- `contractflow/finder/finder.test.mjs`: seven versioned regression tests. Run from repository root:
  ```bash
  node --test contractflow/finder/finder.test.mjs
  ```

**Existing evidence:** 12 controlled DOM assertions passed and all seven versioned test scenarios passed through isolated JS execution with a VM shim. **Do not call this independent Node CI or full-browser QA.** Actual Node runner, Playwright/Chrome, iPhone Safari, keyboard/screen-reader and real mobile layout remain **PENDING**.

## Source snapshot (official indexed ICN 17 October 2026)

**P2000 Expansion Project** — Pilgangoora Operations Pty Ltd (PLS): seven packages currently presented as **Open**, full/partial EOI closes **23 October 2026 (AWST)**:
Control Systems Integrator; Generators; Miscellaneous Instruments; Remote IO Panels; Special Mechanical Items; Tailings Clarifier; Winches.

Official project source: https://gateway.prd.icn.org.au/project/18385/p2000-expansion-project

**Havieron Project** — Greatland Pty Ltd: two packages currently presented as **Open**, full/partial EOI closes **23 October 2026 (AWST)**:
AR040A 350 Person Permanent Village; ME073 Surface Portal Chiller Plant.

Official project source: https://gateway.prd.icn.org.au/project/20431/havieron-project-brownfields-gold-copper-development

**Limits:** Search-indexed official listing text shows dates/status but not the exact closing hour; direct official page retrieval can fail (502). Scope Docs / SOW contents, eligibility, supplier registration, work type versus staffing suitability and specific package URLs have **not** been fully verified. Neither listing is a contract award. Publication rights and approved attribution for source metadata are not cleared. Do not overwrite `checkedDate` merely because a search index was rechecked; 02 must record individual source checks.

## QA 08 acceptance checklist

- [ ] Execute the committed seven test cases in real Node and attach exit code/log.
- [ ] Open draft in a local or controlled, nonpublic preview in desktop Chromium and iPhone Safari; test widths 320/375/390/768/1280 px and no horizontal overflow.
- [ ] Keyboard Tab/Shift+Tab, visible focus, label-to-input, Enter activation, result announcements and screen-reader headings/status.
- [ ] Search by package and buyer, category, region and notice-type filters, all/closed/stale/unverified state, Clear filters, empty state, external source link, enquiry CTA.
- [ ] Simulate 48-hour AWST verification expiry and unknown closing-hour midnight AWST on 23 Oct; no stale/closed listing remains in default Open.
- [ ] Simulate failed/invalid/duplicate JSON and mixed malicious data; no unverified item is represented as available, no text interpreted as HTML.
- [ ] Confirm no private records, secrets, hidden credentials, customer docs or unauthorised claims in public files, and that review builds retain `noindex`.
- [ ] Verify every official source URL and published closing hour/eligibility with 02 evidence. Remove/quarantine unsupported leads.
- [ ] Confirm source metadata reuse and attribution terms and document approved public refresh process with 07.
- [ ] Confirm controlled Netlify form submission and designated VBS mailbox receipt; do not copy submitted PII into public files or test logs.
- [ ] HQ and owner give **separate written approval** for production merger/public release only after all checks pass.

## Netlify forms / email evidence

On 17 October 2026, existing Netlify site reports form `contractflow-enquiry`, honeypot enabled, 8 named fields and **2 historical submissions**; that only demonstrates form capture counts, not successful email notification.

The connected `norm@verticalbusinesssolutions.com.au` Gmail search for 16–18 October (`ContractFlow` / `Netlify` / `contractflow-enquiry` subjects and content terms) returned no matching message. **This is not proof of non-delivery**: verify recipient routing, notification configuration, spam/filters/alias and a privacy-safe controlled test receipt. No external form submission was performed in this review.

## Disposition and specialist handoffs

- **04 Website:** draft UI and regressions committed. No release.
- **02 Research / CF-002:** individually validate nine packages, SOW, eligibility, closing hour, per-package source and metadata usage rights. Return an explicit approve/quarantine disposition per listing.
- **07 Data / CF-014:** approve permitted 48-hour source cadence, human approval of status, deduplication and read-only public cache; no portal-login scraping.
- **08 QA / CF-004 and CF-007:** execute independent Node, real-browser/iPhone, accessibility, security and controlled VBS notification receipt tests.
- **01 Manager HQ:** consolidate objective gate evidence; arrange owner sign-off only when all required checks are cleared.

**Release state: HOLD.** Draft PR #2 stays open and unmerged. Tender Writer draft PR #3 remains separate.
