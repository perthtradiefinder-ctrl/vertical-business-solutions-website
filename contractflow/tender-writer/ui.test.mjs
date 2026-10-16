/* DOM event integration test, not a real browser/layout/accessibility certification.
   Node 22+ syntax detection loads writer.js as an ES module. No external packages. */
import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const downloads=[];
class Element {
  constructor(tag="div") { this.tagName=tag; this.children=[]; this.listeners={}; this.attributes={}; this.value=""; this.checked=false; this.textContent=""; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children=[...children]; }
  setAttribute(name,value) { this.attributes[name]=value; }
  getAttribute(name) { return this.attributes[name]; }
  addEventListener(type,handler) { (this.listeners[type]??=[]).push(handler); }
  async dispatch(type) { for(const handler of this.listeners[type]||[]) await handler({target:this,preventDefault(){}}); }
  querySelectorAll(selector) { return this.children.flatMap(c=>[...(selector.split(',').includes(c.tagName)?[c]:[]),...c.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0]??null; }
  setCustomValidity(message) { this.validationMessage=message; }
  reportValidity() {} focus() {} remove() {} click() { if(this.tagName === "a") downloads.push(this); }
}

test("UI workflow: compose, preserve answers, export, invalidate approvals, revoke, amend source and reset",async()=>{
  const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
  const ids=new Map([...html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"/g)].map(([,tag,id])=>[id,new Element(tag)]));
  const gates=new Map([...html.matchAll(/data-approval="([^"]+)"/g)].map(([,key])=>[key,new Element('input')]));
  const $=id=>{assert.ok(ids.has(id),`HTML control ${id} exists`);return ids.get(id);};
  globalThis.document={getElementById:$,createElement:tag=>new Element(tag),body:new Element('body'),
    querySelector:selector=>gates.get(selector.match(/data-approval="([^"]+)"/)[1])};
  let confirmations=0;
  const blobs=new Map(), originalCreate=URL.createObjectURL;
  URL.createObjectURL=blob=>{const key="blob:test-"+blobs.size;blobs.set(key,blob);return key;};
  globalThis.window={confirm:()=>{confirmations++; return true;},addEventListener(){}};
  $('evidenceForm').reset=()=>{
    for(const id of ['evDescription','evSource','evReviewer','evExcerpt','evLocator']) $(id).value='';
    $('evStatus').value='Unverified';$('evDisclosure').checked=false;
  };
  await import('./writer.js');
  await $('sample').dispatch('click');
  assert.equal($('reqRows').children.length,7);
  assert.match($('status').textContent,/NOT READY/);
  const set=async(id,value,event='input')=>{$(id).value=value;await $(id).dispatch(event);};
  await set('evDescription','Synthetic mobilisation evidence');
  await set('evSource','DEMO plan v1');await set('evReviewer','Fictional reviewer');
  await set('evExcerpt','The fictional crew has two fitters for this exercise.');
  await set('evLocator','p3 section 2');$('evStatus').value='Verified';$('evDisclosure').checked=true;
  await $('evidenceForm').dispatch('submit');
  assert.equal($('evRows').children.length,1);
  let first=$('reqRows').children[0];
  let inputs=first.querySelectorAll('input');
  inputs[0].value='EVD-001';await inputs[0].dispatch('input');
  inputs[1].value='Fictional reviewer';await inputs[1].dispatch('input');
  await $('compose').dispatch('click');
  first=$('reqRows').children[0];
  assert.match(first.querySelector('textarea').value,/two fitters/);
  assert.equal(first.querySelector('select').value,'In review');
  const answer=first.querySelector('textarea');
  answer.value='Operator reviewed response must be retained exactly.';await answer.dispatch('input');
  await $('compose').dispatch('click');
  assert.equal($('reqRows').children[0].querySelector('textarea').value,answer.value);
  $('type').value='Expression of interest';await $('type').dispatch('change');
  await $('buildResponse').dispatch('click');
  assert.match($('draftText').value,/EOI qualifications/);
  assert.match($('draftText').value,/Internal review blockers/);
  await $('runAudit').dispatch('click');assert.match($('auditSummary').textContent,/7 clauses examined/);
  for(const id of ['downloadDraft','csvReq','csvEvidence','exportAudit']) await $(id).dispatch('click');
  assert.equal(downloads.length,4);
  const exported=await Promise.all(downloads.map(a=>blobs.get(a.href).text()));
  assert.match(exported[0],/DRAFT ONLY/);assert.match(exported[1],/REQ-001/);
  assert.match(exported[2],/DEMO plan v1/);assert.match(exported[3],/NOT A CERTIFICATION/);
  for(const gate of gates.values()){gate.checked=true;await gate.dispatch('change');}
  assert.ok([...gates.values()].every(g=>g.checked),'ticks do not invalidate other ticks');
  await $('evRows').children[0].querySelector('button').dispatch('click');
  assert.ok([...gates.values()].every(g=>!g.checked),'evidence revocation clears approvals');
  assert.equal($('draftText').value,'');
  assert.match($('evRows').children[0].children[3].textContent,/Unverified/);
  $('coverage').checked=true;await $('coverage').dispatch('change');
  await set('sourceText','The buyer must provide an amended scope.');
  assert.equal($('coverage').checked,false);
  assert.equal($('addenda').checked,false);
  await $('compose').dispatch('click');assert.match($('composeInfo').textContent,/Source changed/);
  await $('analyse').dispatch('click');assert.ok(confirmations>0);
  assert.equal($('reqRows').children.length,1);
  // Local file import also invalidates existing work, including readiness and generated output.
  await $('buildResponse').dispatch('click');
  $('file').files=[{name:'amendment.txt',size:50,text:async()=> 'The tenderer must attach new insurance evidence.'}];
  await $('file').dispatch('change');assert.equal($('draftText').value,'');
  await $('compose').dispatch('click');assert.match($('composeInfo').textContent,/Source changed/);
  await $('clear').dispatch('click');assert.equal($('sourceText').value,'');
  assert.match($('counts').textContent,/0 clauses · 0 evidence/);
  assert.match(html,/connect-src 'none'/);assert.match(html,/form-action 'none'/);
  URL.createObjectURL=originalCreate;
  delete globalThis.document;delete globalThis.window;
});
