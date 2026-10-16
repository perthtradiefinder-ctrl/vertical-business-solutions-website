import test from "node:test";
import assert from "node:assert/strict";
import {classifyDocument, extractRequirements, assessReadiness, draftOutline, requirementsCsv, evidenceCsv, auditResponses, reviewReport} from "./engine.mjs";

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
  const requirements = [{id:"REQ-001",text:"Must provide insurance",status:"Satisfied",evidence:"EVD-001",owner:"Contracts lead",response:"Current insurance schedule will be provided with this return, subject to client verification."}];
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
test("cannot mark a fictional example as internally complete", () => {
  const x = assessReadiness({client:"Fictional Contractor",buyer:"Fictional Buyer",source:"SYNTHETIC EXAMPLE — NOT AN OPEN TENDER",
    deadline:"DEMO ONLY — NO REAL CLOSING DATE", addendaConfirmed:true,requirements:[{
      id:"REQ-001",status:"Satisfied",evidence:"EVD-001",response:"Here is a documented method statement with verified relevant attachments.",owner:"Reviewer"
    }],evidence:[{id:"EVD-001",status:"Verified",reviewer:"A",source:"Document"}],
    approvals:{mandate:true,technical:true,hse:true,commercial:true,signatory:true}});
  assert.match(x.status, /NOT READY/);
  assert.match(x.blockers.join(" "),/buyer source/i);
});
test("rule-based review flags empty responses and unsupported claims", () => {
  const requirements = [
    {id:"REQ-001", status:"Satisfied", evidence:"EVD-001",owner:"Reviewer",response:"We guarantee 100% compliance and zero incidents on all mining projects."},
    {id:"REQ-002", status:"Gap", evidence:"",response:""}
  ];
  const evidence = [{id:"EVD-001",status:"Verified",reviewer:"R",source:"File"}];
  const x = auditResponses({requirements,evidence});
  assert.ok(x.blockers >= 2);
  assert.ok(x.reviews >= 1);
  assert.match(reviewReport({requirements,evidence}),/NOT A CERTIFICATION/);
});
test("completing internal gates requires a substantive draft response", () => {
  const base = {buyer:"B",client:"C",source:"https://official.example/package",deadline:"23 October 2026 14:00 AWST",
    addendaConfirmed:true, evidence:[{id:"EVD-001",status:"Verified",reviewer:"R",source:"Doc"}],
    approvals:{mandate:true,technical:true,hse:true,commercial:true,signatory:true}};
  const req = {id:"REQ-001", status:"Satisfied", evidence:"EVD-001",response:"",owner:"R"};
  assert.match(assessReadiness({...base,requirements:[req]}).status,/NOT READY/);
  assert.match(assessReadiness({...base,requirements:[{...req,response:"The contractor will deliver the evidence-backed method described in the approved plan."}]}).status,/INTERNAL GATES COMPLETE/);
});
