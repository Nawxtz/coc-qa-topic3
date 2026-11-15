// Run: node --test tests/*.test.js   (Node 18+, no packages)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "logic.js"), "utf8"), ctx);
const { parseCSV, academicYear, progList, workId, evaluate } = ctx;

test("parseCSV keeps quoted commas, quotes and line breaks", () => {
  const rows = parseCSV('name,award\r\n"Lee, A","He said ""hi""\nagain"\n\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Lee, A");
  assert.equal(rows[0].award, 'He said "hi"\nagain');
  assert.equal(parseCSV("").length, 0);
});

test("academic year turns over in August (B.E.)", () => {
  assert.equal(academicYear("2024-07-31"), 2566);
  assert.equal(academicYear("2024-08-01"), 2567);
  assert.equal(academicYear("2025-01-01"), 2567);
});

test("programme list strips the chair star", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(progList("DE*, MsComp"))), [{ id: "DE", lead: true }, { id: "MsComp", lead: false }]);
});

test("work id is stable for the same work and date", () => {
  assert.equal(workId("PSU COIN|2020-01-01"), workId("PSU COIN|2020-01-01"));
  assert.notEqual(workId("PSU COIN|2020-01-01"), workId("PSU COIN|2021-01-01"));
});

test("lecturer rule counts only the 5-year window and skips study leave", () => {
  const years = { 2019: { j: 5, p: 0 }, 2020: { j: 1, p: 0 }, 2024: { j: 0, p: 1 }, 2025: { j: 9, p: 0 } };
  const s = { name: "A", progs: [], note: "", years };
  const r = evaluate(s, 2024); // AY 2567 -> 2020..2024
  assert.equal(r.total, 2);
  assert.equal(r.bach, true);
  assert.equal(r.mast, false);
  assert.equal(evaluate({ ...s, years: { 2022: { j: 3, p: 0 } } }, 2024).mast, true);
  assert.equal(evaluate({ ...s, note: "ผลงานช่วงลาศึกษาต่อ ไม่นับ" }, 2024).bach, false);
});

test("Q-Check AY 2567 matches the official file: 30 of 36 pass the bachelor rule", () => {
  const pubs = parseCSV(fs.readFileSync(path.join(__dirname, "..", "data", "publications.csv"), "utf8"));
  const ys = Object.keys(pubs[0]).filter((k) => /^j\d{4}$/.test(k)).map((k) => +k.slice(1));
  const staff = pubs.map((p) => ({ note: p.note, years: Object.fromEntries(ys.map((y) => [y, { j: +p[`j${y}`] || 0, p: +p[`p${y}`] || 0 }])) }));
  const pass = staff.filter((s) => evaluate(s, 2024).bach).length;
  assert.equal(staff.length, 36);
  assert.equal(pass, 30);
});
