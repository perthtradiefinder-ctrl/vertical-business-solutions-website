# CF-003 Mining Contract Finder — executed QA checkpoint, 17 October 2026

**Owner-approved next-phase testing; not approval to publish or merge.** This checkpoint belongs to Website & Product Development (04) and is a handoff to QA/Security (08), Research (02), Integrations (07) and Manager HQ (01).

## Reproduction provenance

Retrieved exactly the three current public-source GitHub draft files from PR #2 on branch `work/contractflow-finder-20261017`; reconstructed local files and independently checked each using `git hash-object` against GitHub's original blob SHA.

| File | Matching Git blob SHA |
| --- | --- |
| `contractflow/finder/index.html` | `0ca1e4ed73e2a3230b7652f1057b767d587f6dcd` |
| `contractflow/finder/opportunities.json` | `dc8c0f9152b80eaea9ed5732b26bbda66a06d71a` |
| `contractflow/finder/finder.test.mjs` | `593930f7dc31c7e72075d6ed2b351915c475b9cb` |

No client-private data or credentials copied.

## Test execution results

**PASS: 7 / 7 Node tests, 0 failed.** Actual command run: `node --test contractflow/finder/finder.test.mjs` using Node v22.16.0 on the exact three source files. Covered (1) noindex/source-data separation; (2) status counters and package-level caveats; (3) search/all-records/reset; (4) 48-hour AWST expiry; (5) midnight on closing date with unknown hour; (6) invalid URL/date, duplicate ID and missing deadline quarantine; (7) fetch failure fail-closed.

**PASS: 28 / 28 Chromium checks, 0 failed.** Headless system Chromium rendered the *exact index.html source* and source data, with fetch replaced by a locally injected response to avoid external/localhost navigation. Tested 320, 375, 390, 768 and 1280 CSS-pixel widths. Checked nine default open source-listing rows, no horizontal overflow, no JavaScript exceptions, historical/closed/unverified filters, reset, keyword search and empty state, external `noopener noreferrer`, accessible searchbox/landmark names, `noindex`, qualification disclaimer, simulated source outage and injection-string rendering as text rather than HTML. The injected response retained the source fixture's exact data bytes; it was **not an HTTP network integration test**.

Two owner-facing screenshots were rendered from the exact page source at 390 px and 1280 px, and are supplied through the 04 chat artifact links rather than committed to GitHub.

**Limitations:** This is desktop Chromium with simulated phone-size viewports, **not** physical iPhone Safari, iOS VoiceOver, or a complete WCAG audit. Direct local URL navigation was blocked by the browser environment, so tests used `page.set_content` and fetch substitution. Source URL reachability, hosted-page HTTP headers/CSP, Netlify forms actual delivery and visitor privacy still need independent QA.

## Remaining blockers / release disposition

- [ ] 02: verify the nine EOI packages against current original ICN pages; record package-level scope/eligibility, distinct notice URL, timezone and any exact closing hour. Seven P2000 and two Havieron records were indexed as open 17 Oct with 23 Oct AWST closing date; this does **not** prove individual supplier eligibility or actual tender availability at the time of production release.
- [ ] 07: source re-verification cadence, public read-only curation pipeline, deduplication, attribution / use rights and handling of status changes; no authenticated scraping.
- [ ] 08: physical iPhone Safari, keyboard navigation, screen reader, real-hosted response/CSP and privacy checks. Complete controlled end-to-end `contractflow-enquiry` form submission with a *designated* VBS test identity and independently verify the configured VBS mailbox receives it. Netlify had two historical form submissions; a previous Gmail search did not verify email delivery.
- [ ] 01 Manager HQ and owner: sign off on evidence and give explicit separate release approval if/when all gates are cleared.

**Current decision:** PR #2 is kept draft, `[skip netlify]`, unmerged. Neither Finder nor Tender Writer is approved for publication or automated bid operations. Zero spending, buyer outreach, production deployment or tender submission.
