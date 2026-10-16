# CF-003 — Review-only Netlify preview deployment

Date: 17 October 2026 (AWST)
Owner: Website & Product Development (04)
Status: Owner authorised a deploy. This specific release is a **non-production preview only** because documented source/compliance, buyer-data reproduction, brand, form delivery and real-device QA gates remain open.

## Scope and safety

- Reuse existing Netlify project **vertical-business-solutions** and existing GitHub repository; do not create new accounts, sites, domains or subscriptions.
- Publish *only* Netlify's pull-request Deploy Preview of this DRAFT PR. Do not merge this PR into `main`, trigger a production deploy or promote its preview.
- Keep Finder `noindex,nofollow`, conspicuous QA review disclaimer, project-source links, conservative AWST expiry/quarantine and no confidential contractor data.
- Existing `/contractflow/` path is an internal development route and **ContractFlow is not an approved final public brand**. No marketing promotion or claim of a public release.
- No tender submission, buyer contact, new registration, external file upload or payment processing.
- Previews are usually publicly accessible to anyone with the preview link. Share only with authorized internal testers and ensure public noindex.

## What is verified

- Prior QA report: `docs/CF003_FINDER_EXECUTED_QA_2026-10-17.md`
- Exact-source Node v22 test suite: 7/7 passed.
- Chromium local-data test suite: 28/28 passed at phone and desktop widths. Not actual iPhone Safari or a hosted-network test.
- Draft PR remains open, unmerged and a review artifact.

## Required QA before any future production release

1. QA 08: live Deploy Preview smoke test on actual desktop and iPhone Safari, accessibility and response/header/privacy check.
2. Research 02: package-level evidence for each open ICN EOI; source license/attribution and exact closing hour if published.
3. Data 07: approved verification cadence and public export/review model.
4. QA 08: controlled enquiry test proving both Netlify capture and designated VBS mailbox delivery.
5. Manager HQ: final product scope/brand for **WA mining and Perth tradie tenders**; owner's explicit production-release authorization.

Production status remains **HOLD**. If Netlify preview is not created automatically, log as blocked rather than merging to main.
