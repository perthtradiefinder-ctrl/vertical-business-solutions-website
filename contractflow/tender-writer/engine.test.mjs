import test from "node:test";
import assert from "node:assert/strict";
import {classifyDocument, extractRequirements, assessReadiness, draftOutline, requirementsCsv, evidenceCsv} from "./engine.mjs";

test("recognises EOI and RFQ as distinct from tender", () => {
  assert.equal(classifyDocument("Expression of Interest for Pilbara works"), "Expression of interest");
  assert.equal(classifyDocument("Request for quotation mechanical service"), "Request for quotation");
});
test("retains actual source lines and avoids duplicates", () => {
  const items = extractRequirements("Introduction\n\nThe tenderer must provide insurance.\nThe tenderer must provide insurance.\nThe supplier shall submit a safety methodology.");
  assert.equal(items.length, 2);
  assert.equal(items[0].sourceLine, 3);
  assert.equal(items[1].sourceLine, 5);
  assert.equal(items[0].mandatory, true);
});
test("does not treat a typed evidence reference as verified evidence", () => {
  const requirements = [{id:"REQ-001",text:"Must provide insurance",status:"Satisfied",evidence:"EVD-001"}];
  const base = {buyer:"Buyer",client:"Client Pty Ltd",source:"official reference",deadline:"23 Oct 2026 16:00 AWST",addendaConfirmed:true,
    requirements, approvals:{mandate:true,technical:true,hse:true,commercial:true,signatory:true}};
  assert.match(assessReadiness({...base,evidence:[]}).status,/NOT READY/);
  assert.match(assessReadiness({...base,evidence:[{id:"EVD-001",status:"Unverified",source:"x",reviewer:"A"}]}).status,/NOT READY/);
  assert.match(assessReadiness({...base,evidence:[{id:"EVD-001",status:"Verified",source:"x",reviewer:"A"}]}).status,/INTERNAL GATES COMPLETE/);
});
test("document output remains a hold-point draft, not invented credential content", () => {
  const draft = draftOutline({buyer:"Example", client:"Test Pty", requirements:[{id:"REQ-001",sourceLine:3, mandatory:true,
    text:"Must supply a plant supervisor",category:"Workforce & mobilisation",status:"Unassessed",evidence:"",notes:""}]});
  assert.match(draft,/DRAFT ONLY — NOT APPROVED/);
  assert.match(draft,/DO NOT INVENT/);
  assert.match(draft,/REQ-001/);
  assert.match(draft,/HOLD:/);
});
test("CSV export neutralises formula injection", () => {
  const csv = requirementsCsv([{id:"=CMD()",text:"+SUM(1)",notes:"@risk"}]);
  assert.match(csv,/"'=CMD\(\)"/);
  assert.match(csv,/"'\+SUM\(1\)"/);
  assert.match(csv,/"'@risk"/);
  assert.match(evidenceCsv([{id:"EVD-001",description:"Good"}]),/EVD-001/);
});