# ContractFlow — Tender Writer Workbench v0.1

Internal, review-only prototype. NOT an AI tender writer yet; no client, buyer or public release is authorised.

## What works
- Responsive WA mining tender intake with source, legal entity, procurement type, closing time and addenda checkbox.
- Paste or import plain-text TXT/MD only (maximum 2 MB); no upload or external request.
- Deterministic extraction of candidate requirements, original source line numbers and provisional categories.
- Manually add missed clauses, record status, evidence ID and action owner.
- Evidence register with a named reviewer required for status Verified.
- Requirements marked Satisfied must reference an ID present in the Verified evidence register.
- Review summary with outstanding approval and evidence gaps.
- Export clause matrix and evidence CSV (formula-injection mitigation); export Markdown outline marked DRAFT ONLY.
- Safe synthetic example for demonstration; no claimed live work.
- Zero persistence. Data disappears after closing or clearing the tab; download needed work first.

## What it does NOT do
- No LLM or AI API calls and no professional technical response generation.
- No PDF/DOCX parsing, visual form completion, addenda diff, page citations or cross-file traceability.
- No identity authentication, tenant separation or encrypted document storage.
- No automatic buyer/supplier portal interactions, quote pricing, emails or tender submission.
- No guarantee every mandatory criterion is found; manual source-by-source verification required.
- Checkboxes are work tracking only, NOT proof of legally valid client authorisation or reviewer approval.

## Run and verify
Files live in the existing VBS repository under contractflow/tender-writer/ on the feature branch; this is a static site.

Run unit tests with Node 18 or newer:

    node --test contractflow/tender-writer/engine.test.mjs

For a local-only demonstration, run from the repository root:

    python3 -m http.server 8765 --bind 127.0.0.1

Browse to http://127.0.0.1:8765/contractflow/tender-writer/ . Do not publicly deploy or share any browser with live confidential tender data.

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
