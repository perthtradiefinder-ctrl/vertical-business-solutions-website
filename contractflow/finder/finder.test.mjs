import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, "index.html"), "utf8");
const fixture = JSON.parse(readFileSync(join(dir, "opportunities.json"), "utf8"));
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "Finder script must exist");

const ids = ["q", "category", "region", "type", "status", "list", "count",
  "empty", "error", "reset", "n-open", "n-stale", "n-closed", "n-unverified"];
class Element {
  constructor(tag = "div") {
    this.tag = tag; this.value = ""; this.children = []; this.textContent = "";
    this.listeners = {}; this.className = "";
    this.classList = {
      classes: new Set(["hidden"]),
      remove(key) { this.classes.delete(key); },
      toggle(key, enabled) { enabled ? this.classes.add(key) : this.classes.delete(key); }
    };
  }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; }
  addEventListener(event, cb) { this.listeners[event] = cb; }
  focus() { this.focused = true; }
}

async function mount(data, isoTime = "2026-10-16T19:00:00Z", failFetch = false) {
  const nodes = Object.fromEntries(ids.map(id => [id, new Element()]));
  nodes.status.value = "open";
  const clock = { ms: Date.parse(isoTime) };
  class ControlledDate extends Date {
    static now() { return clock.ms; }
  }
  const timers = [];
  const document = {
    hidden: false,
    getElementById(id) {
      assert.ok(nodes[id], "Missing element: " + id);
      return nodes[id];
    },
    createElement(tag) { return new Element(tag); },
    addEventListener() {}
  };
  const fetch = async () => failFetch
    ? { ok: false }
    : { ok: true, json: async () => data };
  vm.runInNewContext(script, {
    document, fetch, Date: ControlledDate, setInterval: fn => timers.push(fn)
  }, { timeout: 2000 });
  for (let i = 0; i < 10; i++) await Promise.resolve();
  return { nodes, clock, timers };
}

test("noindex review build and source dataset remain separated", () => {
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.equal(fixture.opportunities.length, 13);
  assert.ok(fixture.opportunities.every(r => !r.clientAuthorised));
  assert.ok(fixture.opportunities.every(r => r.sourceUrl.startsWith("https://gateway.")));
});

test("open/source statuses, results, and package-level qualifications", async () => {
  const { nodes } = await mount(fixture);
  assert.equal(nodes["n-open"].textContent, "9");
  assert.equal(nodes["n-stale"].textContent, "0");
  assert.equal(nodes["n-closed"].textContent, "3");
  assert.equal(nodes["n-unverified"].textContent, "1");
  assert.equal(nodes.list.children.length, 9);
  assert.ok(nodes.list.children[0].children.some(c =>
    c.className === "qualification" && c.textContent.includes("NOT been independently reviewed")));
});

test("search, full historical view, and reset", async () => {
  const { nodes } = await mount(fixture);
  nodes.status.value = "all"; nodes.status.listeners.input();
  assert.equal(nodes.list.children.length, 13);
  nodes.q.value = "p2000"; nodes.q.listeners.input();
  assert.equal(nodes.list.children.length, 7);
  nodes.reset.listeners.click();
  assert.equal(nodes.list.children.length, 9);
  assert.equal(nodes.status.value, "open");
  assert.equal(nodes.q.value, "");
});

test("48-hour AWST freshness boundary reclassifies marked-open listings", async () => {
  const { nodes, clock, timers } = await mount(fixture);
  clock.ms = Date.parse("2026-10-18T16:00:00Z"); // 19 October 00:00 AWST
  timers[0]();
  assert.equal(nodes["n-open"].textContent, "0");
  assert.equal(nodes["n-stale"].textContent, "9");
  assert.equal(nodes.list.children.length, 0);
});

test("unknown exact closing hour removes listings from beginning of AWST closing day", async () => {
  const recent = structuredClone(fixture);
  recent.opportunities.filter(r => r.status === "open").forEach(r => r.checkedDate = "2026-10-22");
  const { nodes } = await mount(recent, "2026-10-22T16:00:00Z"); // 23 October 00:00 AWST
  assert.equal(nodes["n-open"].textContent, "0");
  assert.equal(nodes["n-stale"].textContent, "9");
});

test("invalid dates, forged URLs, duplicates and missing deadlines fail closed", async () => {
  const bad = structuredClone(fixture);
  bad.opportunities.push(
    structuredClone(bad.opportunities[0]),
    { ...bad.opportunities[0], id: "forged-url", sourceUrl: "https://gateway.icn.org.au.evil/path" },
    { ...bad.opportunities[0], id: "invalid-date", checkedDate: "2026-02-30" },
    { ...bad.opportunities[0], id: "no-deadline", closingDate: null }
  );
  const { nodes } = await mount(bad);
  assert.equal(nodes.list.children.length, 9);
  assert.match(nodes.error.textContent, /4 invalid or duplicate source record/);
});

test("unavailable data displays no results and an explicit failure notice", async () => {
  const { nodes } = await mount(fixture, "2026-10-16T19:00:00Z", true);
  assert.equal(nodes.list.children.length, 0);
  assert.equal(nodes.count.textContent, "Source records unavailable");
  assert.match(nodes.error.textContent, /Finder data could not be loaded/);
});
