# ContractFlow — Tender Writer Workbench v0.3

Internal, review-only prototype. Evidence-led drafting assistant; NOT an LLM tender writer yet; no client, buyer or public release is authorised.

## What works
- Responsive WA mining tender intake with source, legal entity, procurement type, closing time and addenda checkbox.
- Paste or import plain-text TXT/MD only (maximum 2 MB); no upload or external request.
- Deterministic extraction of candidate requirements, original source line numbers and provisional categories.
- Manually add missed clauses, record status, evidence ID and action owner.
- Evidence register with a named reviewer required for status Verified.
- Requirements marked Satisfied must reference an ID present in the Verified evidence register.
- Clause-by-clause editable working response fields, and a local heuristic quality review for gaps, placeholders and claims requiring proof.
- Review summary with outstanding approval and evidence gaps. A clause marked Satisfied must also have a substantive response.
- Export clause matrix (including working responses) and evidence CSV (formula-injection mitigation); export Markdown outline marked DRAFT ONLY, plus rule-based review report.
- Safe synthetic example for demonstration; no claimed live work.
- Zero persistence. Data disappears after closing or clearing the tab; download needed work first.

## What it does NOT do
- No LLM or AI API calls or independently generated technical methodology. Local composition quotes verified, disclosure-cleared evidence; a competent human must write and approve the complete clause response.
- No PDF/DOCX parsing, visual form completion, addenda diff, page citations or cross-file traceability.
- No identity authentication, tenant separation or encrypted document storage.
- No automatic buyer/supplier portal interactions, quote pricing, emails or tender submission.
- No guarantee every mandatory criterion is found; manual source-by-source verification required. QA reviews only known clauses, not omissions or the actual truth of supplied answers.
- Checkboxes are work tracking only, NOT proof of legally valid client authorisation or reviewer approval.

## Run and verify
Files live in the existing VBS repository under contractflow/tender-writer/ on the feature branch; this is a static site.

Run all engine and DOM event tests with Node 22 or newer (verified on Node 24.19.0):

    node --test contractflow/tender-writer/*.test.mjs

For a local-only demonstration, run from the repository root:

    python3 -m http.server 8765 --bind 127.0.0.1

Browse to http://127.0.0.1:8765/contractflow/tender-writer/ . Do not publicly deploy or share any browser with live confidential tender data.

## Pages and buttons
1. Left sidebar: jump to sections, load a wholly fictional sample, clear all tab contents.
2. Quick-start guide: expandable usage instructions and confidentiality warning.
3. Opportunity intake: buyer, legal client, package metadata, original source, closing time zone, addenda, TXT/MD text, candidate extraction.
4. Compliance matrix: buyer wording and source line, manually added clauses, status, evidence ID, action owner and editable answer.
5. Evidence register: evidence IDs, descriptions, document sources, status and named verifier.
6. Approval gates: mandate, technical, HSE, commercial and final signatory checklist — NOT proof of valid legal authority.
7. Draft quality review: local heuristics flag gaps, short answers, unresolved placeholders, strong performance claims and missing evidence. Run review and export Markdown findings.
8. Draft builder: assembles working answers into a source-linked but unapproved Markdown response outline. Commercial rates and signatures remain explicit holds.

## New in v0.3
- **Compose blank responses from evidence** quotes only explicitly linked evidence with an excerpt, page/section locator, named verifier and recorded draft-disclosure permission. Comma-separated evidence IDs are supported. Existing answers remain unchanged; composed answers remain In review.
- **Build EOI / tender response** creates the relevant document structure, clause responses, evidence index and commercial/authority holds. The original outline remains available.
- Source changes invalidate coverage, addenda confirmation, approvals and cached output. Composition is blocked until re-extraction. Package/client/buyer changes revoke existing evidence clearance to reduce accidental reuse.
- Evidence verification can be revoked. Linked responses then require review and are withheld from response-package exports. Internal CSV exports still contain work-in-progress material: keep them confidential.
- Readiness now includes QA blockers and review flags, manual full-package coverage and the unchanged source snapshot. Checkboxes remain operator assertions, not authenticated signoff.
- No silent 1,300-character clause truncation or 200-clause partial extraction; oversized extraction stops with a clear message. Raw leading blank source lines are retained.
- A restrictive meta CSP denies network connections and form submission; source content uses text nodes and escaped Markdown. This is defence in depth, not authentication or tenant isolation.
- Six reproducible synthetic outputs are under `examples/`; regenerate with `node contractflow/tender-writer/examples/generate.mjs`.
- See `verification/node-tests.txt` and `docs/CONTRACTFLOW_WRITER_V03_REVIEW.md` for evidence and specialist handoffs. DOM event tests are not browser/device/layout tests.

The demo source/date are fictional and deliberately cannot pass readiness. The compliance matrix scrolls horizontally on mobile. No data is saved between sessions. Do not paste private customer content into externally shared previews.

## REA research boundary
Reverse Engineer Anything (https://github.com/morluto/rea) is optional software-design research, not a writing model. No REA install, analysis run or external app cloning occurred in this task. Use it only where inspection is authorised. Never bypass procurement portals or copy proprietary tender responses. REA is not a production dependency.

## Proposed secure AI phase (not built)
1. Client consent and engagement scope, tenant-safe identity, encrypted source storage and versioned audit.
2. Protected PDF/DOCX ingestion with page/section references, OCR only if necessary, and addenda awareness.
3. Source-backed, reviewable requirements table with coverage checklist and manual overrides.
4. Approved contractor evidence vault: validated capabilities, licences, insurance, HSE, projects, scope and disclosure permission.
5. Server-side grounded model drafts, requirement citations, prompt-injection controls and evaluator challenge; secrets server side only.
6. Named human technical/HSE/commercial reviewers, signed client authority and version freeze.
7. Editable DOCX/PDF export and buyer portal submission handled only with separate explicit authority.
8. Benchmark against experienced WA mining bid writer on permissioned tenders: coverage, errors, evidence quality, clarity and rework.
9. Formal 03 compliance, 08 security and Manager HQ release gates.

## Operational handoffs
- 09 My Tender Writer: Writer, evidence gates and client-specific package composition.
- 03 Tender Writing & Compliance: CF-005 standards, clause review and methodology.
- 04 Website & Product Development: Integrate after security and product review.
- 07 Data & Automation: Secure ingestion, credentials, logs and controls.
- 08 QA, Security & Launch: Security, mobile, accessibility, privacy and release tests.
- 01 Manager HQ: Commercial, budget, domain and deployment decisions.

No new repo, hosting account, domain, subscription, buyer contact, public release or bid submission is included in this work.
