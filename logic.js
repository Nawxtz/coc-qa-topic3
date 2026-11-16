// Pure data rules, no DOM: loaded before app.js and unit-tested in tests/logic.test.js.
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  if (!head) return [];
  const keys = head.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

// PSU academic year runs Aug-Jul (as in the Q-Check sheet). Returns B.E.
function academicYear(iso) {
  const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
  return (m >= 8 ? y : y - 1) + 543;
}
// A year-only award may name its academic year (B.E., e.g. 2566) in date_note instead of the January guess.
function entryYear(iso, note) {
  const m = /^\s*(25\d\d)\s*$/.exec(note || "");
  return m ? +m[1] : academicYear(iso);
}
function progList(s) {
  return (s || "").split(",").map((p) => p.trim()).filter(Boolean).map((p) => ({ id: p.replace("*", ""), lead: p.includes("*") }));
}

// stable id from work and date, so shared links survive sheet edits
function workId(key) {
  let h = 5381;
  for (const ch of key) h = ((h << 5) + h + ch.codePointAt(0)) | 0;
  return "w" + (h >>> 0).toString(36);
}

// One lecturer per name (case and spacing ignored): duplicate rows add up their works,
// programmes and notes. Returns the merged list and the names that were duplicated.
function mergeStaff(staff) {
  const map = new Map(), dups = new Set();
  for (const s of staff) {
    const k = String(s.name || "").replace(/\s+/g, " ").trim().toLowerCase();
    const m = map.get(k);
    if (!m) {
      map.set(k, { ...s, progs: s.progs.map((p) => ({ ...p })), years: Object.fromEntries(Object.entries(s.years).map(([y, v]) => [y, { ...v }])) });
      continue;
    }
    dups.add(m.name);
    for (const [y, v] of Object.entries(s.years)) {
      const t = (m.years[y] ||= { j: 0, p: 0 });
      t.j += v.j; t.p += v.p;
    }
    for (const p of s.progs) {
      const have = m.progs.find((x) => x.id === p.id);
      if (have) have.lead ||= p.lead; else m.progs.push({ ...p });
    }
    if (s.note && !String(m.note || "").includes(s.note)) m.note = m.note ? `${m.note} · ${s.note}` : s.note;
  }
  return { staff: [...map.values()], dups: [...dups] };
}

// Programme lecturer rule over the 5 calendar years ending at endCE:
// bachelor needs 1 work, master 3; work during study leave (note set) does not count.
function evaluate(s, endCE) {
  let j = 0, p = 0;
  for (let y = endCE - 4; y <= endCE; y++) { j += s.years[y]?.j || 0; p += s.years[y]?.p || 0; }
  const total = j + p, counted = !s.note;
  return { ...s, j, p, total, bach: counted && total >= 1, mast: counted && total >= 3 };
}
