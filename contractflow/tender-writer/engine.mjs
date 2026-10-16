/* ContractFlow Tender Writer: deterministic, browser-safe analysis engine.
   Deliberately no network, secrets, external packages or claim-generating AI. */
export const VERSION = "0.1.0";
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
      text: c.text.slice(0, 1300),
      category: classifyRequirement(c.text),
      mandatory: /\b(must|shall|required|mandatory|compulsory|minimum|at least)\b/i.test(c.text),
      status: "Unassessed",
      evidence: "",
      owner: "",
      notes: ""
    });
    if (result.length >= 200) break;
  }
  return result;
}
export function assessReadiness({ requirements = [], evidence = [], approvals = {}, buyer = "", client = "", source = "", deadline = "", addendaConfirmed = false } = {}) {
  const blockers = [];
  if (!client.trim()) blockers.push("Client legal entity is not recorded.");
  if (!buyer.trim()) blockers.push("Buyer is not identified.");
  if (!source.trim()) blockers.push("Official source / package reference has not been recorded.");
  if (!deadline.trim()) blockers.push("Closing date and time zone have not been verified.");
  if (!addendaConfirmed) blockers.push("Latest buyer addenda and amendments have not been confirmed.");
  if (!requirements.length) blockers.push("No requirements have been extracted or manually added.");
  const verifiedIds = new Set(evidence.filter(e => e.status === "Verified" && String(e.reviewer || "").trim() && String(e.source || "").trim()).map(e => e.id));
  const missing = requirements.filter(r => r.status !== "Satisfied" || !verifiedIds.has(String(r.evidence || "").trim()));
  if (missing.length) blockers.push(missing.length + " requirements lack a satisfied status linked to a verified evidence ID.");
  const unverified = evidence.filter(e => e.status !== "Verified");
  if (unverified.length) blockers.push(unverified.length + " evidence records are not verified.");
  for (const [key, label] of Object.entries({
    mandate: "Written client mandate",
    technical: "Named technical review",
    hse: "HSE review",
    commercial: "Commercial approval",
    signatory: "Authorised signatory approval"
  })) { if (!approvals[key]) blockers.push(label + " remains outstanding."); }
  return { status: blockers.length ? "NOT READY — REVIEW REQUIRED" : "INTERNAL GATES COMPLETE — NO SUBMISSION AUTHORITY", blockers };
}
export function draftOutline({ buyer = "", client = "", reference = "", title = "", type = "", requirements = [] } = {}) {
  const safe = v => String(v || "").replace(/\r?\n/g, " ").trim() || "[TO CONFIRM]";
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
    result += "\n### " + category + "\n";
    for (const r of requirements.filter(r => r.category === category)) {
      result += "\n**" + r.id + " — Source line " + r.sourceLine + (r.mandatory ? " — mandatory candidate" : "") + "**\n";
      result += "> " + r.text.replace(/\n/g, " ") + "\n\n";
      result += "Status: " + r.status + "\n";
      result += "Evidence reference: " + (r.evidence.trim() || "[MISSING]") + "\n";
      result += "Response: [DRAFT REQUIRED — DO NOT INVENT PROJECTS, INSURANCE, TICKETS OR RESULTS]\n";
      if (r.notes.trim()) result += "Internal note: " + r.notes.trim() + "\n";
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
  const keys = ["id", "sourceLine", "text", "category", "mandatory", "status", "evidence", "owner", "notes"];
  return [keys.map(csvCell).join(","), ...items.map(item => keys.map(k => csvCell(item[k])).join(","))].join("\r\n");
}
export function evidenceCsv(items) {
  const keys = ["id", "description", "source", "status", "reviewer"];
  return [keys.map(csvCell).join(","), ...items.map(item => keys.map(k => csvCell(item[k])).join(","))].join("\r\n");
}
