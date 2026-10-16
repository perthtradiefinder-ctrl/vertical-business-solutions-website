import { classifyDocument, extractRequirements, assessReadiness, draftOutline, requirementsCsv, evidenceCsv, auditResponses, reviewReport } from "./engine.mjs";

const byId = id => document.getElementById(id);
const fields = ["client","buyer","title","reference","source","deadline","type","sourceText","addenda"];
const approvals = ["mandate","technical","hse","commercial","signatory"];
const state = { requirements: [], evidence: [] };
const el = (tag, text = "", className = "") => {
  const node = document.createElement(tag);
  if (text !== "") node.textContent = String(text);
  if (className) node.className = className;
  return node;
};
const value = id => String(byId(id).value || "").trim();
function bid() {
  return {
    client: value("client"), buyer: value("buyer"), title: value("title"),
    reference: value("reference"), source: value("source"),
    deadline: value("deadline"), type: value("type"),
    addendaConfirmed: byId("addenda").checked,
    requirements: state.requirements, evidence: state.evidence,
    approvals: Object.fromEntries(approvals.map(key => [key, document.querySelector('[data-approval="' + key + '"]').checked]))
  };
}
function invalidateOutput() {
  byId("draftText").value = "";
  byId("auditSummary").textContent = "Inputs changed — rerun the quality review.";
  const body = byId("auditRows");
  body.replaceChildren();
  const row = el("tr"), cell = el("td", "Review results must be refreshed.", "empty");
  cell.colSpan = 3; row.append(cell); body.append(row);
}
function refreshDashboard() {
  const report = assessReadiness(bid());
  byId("status").textContent = report.status;
  byId("counts").textContent = state.requirements.length + " clauses · " + state.evidence.length + " evidence records";
  const ul = byId("blockers"); ul.replaceChildren();
  if (!report.blockers.length) {
    ul.append(el("li", "Internal checklist complete. Signed permissions and submission authority must still be verified outside this prototype."));
  } else for (const block of report.blockers) ul.append(el("li", block));
}
function addCell(row, content) {
  const cell = el("td");
  if (typeof content === "string") cell.textContent = content;
  else if (content) cell.append(content);
  row.append(cell);
  return cell;
}
function selectControl(values, current, onChange) {
  const select = el("select", "", "data-select");
  for (const opt of values) {
    const o = el("option", opt); o.value = opt; select.append(o);
  }
  select.value = current;
  select.addEventListener("change", () => onChange(select.value));
  return select;
}
function textControl(current, hint, onChange) {
  const input = el("input", "", "data-input");
  input.type = "text"; input.value = current; input.placeholder = hint;
  input.addEventListener("input", () => onChange(input.value));
  return input;
}
function renderRequirements() {
  const body = byId("reqRows"); body.replaceChildren();
  if (!state.requirements.length) {
    const row = el("tr"); const c = addCell(row, "No requirements yet. Analyse extracted text or add a buyer clause.");
    c.colSpan = 6; c.className = "empty"; body.append(row); return;
  }
  for (const item of state.requirements) {
    const row = el("tr");
    const id = el("div", item.id, "cell-id");
    const line = el("div", "Source text line " + (item.sourceLine || "manual"), "cell-muted");
    const idCell = addCell(row, id); idCell.append(line);
    const clause = el("div", item.text);
    const cat = el("span", item.category, "cell-category");
    const c2 = addCell(row, clause); c2.append(cat);
    if (item.mandatory) c2.append(el("span", "MANDATORY CANDIDATE", "tag"));
    addCell(row, selectControl(
      ["Unassessed", "Gap", "In review", "Satisfied", "Not applicable — justify"],
      item.status,
      v => { item.status = v; invalidateOutput(); refreshDashboard(); }
    ));
    addCell(row, textControl(item.evidence, "Evidence ID / citation", v => { item.evidence = v; invalidateOutput(); refreshDashboard(); }));
    addCell(row, textControl(item.owner, "Named reviewer", v => { item.owner = v; invalidateOutput(); refreshDashboard(); }));
    const responseCell = addCell(row, el("textarea", "", "response-input"));
    const response = responseCell.querySelector("textarea");
    response.rows = 4;
    response.value = item.response || "";
    response.placeholder = "Write only client-confirmed facts and the methodology addressing this clause.";
    response.setAttribute("aria-label", "Draft response for " + item.id);
    response.addEventListener("input", () => {
      item.response = response.value;
      invalidateOutput();
      refreshDashboard();
    });
    body.append(row);
  }
}
function renderEvidence() {
  const body = byId("evRows"); body.replaceChildren();
  if (!state.evidence.length) {
    const row = el("tr"); const c = addCell(row, "No evidence recorded.");
    c.colSpan = 5; c.className = "empty"; body.append(row); return;
  }
  for (const e of state.evidence) {
    const row = el("tr");
    addCell(row, e.id); addCell(row, e.description); addCell(row, e.source);
    addCell(row, e.status); addCell(row, e.reviewer || "Not assigned");
    body.append(row);
  }
}
function download(name, text, mime) {
  const blob = new Blob([text], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function analyse() {
  const text = value("sourceText");
  if (!text) { byId("intakeInfo").textContent = "Paste extracted text before analysing."; return; }
  if (state.requirements.some(r => r.response?.trim() || r.status !== "Unassessed" || r.evidence?.trim())) {
    if (!window.confirm("Re-extracting will replace the current compliance matrix and all draft answers. Export them first if needed. Continue?")) return;
  }
  const items = extractRequirements(text);
  state.requirements = items;
  byId("type").value = classifyDocument(text);
  byId("intakeInfo").textContent = items.length + " candidate clauses extracted. Human verification required; not all clauses will be detected.";
  byId("draftText").value = "";
  invalidateOutput(); renderRequirements(); refreshDashboard();
}
byId("analyse").addEventListener("click", analyse);
byId("manualAdd").addEventListener("click", () => {
  const clause = value("manualClause");
  if (clause.length < 12) { byId("manualClause").focus(); return; }
  const seq = state.requirements.length + 1;
  state.requirements.push({
    id: "REQ-" + String(seq).padStart(3, "0"), sourceLine: "manual",
    text: clause, category: "Other requirements", mandatory: true,
    status: "Unassessed", evidence: "", owner: "", notes: "", response: ""
  });
  byId("manualClause").value = ""; invalidateOutput(); renderRequirements(); refreshDashboard();
});
byId("evidenceForm").addEventListener("submit", event => {
  event.preventDefault();
  const description = value("evDescription"), source = value("evSource"),
        status = value("evStatus"), reviewer = value("evReviewer");
  if (!description || !source) return;
  if (status === "Verified" && !reviewer) {
    byId("evReviewer").setCustomValidity("Name the human reviewer before marking evidence verified.");
    byId("evReviewer").reportValidity(); return;
  }
  byId("evReviewer").setCustomValidity("");
  state.evidence.push({
    id: "EVD-" + String(state.evidence.length + 1).padStart(3, "0"),
    description, source, status, reviewer
  });
  byId("evidenceForm").reset(); invalidateOutput(); renderEvidence(); refreshDashboard();
});
byId("evReviewer").addEventListener("input", () => byId("evReviewer").setCustomValidity(""));
for (const id of fields) {
  byId(id).addEventListener(id === "addenda" || id === "type" ? "change" : "input", () => { invalidateOutput(); refreshDashboard(); });
}
for (const key of approvals) document.querySelector('[data-approval="' + key + '"]').addEventListener("change", () => { invalidateOutput(); refreshDashboard(); });
function runAudit() {
  const result = auditResponses(bid());
  byId("auditSummary").textContent = result.examined + " clauses examined · " + result.blockers +
    " blockers · " + result.reviews + " review flags. Automated heuristics only.";
  const body = byId("auditRows"); body.replaceChildren();
  if (!result.findings.length) {
    const row = el("tr"), cell = el("td", "No rule-based flags found. Human technical, compliance and commercial review is still mandatory.", "empty");
    cell.colSpan = 3; row.append(cell); body.append(row);
  } else {
    for (const finding of result.findings) {
      const row = el("tr");
      addCell(row, finding.id);
      addCell(row, finding.severity);
      addCell(row, finding.finding);
      body.append(row);
    }
  }
}
byId("runAudit").addEventListener("click", runAudit);
byId("exportAudit").addEventListener("click", () => {
  runAudit();
  download("CONTRACTFLOW_RULE_BASED_REVIEW.md", reviewReport(bid()), "text/markdown");
});
byId("buildDraft").addEventListener("click", () => { byId("draftText").value = draftOutline(bid()); });
byId("downloadDraft").addEventListener("click", () => {
  if (!value("draftText")) byId("draftText").value = draftOutline(bid());
  download("CONTRACTFLOW_DRAFT_NOT_APPROVED.md", byId("draftText").value, "text/markdown");
});
byId("csvReq").addEventListener("click", () =>
  download("CONTRACTFLOW_REQUIREMENTS.csv", requirementsCsv(state.requirements), "text/csv"));
byId("csvEvidence").addEventListener("click", () =>
  download("CONTRACTFLOW_EVIDENCE.csv", evidenceCsv(state.evidence), "text/csv"));
byId("file").addEventListener("change", async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const ext = file.name.toLowerCase();
  if (!/\.(txt|md)$/.test(ext) || file.size > 2_000_000) {
    byId("intakeInfo").textContent = "Only .txt/.md files up to 2 MB are supported. Extract PDF or DOCX text separately.";
    e.target.value = ""; return;
  }
  try {
    byId("sourceText").value = await file.text();
    byId("intakeInfo").textContent = "Local text loaded: " + file.name + ". Click Extract requirements.";
  } catch {
    byId("intakeInfo").textContent = "Could not read this file locally.";
  }
  e.target.value = "";
});
function reset() {
  for (const id of fields) {
    if (id === "addenda") byId(id).checked = false;
    else byId(id).value = id === "type" ? "Unclassified" : "";
  }
  for (const key of approvals) document.querySelector('[data-approval="' + key + '"]').checked = false;
  state.requirements = []; state.evidence = [];
  byId("draftText").value = ""; byId("manualClause").value = "";
  byId("evidenceForm").reset();
  byId("intakeInfo").textContent = "Session cleared; nothing stored or transmitted.";
  renderRequirements(); renderEvidence(); invalidateOutput(); refreshDashboard();
}
byId("clear").addEventListener("click", () => {
  if (window.confirm("Clear all in-memory work in this browser tab? Download required drafts first.")) reset();
});
byId("sample").addEventListener("click", () => {
  if ((state.requirements.length || state.evidence.length || value("sourceText")) &&
      !window.confirm("Replace the current in-memory work with fictional demo data? Download your draft and CSV files first if needed.")) return;
  reset();
  byId("client").value = "Example Contractor Pty Ltd — FICTIONAL";
  byId("buyer").value = "Example Mining Buyer — FICTIONAL";
  byId("title").value = "Fictional fixed-plant shutdown services";
  byId("reference").value = "DEMO-ONLY-001";
  byId("source").value = "SYNTHETIC EXAMPLE — NOT AN OPEN TENDER";
  byId("deadline").value = "DEMO ONLY — NO REAL CLOSING DATE";
  byId("sourceText").value = [
    "Fictional Request for Tender — demonstration material only.",
    "1. The contractor must provide a site-specific shutdown methodology and isolation sequence.",
    "2. The tenderer shall demonstrate current applicable high-risk work licences for rigging and scaffolding personnel.",
    "3. Submit evidence of public liability insurance and workers compensation insurance.",
    "4. Provide a workforce mobilisation plan including induction, fatigue management and supervisor coverage.",
    "5. The supplier is required to include a priced schedule and all commercial exclusions.",
    "6. The contractor must provide verified examples of comparable maintenance projects.",
    "7. The contractor shall submit an HSE plan and task-based risk assessments."
  ].join("\n");
  analyse();
});
renderRequirements(); renderEvidence(); refreshDashboard();