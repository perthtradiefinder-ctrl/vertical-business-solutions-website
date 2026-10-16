# ContractFlow My Tender Writer — v0.3 review checkpoint

17 October 2026 AWST. Workstream 09. Internal engineering review only.

Repository: perthtradiefinder-ctrl/vertical-business-solutions-website
Branch: feature/contractflow-tender-writer-mvp
Draft PR: https://github.com/perthtradiefinder-ctrl/vertical-business-solutions-website/pull/3
Starting checkpoint: bf640e441f20fb8f4a53c47aea8a299a0d81401d (v0.2).

## Outcome

Continued the existing six-step local workbench without adding infrastructure or production routes. The new workflow composes review-ready clause material from explicitly linked, verified, disclosure-cleared excerpts. It produces separate EOI and tender response structures and a source-linked evidence index. It does not run an AI model, assess technical suitability independently, or produce an approved bid.

Evidence must have a unique ID, source/version reference, page/section locator, exact excerpt, named verifier and recorded permission for draft use. Missing evidence becomes a gap, never an invented qualification. Existing responses are preserved. Generated material retains review markers and cannot automatically satisfy a clause.

## Defects corrected

- Source amendment/file import no longer leaves prior approvals or generated output current.
- Buyer, client or package-reference changes revoke old evidence clearance; source line numbering preserves leading blank lines.
- Manual full-package coverage is required. Extraction limits now reject partial matrices instead of silently truncating them.
- Readiness now honours QA blockers/review flags and expanded placeholders.
- Evidence revocation invalidates linked status and suppresses affected responses in response-package exports.
- User content is escaped in Markdown and rendered as text in the UI; CSP denies connections and form actions. CSV formula neutralisation retained.
- Dynamic row controls have accessible labels; destructive replacement still confirms; a tab-close warning reduces accidental loss where supported.

## Verified engineering evidence

Runtime: Node v24.19.0. No packages installed, no model requests, no live customer material.

Command: `node --test contractflow/tender-writer/*.test.mjs`
Result: 21 tests passed; 0 failed; 0 skipped. Raw output: `contractflow/tender-writer/verification/node-tests.txt`.

Coverage: baseline regressions; exact excerpt/locator inclusion; unverified, missing, duplicate and undisclosed evidence rejection; multiple evidence references; answer preservation; changed sources and coverage; placeholders and strong claims; evidence revocation; EOI/tender structure; inert Markdown; limits and full clause retention. The DOM test executes the actual UI module with a test DOM and exercises composition, edits, all four download flows and their Blob contents, review, approval invalidation, revocation, source amendments, file loading and clearing.

`node --check` passes for writer.js, engine.mjs and drafting.mjs. `git diff --check` passes.

Reproducible demonstration: `node contractflow/tender-writer/examples/generate.mjs` creates source TXT, EOI Markdown, tender Markdown, QA Markdown, requirements CSV and evidence CSV. All content is explicitly fictional; missing insurance is deliberately left unresolved. These are test outputs, not benchmark bids.

## Not verified / limits

- Chromium, Firefox and WebKit executables are absent in this runtime. No real browser, screen reader, mobile layout, CSP enforcement, Safari download or iPhone test is claimed.
- No production/deploy-preview test of v0.3. PR title and commit use `[skip netlify]` to prevent publication. Existing v0.2 preview must not be represented as v0.3.
- No PDF/DOCX ingestion, OCR, authenticated tenancy, encrypted vault, retention service, signed approval, source-document truth verification, model calls or submission capability.
- Readiness is a local checklist. It cannot determine whether a pasted source is official, whether a deadline is current, whether facts satisfy a clause, or whether the operator is authorised. All require independent review.
- Candidate extraction is heuristic; it can miss multi-line clauses, tables, attachments or requirements without recognised wording. Manual coverage must be checked against the original package.
- No durable browser storage or restore. Export before closing. Internal CSV files may include revoked or unapproved working content and must remain confidential.
- A CSP meta tag is not access control, sandboxing of a compromised same-origin script, encryption or tenant separation. A publicly accessible preview is not a private client workspace.
- No professional parity, win-rate or guaranteed-award claim has been validated.

## Requested specialist handoffs (not approvals)

| Owner | Evidence to review | Requested decision / next action |
| --- | --- | --- |
| 01 Manager HQ | PR #3, this checkpoint, tests and synthetic outputs | Retain draft status; maintain separate gates for model/security work, professional pilot and publication. No budget or launch authority assumed. |
| 03 Tender Writing & Compliance / CF-005 | EOI vs tender templates, exact excerpt workflow, coverage checkbox, QA rules | Validate the proposed methodology and response completeness. Define approved clause rubric, N/A treatment, commercial departures and qualified technical/HSE review. A methodology draft is not legal advice or compliance signoff. |
| 08 QA, Security & Launch / CF-007 and CF-004 | CSP, text rendering, Markdown/CSV handling, source/approval invalidation, revocation, test logs | Independently test desktop/iPhone, keyboard/screen-reader flow, downloads, CSP and privacy. Approve or reject a future confidential-data design; no security signoff claimed here. |
| 07 Data, Integrations & Automation | README secure AI phase and existing VBS infrastructure | Propose authenticated tenant isolation, private evidence storage, retention/deletion, scoped server-side model access and immutable approval/version audit before real documents. Do not add accounts or enable paid calls. |
| 09 / CF-016 | Synthetic outputs only | Benchmark remains blocked pending permission-cleared historic bids, genuine professional comparators and competent independent reviewers. Do not mark benchmark passed based on synthetic tests. |

## Next construction gate

The implemented zero-cost scope is complete for review. Source-grounded model writing remains blocked by the existing Workstream 09 security/cost gate. Before enabling it, HQ and 07/08 must identify an approved existing provider configuration, authorise its cost ceiling and data handling, and demonstrate tenant/credential boundaries. 03 must approve the writing and evaluation method. Then implement schema-validated model responses with per-claim source references, refusal on unsupported claims, adversarial source testing and human review. No submission tool should be exposed to that drafting path.

Netlify skip behaviour reference: https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
