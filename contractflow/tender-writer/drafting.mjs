/* Local evidence-led drafting workflow. No model, tools, network or executable source content.
   Verification/disclosure flags are operator assertions, not authentication or legal consent. */
export const REVIEW_MARKER = "[REVIEW REQUIRED — confirm relevance, currency and full clause coverage]";
const text = value => String(value ?? "").trim();
export function safeMarkdown(value) {
  return text(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/([\\`*_{}\[\]()#!|])/g, "\\$1");
}
const guidance = {
  "Health, safety & environment": "Confirm site-specific controls, isolation interfaces, supervision, emergency arrangements and the competent HSE reviewer.",
  "Workforce & mobilisation": "Confirm available roles and numbers, competencies, roster, induction, mobilisation dates and fatigue controls. Do not infer availability from workforce size.",
  "Technical delivery": "Confirm work sequence, interfaces, equipment, inspection points, deliverables and technical approval against the buyer scope.",
  "Licences & insurance": "Confirm legal entity, policy/licence scope, expiry dates and buyer limits with the authorised reviewer.",
  "Commercial": "Obtain authorised rates, quantities, currency, GST treatment, exclusions and commercial review. Do not infer a price or accept contract terms.",
  "Corporate experience": "Confirm permission to disclose each reference, contractor role, dates, scope and substantiated results. Do not imply an award or client endorsement."
};
export function evidenceIds(value) {
  return [...new Set(text(value).split(/[,;\s]+/).filter(Boolean))];
}
export function exportResponse(requirement, evidence = []) {
  for (const id of evidenceIds(requirement.evidence)) {
    const matches = evidence.filter(e => e.id === id), e = matches[0];
    if (matches.length !== 1 || e.status !== "Verified" || !text(e.reviewer) || !text(e.source) || !text(e.locator) || !text(e.excerpt) || e.disclosureApproved !== true)
      return "[HOLD — response withheld because linked evidence is not cleared for draft disclosure]";
  }
  return text(requirement.response) || "[DRAFT REQUIRED — no supported answer supplied]";
}
export function composeClause(requirement, evidence = []) {
  const ids = evidenceIds(requirement.evidence);
  const usable = [], gaps = [];
  if (!ids.length) gaps.push("No evidence linked to this requirement.");
  for (const id of ids) {
    const matches = evidence.filter(e => e.id === id);
    const e = matches[0];
    if (matches.length !== 1) { gaps.push(`${id}: evidence missing or duplicate ID.`); continue; }
    if (e.status !== "Verified" || !text(e.reviewer) || !text(e.source) ||
        !text(e.excerpt) || !text(e.locator) || e.disclosureApproved !== true) {
      gaps.push(`${id}: needs verified source excerpt, page/section, reviewer and disclosure permission.`);
      continue;
    }
    usable.push(e);
  }
  const lines = [REVIEW_MARKER, "", `Response basis for ${text(requirement.id)} (buyer source line ${text(requirement.sourceLine) || "manual"}):`];
  for (const e of usable) {
    lines.push(`Evidence ${e.id} — ${e.source}; ${e.locator}; recorded verifier: ${e.reviewer}.`,
      `Source excerpt: “${e.excerpt}”`, "");
  }
  for (const gap of gaps) lines.push(`[GAP — ${gap}]`);
  lines.push("", "Reviewer drafting action: " + (guidance[requirement.category] || "Answer every part of the buyer requirement using relevant client-approved facts and a named reviewer."));
  return {response: lines.join("\n"), citations: usable.map(e => ({id:e.id, source:e.source, locator:e.locator})), gaps};
}
export function composeResponses(requirements = [], evidence = []) {
  return requirements.map(r => text(r.response) ? {...r} : {...r, response:composeClause(r,evidence).response, status:"In review"});
}
export function submissionDraft(bid = {}) {
  const eoi = bid.type === "Expression of interest";
  const s = value => safeMarkdown(value) || "[TO CONFIRM]";
  const lines = ["# DRAFT ONLY — NOT APPROVED FOR SUBMISSION", "",
    `## ${eoi ? "Expression of interest" : "Tender / procurement response"}`, "",
    `Contractor: ${s(bid.client)}`, `Buyer: ${s(bid.buyer)}`,
    `Package: ${s(bid.title)} | Reference: ${s(bid.reference)}`,
    `Buyer source: ${s(bid.source)}`, `Closing date/time: ${s(bid.deadline)}`, "",
    "This working draft assembles operator-entered responses and cited evidence. It makes no independent verification, commitment or submission.", "",
    "## Submission introduction", "",
    `[DRAFT — ${eoi ? "Confirm interest in the specified package and summarise only evidenced relevant capabilities. An EOI is not an award or acceptance of contract terms." : "Summarise the buyer scope, evidenced delivery approach and approved qualifications to the offer."}]`, "",
    "## Clause responses", ""];
  for (const r of bid.requirements || []) {
    lines.push(`### ${s(r.id)} — ${s(r.category)}`, `Buyer source line: ${s(r.sourceLine)}`,
      `Buyer requirement: ${s(r.text)}`, `Review status: ${s(r.status)} | Owner: ${s(r.owner)}`, "",
      s(exportResponse(r, bid.evidence || [])), "");
  }
  lines.push("## Evidence cited in this draft", "");
  const linkedIds = new Set((bid.requirements || []).flatMap(r => evidenceIds(r.evidence)));
  for (const id of linkedIds) {
    const entries = (bid.evidence || []).filter(e => e.id === id);
    const e = entries[0];
    if (entries.length !== 1 || e.status !== "Verified" || !text(e.reviewer) || !text(e.source) || !text(e.locator) || !text(e.excerpt) || e.disclosureApproved !== true) {
      lines.push(`- ${s(id)}: [HOLD — evidence not cleared for use]`); continue;
    }
    lines.push(`- ${s(e.id)}: ${s(e.source)}; ${s(e.locator)}; recorded verifier ${s(e.reviewer)}. Reconfirm currency and permission before external release.`);
  }
  lines.push("", eoi ? "## EOI qualifications and next-stage information" : "## Commercial schedules and departures",
    "[HOLD — client-approved scope, exclusions, rates if requested, availability and contractual departures. No commitments generated.]", "",
    "## Release hold", "[HOLD — current buyer package and addenda, signed mandate, competent technical/HSE/commercial reviews, authorised signatory and separate submission approval.]", "");
  return lines.join("\n");
}
