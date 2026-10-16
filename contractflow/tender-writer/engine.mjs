/* ContractFlow Tender Writer: deterministic, browser-safe analysis engine.
   Deliberately no network, secrets, external packages or claim-generating AI. */
import { evidenceIds, safeMarkdown, exportResponse } from "./drafting.mjs";
export const VERSION = "0.3.0";
export const TYPES = ["Tender / RFT", "Request for quotation", "Expression of interest", "Supplier prequalification", "Unclassified"];
const CATEGORY_RULES = [
  ["Health, safety & environment", /\b(HSE|WHS|safety|hazard|SWMS|JHA|JSA|incident|environment|risk assessment)\b/i],
  ["Workforce & mobilisation", /\b(crew|workforce|personnel|labou?r|mobilis|FIFO|roster|trade|competenc|VOC|training)\b/i],
  ["Technical delivery", /\b(scope|methodolog|work plan|schedule|deliverab|plant|equipment|technical|quality|inspection)\b/i],
  ["Licences & insurance", /\b(insurance|licen[cs]|certificate|public liability|professional indemnity|workers compensation|accreditation)\b/i],
  ["Commercial", /\b(pric|quotation|rate|contract|financial|GST|warranty|security|bond|terms and conditions)\b/i],
  ["Corporate experience", /\b(experience|reference|similar project|case study|capabilit|track record)\b/i]
];
export function classifyDocument(text) {
  const t = String(text || "");
  if (/\b(expression of interest|EOI)\b/i.test(t)) return TYPES[2];
  if (/\b(request for quotation|RFQ)\b/i.test(t)) return TYPES[1];
  if (/\b(prequalif|supplier registration|vendor registration)\b/i.test(t)) return TYPES[3];
  if (/\b(request for tender|invitation to tender|RFT|ITT|tender)\b/i.test(t)) return TYPES[0];
  return TYPES[4];
}
export function classifyRequirement(text) {
  const t = String(text || "");
  const entry = CATEGORY_RULES.find(([, pattern]) => pattern.test(t));
  return entry ? entry[0] : "Other requirements";
}
function normalise(s) { return s.replace(/\s+/g, " ").trim(); }
export function extractRequirements(input) {
  if (String(input || "").length > 2_000_000) throw new Error("Text exceeds the 2,000,000-character limit. Split and review the source package.");
  const text = String(input || "").replace(/\r\n?/g, "\n");
  const lines = text.split("\n").map((raw, index) => ({ value: normalise(raw), line: index + 1 })).filter(item => item.value);
  const candidates = [];
  // A complete line is retained for source traceability; do not infer missing clauses.
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo].value;
    if (line.length < 12) continue;
    const chunks = line.length > 400
      ? (line.match(/[^.!?;]+[.!?;]?/g) || [line]).map(normalise)
      : [line];
    for (const chunk of chunks) {
      if (/\b(must|shall|required|mandatory|compulsory|provide|submit|include|demonstrate|attach|upload|complete|evidence of|minimum|at least)\b/i.test(chunk) ||
          /^(?:\d+(?:\.\d+)*[.)]?|[a-z][.)]|[-*•])\s+/i.test(chunk)) {
        candidates.push({ sourceLine: lines[lineNo].line, text: chunk });
      }
    }
  }
  const seen = new Set();
  const result = [];
  for (const c of candidates) {
    const key = c.text.replace(/^[\d.\s\)\(-]+/, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    if (key.length < 8 || seen.has(key)) continue;
    seen.add(key);
    result.push({
      id: "REQ-" + String(result.length + 1).padStart(3, "0"),
      sourceLine: c.sourceLine,
      text: c.text,
      category: classifyRequirement(c.text),
      mandatory: /\b(must|shall|required|mandatory|compulsory|minimum|at least)\b/i.test(c.text),
      status: "Unassessed",
      evidence: "",
      owner: "",
      notes: "",
      response: ""
    });
    if (result.length > 200) throw new Error("More than 200 candidate requirements. Split the package; no partial matrix accepted.");
  }
  return result;
}
export function assessReadiness({ requirements = [], evidence = [], approvals = {}, buyer = "", client = "", source = "", deadline = "", addendaConfirmed = false, sourceText = "", analysedSource = "", coverageConfirmed = false } = {}) {
  const blockers = [];
  if (!sourceText.trim() || sourceText !== analysedSource) blockers.push("Source text is missing or changed since extraction. Re-extract and review coverage.");
  if (!coverageConfirmed) blockers.push("Full buyer package, schedules and addenda coverage has not been manually confirmed.");
  if (!client.trim()) blockers.push("Client legal entity is not recorded.");
  if (!buyer.trim()) blockers.push("Buyer is not identified.");
  if (!source.trim() || /synthetic example|demo.only/i.test(source)) blockers.push("Verified official buyer source / package reference has not been recorded.");
  if (!deadline.trim() || /demo.only/i.test(deadline)) blockers.push("Real buyer closing date, time and timezone have not been recorded.");
  if (!addendaConfirmed) blockers.push("Latest buyer addenda and amendments have not been confirmed.");
  if (!requirements.length) blockers.push("No requirements have been extracted or manually added.");
  const verifiedIds = new Set(evidence.filter(e => e.status === "Verified" && String(e.reviewer || "").trim() && String(e.source || "").trim()).map(e => e.id));
  const missing = requirements.filter(r => r.status !== "Satisfied" || !evidenceIds(r.evidence).length || !evidenceIds(r.evidence).every(id => verifiedIds.has(id)));
  if (missing.length) blockers.push(missing.length + " requirements lack a satisfied status linked to a verified evidence ID.");
  const unwritten = requirements.filter(r => r.status === "Satisfied" && String(r.response || "").trim().length < 40);
  if (unwritten.length) blockers.push(unwritten.length + " requirements are marked satisfied without a substantive drafted response (40+ characters).");
  const linkedIds = new Set(requirements.flatMap(r => evidenceIds(r.evidence)));
  const unverified = evidence.filter(e => linkedIds.has(e.id) && e.status !== "Verified");
  if (unverified.length) blockers.push(unverified.length + " evidence records are not verified.");
  const audit = auditResponses({requirements, evidence});
  if (audit.blockers || audit.reviews) blockers.push(`${audit.blockers} blocking and ${audit.reviews} review findings require resolution in the quality review.`);
  for (const [key, label] of Object.entries({
    mandate: "Written client mandate",
    technical: "Named technical review",
    hse: "HSE review",
    commercial: "Commercial approval",
    signatory: "Authorised signatory approval"
  })) { if (!approvals[key]) blockers.push(label + " remains outstanding."); }
  return { status: blockers.length ? "NOT READY — REVIEW REQUIRED" : "INTERNAL GATES COMPLETE — NO SUBMISSION AUTHORITY", blockers };
}
export function draftOutline({ buyer = "", client = "", reference = "", title = "", type = "", requirements = [], evidence = [] } = {}) {
  const safe = v => safeMarkdown(String(v || "").replace(/\r?\n/g, " ")) || "[TO CONFIRM]";
  const categories = [...new Set(requirements.map(r => r.category))];
  let result = [
    "# DRAFT ONLY — NOT APPROVED FOR SUBMISSION",
    "",
    "Buyer: " + safe(buyer),
    "Contractor: " + safe(client),
    "Opportunity: " + safe(title),
    "Reference: " + safe(reference),
    "Procurement type: " + safe(type),
    "",
    "## 1. Executive response",
    "[DRAFTING INSTRUCTION: Summarise the verified scope, benefit and delivery model. No unverified capability claims.]",
    "",
    "## 2. Understanding of scope",
    "[DRAFTING INSTRUCTION: Summarise buyer objectives and site constraints from source documents, with clause citations.]",
    "",
    "## 3. Technical methodology",
    "[DRAFTING INSTRUCTION: Obtain named technical approver, sequence of work, hold points, equipment and mobilisation plan.]",
    "",
    "## 4. WHS / HSE and quality",
    "[DRAFTING INSTRUCTION: Insert approved controls, HSE responsibilities, QA and evidence only.]",
    "",
    "## 5. Workforce and delivery program",
    "[DRAFTING INSTRUCTION: Confirm trade numbers, competencies, availability, site access and milestones.]",
    "",
    "## 6. Commercial schedules",
    "[HOLD: Client-authorised prices, rates, exclusions, terms, GST and contracts team signoff.]",
    "",
    "## 7. Response-by-requirement matrix",
    ""
  ].join("\n");
  for (const category of categories) {
    result += "\n### " + safe(category) + "\n";
    for (const r of requirements.filter(r => r.category === category)) {
      result += "\n**" + safe(r.id) + " — Source line " + safe(r.sourceLine) + (r.mandatory ? " — mandatory candidate" : "") + "**\n";
      result += "> " + safe(r.text) + "\n\n";
      result += "Status: " + safe(r.status) + "\n";
      result += "Evidence reference: " + (safeMarkdown(r.evidence) || "[MISSING]") + "\n";
      result += "Response: " + (String(r.response || "").trim() ? safeMarkdown(exportResponse(r, evidence)) : "[DRAFT REQUIRED — DO NOT INVENT PROJECTS, INSURANCE, TICKETS OR RESULTS]") + "\n";
      if (String(r.notes || "").trim()) result += "Internal note: " + safeMarkdown(r.notes) + "\n";
    }
  }
  result += "\n## 8. Bid approval and exclusions\n[HOLD: Signed client authority, HSE review, technical review, commercial review, current addenda check, final signatory and portal receipt.]\n";
  return result;
}
export function csvCell(value) {
  let s = String(value ?? "");
  if (/^[\s]*[=+\-@\t\r]/.test(s)) s = "'" + s; // avoid spreadsheet formula execution
  return '"' + s.replace(/"/g, '""') + '"';
}
export function requirementsCsv(items) {
  const keys = ["id", "sourceLine", "text", "category", "mandatory", "status", "evidence", "owner", "notes", "response"];
  return [keys.map(csvCell).join(","), ...items.map(item => keys.map(k => csvCell(item[k])).join(","))].join("\r\n");
}
export function evidenceCsv(items) {
  const keys = ["id", "description", "source", "status", "reviewer", "excerpt", "locator", "disclosureApproved"];
  return [keys.map(csvCell).join(","), ...items.map(item => keys.map(k => csvCell(item[k])).join(","))].join("\r\n");
}

/* Review warnings are heuristics, not independent verification or a score of tender quality. */
export function auditResponses({requirements = [], evidence = []} = {}) {
  const verifiedIds = new Set(evidence.filter(e => e.status === "Verified" && String(e.reviewer || "").trim() && String(e.source || "").trim()).map(e => e.id));
  const findings = [];
  if (!requirements.length) findings.push({id:"GLOBAL",severity:"BLOCKER",finding:"No original buyer requirements available for review."});
  for (const r of requirements) {
    const response = String(r.response || "").trim();
    const linked = evidenceIds(r.evidence);
    const flagged = (severity, finding) => findings.push({id: r.id, severity, finding});
    if (r.status === "Not applicable — justify") flagged("REVIEW", "Not applicable needs documented buyer/approver justification; not auto-accepted.");
    if (r.status === "Unassessed" || r.status === "Gap") flagged("BLOCKER", "Clause is not assessed as satisfied.");
    if (!response) flagged("BLOCKER", "No clause-specific response drafted.");
    else {
      if (response.length < 40) flagged("REVIEW", "Response is very brief; confirm it answers every part of buyer requirement.");
      if (/\[(?:TO CONFIRM|TBC|TBA|INSERT|DRAFT|MISSING|HOLD|REVIEW REQUIRED|GAP)\b[^\]]*\]|\bTBC\b|\bTBA\b/i.test(response))
        flagged("BLOCKER", "Response contains unresolved placeholder text.");
      if (/\b(?:guarantee(?:d|s)?|zero (?:injur(?:y|ies)|incidents?|LTI)|100% (?:compliant|safe|success|on time)|industry.leading|best in (?:WA|Australia))\b/i.test(response))
        flagged("REVIEW", "Strong performance or guarantee claim — check underlying verifiable evidence and client approval.");
    }
    if (r.status !== "Satisfied" && r.status !== "Unassessed" && r.status !== "Gap") flagged("BLOCKER", "Clause remains under review or has an unrecognised status.");
    if (r.status === "Satisfied" && (!linked.length || !linked.every(id => verifiedIds.has(id)))) flagged("BLOCKER", "Satisfied clause lacks linked, named-reviewer-verified evidence.");
    for (const id of linked) {
      const matches = evidence.filter(e => e.id === id);
      const e = matches[0];
      if (matches.length !== 1 || !e || e.status !== "Verified" || !String(e.reviewer || "").trim() || !String(e.source || "").trim() || !String(e.excerpt || "").trim() || !String(e.locator || "").trim() || e.disclosureApproved !== true)
        flagged("BLOCKER", id + " lacks a unique verified source excerpt, locator, reviewer or disclosure permission.");
    }
    if (r.status === "Satisfied" && !String(r.owner || "").trim()) flagged("REVIEW", "No named clause owner or reviewer.");
  }
  return {
    findings,
    blockers: findings.filter(f => f.severity === "BLOCKER").length,
    reviews: findings.filter(f => f.severity === "REVIEW").length,
    examined: requirements.length,
    disclaimer: "Heuristic drafting checks only; buyer clause coverage, technical and commercial accuracy require independent qualified human review."
  };
}
export function reviewReport({buyer = "", client = "", reference = "", requirements = [], evidence = []} = {}) {
  const audit = auditResponses({requirements, evidence});
  return [
    "# CONTRACTFLOW INTERNAL DRAFT REVIEW — NOT A CERTIFICATION",
    "Buyer: " + (safeMarkdown(buyer) || "[UNKNOWN]"),
    "Contractor: " + (safeMarkdown(client) || "[UNKNOWN]"),
    "Package reference: " + (safeMarkdown(reference) || "[UNKNOWN]"),
    "Clauses checked: " + audit.examined,
    "Blocker findings: " + audit.blockers,
    "Review findings: " + audit.reviews,
    "",
    audit.disclaimer,
    "",
    ...audit.findings.map(f => "- **" + f.severity + " · " + safeMarkdown(f.id) + ":** " + safeMarkdown(f.finding))
  ].join("\n");
}
