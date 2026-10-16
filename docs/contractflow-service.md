# VBS ContractFlow — mining contracts & tender coordination

Status: Public-facing service page (initial release).
Public URL: https://verticalbusinesssolutions.com.au/contractflow/
Owner: Vertical Business Solutions.
Primary market: Western Australian mining maintenance, shutdown, civil and workforce contractors.

## Product boundary
ContractFlow is initially a *managed service*, not an automatic tender-bidding robot.
Public page includes service capabilities, illustrative pipeline (labelled as sample data), 14-day discovery offer and enquiry capture.
No claim of procurement access, contractual awards, current supplier approval, guaranteed leads or awarded work.
No client logos, names or commercial details are published without their express permission.

## Pilot workflow
1. Obtain the contractor's written service brief and authorised contacts.
2. Verify service capability by scope, geographic coverage, workforce availability, safety and insurance documentation.
3. Build target buyer register: mine owner / maintenance operator / tier-one subcontractor, procurement route, public source and verification date.
4. Source work via official procurement portals, ICN Gateway, Tenders WA, buyer supplier websites and directly approved outreach.
5. Classify every lead: open tender, EOI, supplier registration, forthcoming project, private buyer lead, subcontracting prospect.
6. Assess commercial fit, closing time, eligibility, evidence confidence and estimated pursuit effort. Values may only be shown when publicly disclosed or client supplied.
7. Present ranked opportunities and decision requests to the client.
8. Prepare EOI/tender drafts from client-verified credentials, evidence and approved company material.
9. Require explicit client approval before external contact, portal registration, bid submission, price representation or contractual commitments.
10. Record submissions, receipts, clarifications, follow-ups, wins/losses and reasons in the client's private pipeline.

## Basic opportunity data model
- Opportunity ID, title, buyer, project/site, state/region.
- Work category, source URL, source type, verification date, buyer reference.
- Stage, opportunity availability (confirmed open vs pipeline intelligence), close date/time and source timezone.
- Registration route, prequalification prerequisites, document checklist, contact channel.
- Fit criteria (capability, location, availability, contract terms, buyer access), owner action and next review date.
- Bid/no-bid approval, technical approver, commercial approver, submission evidence and outcome.

## Guardrails
- Keep client pipelines, pricing, supplier passwords and documents isolated from other customers.
- Never fabricate company case studies, credentials, safety performance, financial details or tender references.
- Never disclose individual employee details without appropriate authority.
- No purchaser communications or submissions without approved scope, authority and review.
- Do not automate CAPTCHA-protected or prohibited procurement portals.
- Do not treat unknown buyer invitations as active, available awards.
- Do not store secrets in source control, Airtable or the public HTML.

## Technical implementation
- Existing static website repository and Netlify project; no new hosting project or DNS change.
- `contractflow/index.html` + scoped `contractflow/contractflow.css` for mobile-responsive public page.
- Existing `script.js` controls navigation, footer year and `?submitted=true` confirmation.
- Netlify Forms uses unique `contractflow-enquiry` form name, server-parsed static HTML and honeypot.
- Form submissions must be validated in Netlify dashboard before promising active lead notifications.
- Submission notifications/email forwarding should be enabled by an authorised site owner and verified end to end.
- Test at 360px, 390px, 768px and desktop sizes; recheck accessiblity contrast, keyboard access, form errors, success path and links.

## Next build phases
- Phase 2: private Airtable opportunity/buyer/client schema with activity audit and source snapshots.
- Phase 3: scheduled monitoring and source deduplication with human validation; exclude unsupported portals.
- Phase 4: human-approved outreach, EOI and tender response workspace with role-based access.
- Phase 5: commercial KPI dashboard and client reporting. No automated bid submission without explicit authority.

## Acceptance checklist
- [ ] Merge reviewed site files to default branch and confirm Netlify production deploy is ready.
- [ ] Confirm both homepage entry points navigate to live `/contractflow/`.
- [ ] Confirm Form detection appears as `contractflow-enquiry` in Netlify.
- [ ] Test real submission and notification flow with owner-authorised details.
- [ ] Complete physical iPhone Safari / Android Chrome layout and keyboard review.
- [ ] Record verified deployment SHA and separate unverified testing.
