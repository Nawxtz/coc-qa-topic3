// CoC QA Dashboard, Topic 3. Data comes from Google Sheets (published tabs);
// falls back to the CSV copies in data/ when the sheet is unreachable.
const CONFIG = {
  // Google Sheet IDs (first tab is read). Sheets must be shared "Anyone with the link: Viewer".
  sheets: {
    awards: "1IC4gZUdoIGm3a0hqfotbkXTGnTJfYWGASt15Fbz0vYk",
    publications: "1TnKNMEPJpkfyJ2_4JWRFIy15F_f_wJ6e5F9me_EKWHE",
  },
};

const PROGS = [
  { id: "Comp", th: "Computing (Comp)", v: "--s1" },
  { id: "DBiz", th: "Digital Business (DBiz)", v: "--s2" },
  { id: "DE", th: "Digital Engineering (DE)", v: "--s3" },
  { id: "MsComp", th: "ป.โท Computing (MsComp)", v: "--s4" },
];
const ROLE = { student: "นักศึกษา", faculty: "อาจารย์" };
const LEVEL = { National: "ระดับชาติ", International: "นานาชาติ" };
const CAT = { Competition: "การแข่งขัน", "Research Award": "รางวัลวิจัย", Innovation: "นวัตกรรม", Hackathon: "แฮกกาธอน", Startup: "สตาร์ทอัพ", Other: "รางวัลอื่น ๆ" };
const catTh = (c) => CAT[c] || c;
const $ = (s, r = document) => r.querySelector(s);
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");
const nf = new Intl.NumberFormat("th-TH");

// ---------- data loading ----------
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
  const keys = head.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

async function load(tab) {
  const id = CONFIG.sheets[tab];
  if (id) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
      const res = await fetch(url, { cache: "no-store" });
      const text = res.ok ? await res.text() : "";
      if (text && !text.trimStart().startsWith("<")) return { rows: parseCSV(text), live: true };
    } catch (e) { /* fall through to local copy */ }
  }
  const res = await fetch(`data/${tab}.csv`);
  return { rows: parseCSV(await res.text()), live: false };
}

// PSU academic year runs Aug-Jul (as in the Q-Check sheet). Returns B.E.
function academicYear(iso) {
  const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
  return (m >= 8 ? y : y - 1) + 543;
}
const fmtDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" });
};
const progList = (s) => (s || "").split(",").map((p) => p.trim()).filter(Boolean)
  .map((p) => ({ id: p.replace("*", ""), lead: p.includes("*") }));

// ---------- charts ----------
const charts = {};
function baseOpts(extra = {}) {
  const grid = css("--line"), ink = css("--text-2");
  return {
    responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top", align: "start", labels: { color: ink, boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2, font: { family: "IBM Plex Sans Thai", size: 12 } } },
      tooltip: { backgroundColor: css("--text"), titleColor: css("--bg"), bodyColor: css("--bg"), padding: 10, cornerRadius: 8, boxPadding: 4, titleFont: { family: "IBM Plex Sans Thai" }, bodyFont: { family: "IBM Plex Sans Thai" } },
    },
    scales: {
      x: { grid: { display: false }, border: { color: css("--line-strong") }, ticks: { color: ink, font: { family: "IBM Plex Sans Thai" } } },
      y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: ink, precision: 0, font: { family: "IBM Plex Sans Thai" } } },
    },
    ...extra,
  };
}
function draw(id, config) {
  charts[id]?.destroy();
  charts[id] = new Chart(document.getElementById(id), config);
}
const bar = (label, data, colorVar, stack) => ({
  label, data, backgroundColor: css(colorVar), borderColor: css("--surface"), borderWidth: 2,
  borderRadius: 4, borderSkipped: false, stack, maxBarThickness: 44,
});

// ---------- awards page ----------
let AWARDS = [];
const aForm = $("#af");
let groupBy = "programme";

function initAwards() {
  const years = [...new Set(AWARDS.map((a) => a.ay))].sort();
  const yOpts = years.map((y) => `<option value="${y}">${y}</option>`).join("");
  aForm.from.innerHTML = yOpts; aForm.to.innerHTML = yOpts;
  aForm.from.value = years[0]; aForm.to.value = years.at(-1);
  aForm.prog.insertAdjacentHTML("beforeend", PROGS.map((p) => `<option value="${p.id}">${p.th}</option>`).join(""));
  const cats = [...new Set(AWARDS.map((a) => a.category))].filter(Boolean).sort();
  aForm.cat.insertAdjacentHTML("beforeend", cats.map((c) => `<option value="${esc(c)}">${esc(catTh(c))}</option>`).join(""));
  aForm.addEventListener("input", renderAwards);
  aForm.addEventListener("reset", () => setTimeout(() => { aForm.from.value = years[0]; aForm.to.value = years.at(-1); renderAwards(); }));
  $("#aq").addEventListener("input", renderAwardTable);
  $("#groupby").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    groupBy = b.dataset.g;
    $("#groupby").querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", x === b));
    renderAwards();
  });
}

function filteredAwards() {
  const f = Object.fromEntries(new FormData(aForm));
  let lo = +f.from, hi = +f.to; if (lo > hi) [lo, hi] = [hi, lo];
  return { lo, hi, rows: AWARDS.filter((a) => a.ay >= lo && a.ay <= hi
    && (!f.prog || a.progs.includes(f.prog)) && (!f.role || a.role === f.role)
    && (!f.level || a.level === f.level) && (!f.cat || a.category === f.cat)) };
}

function renderAwards() {
  const { lo, hi, rows } = filteredAwards();
  const years = []; for (let y = lo; y <= hi; y++) years.push(y);
  const stu = rows.filter((r) => r.role === "student").length;
  const intl = rows.filter((r) => r.level === "International").length;
  $("#akpi").innerHTML = [
    ["ผลงานทั้งหมด", rows.length, `ปีการศึกษา ${lo}-${hi}`],
    ["ของนักศึกษา", stu, rows.length ? `${Math.round((stu / rows.length) * 100)}% ของทั้งหมด` : "-"],
    ["ของอาจารย์", rows.length - stu, rows.length ? `${Math.round(((rows.length - stu) / rows.length) * 100)}% ของทั้งหมด` : "-"],
    ["ระดับนานาชาติ", intl, `ระดับชาติ ${nf.format(rows.length - intl)} ผลงาน`],
  ].map(([l, v, s]) => `<div class="kpi"><p>${l}</p><strong>${nf.format(v)}</strong><small>${s}</small></div>`).join("");

  // by academic year, grouped by the chosen dimension
  const groups = groupBy === "programme"
    ? PROGS.map((p) => ({ label: p.th, v: p.v, test: (r) => r.progs.includes(p.id) }))
    : groupBy === "role"
      ? [{ label: "นักศึกษา", v: "--s1", test: (r) => r.role === "student" }, { label: "อาจารย์", v: "--s2", test: (r) => r.role === "faculty" }]
      : [{ label: "ระดับชาติ", v: "--s1", test: (r) => r.level === "National" }, { label: "นานาชาติ", v: "--s2", test: (r) => r.level === "International" }];
  draw("c-year", {
    type: "bar",
    data: { labels: years.map((y) => `ปี ${y}`), datasets: groups.map((g) => bar(g.label, years.map((y) => rows.filter((r) => r.ay === y && g.test(r)).length), g.v, "s")) },
    options: baseOpts({ scales: { ...baseOpts().scales, x: { ...baseOpts().scales.x, stacked: true }, y: { ...baseOpts().scales.y, stacked: true } } }),
  });

  // by programme, student vs faculty
  draw("c-prog", {
    type: "bar",
    data: {
      labels: PROGS.map((p) => p.id),
      datasets: [
        bar("นักศึกษา", PROGS.map((p) => rows.filter((r) => r.role === "student" && r.progs.includes(p.id)).length), "--s1"),
        bar("อาจารย์", PROGS.map((p) => rows.filter((r) => r.role === "faculty" && r.progs.includes(p.id)).length), "--s2"),
      ],
    },
    options: baseOpts(),
  });

  // by category, single series, sorted
  const cats = Object.entries(rows.reduce((m, r) => ((m[r.category] = (m[r.category] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  draw("c-cat", {
    type: "bar",
    data: { labels: cats.map((c) => catTh(c[0])), datasets: [bar("จำนวนผลงาน", cats.map((c) => c[1]), "--s1")] },
    options: baseOpts({ indexAxis: "y", plugins: { ...baseOpts().plugins, legend: { display: false } },
      scales: { x: { ...baseOpts().scales.y, grid: { color: css("--line") } }, y: { ...baseOpts().scales.x } } }),
  });
  renderAwardTable();
}

function renderAwardTable() {
  const q = $("#aq").value.trim().toLowerCase();
  const rows = filteredAwards().rows
    .filter((r) => !q || [r.name, r.work_title, r.award, r.programme].join(" ").toLowerCase().includes(q))
    .sort((a, b) => b.award_date.localeCompare(a.award_date));
  $("#acount").textContent = `${nf.format(rows.length)} รายการ · เรียงจากล่าสุด`;
  const tb = $("#atable tbody");
  if (!rows.length) { tb.innerHTML = `<tr><td colspan="8" class="empty">ไม่พบผลงานตามตัวกรอง</td></tr>`; return; }
  tb.innerHTML = rows.map((r) => {
    const link = safeUrl(r.source_url), img = safeUrl(r.image_url);
    const ev = img ? `<a href="${esc(link || img)}" target="_blank" rel="noopener"><img class="thumb" src="${esc(img)}" alt="ภาพประกอบ ${esc(r.work_title)}" loading="lazy"></a>`
      : link ? `<a href="${esc(link)}" target="_blank" rel="noopener">ดูข่าว ↗</a>` : "-";
    const progs = r.progs.map((p) => { const P = PROGS.find((x) => x.id === p); return `<span class="nowrap"><span class="dot" style="background:var(${P ? P.v : "--line-strong"})"></span>${esc(p)}</span>`; }).join("<br>") || "-";
    return `<tr>
      <td class="nowrap">${r.date_note ? `ปี ${+r.award_date.slice(0, 4) + 543}` : esc(fmtDate(r.award_date))}<span class="note">ปีการศึกษา ${r.ay}${r.date_note ? ` · ${esc(r.date_note)}` : ""}</span></td>
      <td>${esc(r.name)}<span class="note">${ROLE[r.role] || esc(r.role)}</span></td>
      <td>${progs}</td>
      <td class="work">${esc(r.work_title)}</td>
      <td>${esc(r.award)}</td>
      <td><span class="pill">${esc(catTh(r.category))}</span></td>
      <td class="nowrap">${LEVEL[r.level] || esc(r.level)}</td>
      <td>${ev}</td></tr>`;
  }).join("");
}

// ---------- Q-Check page ----------
let STAFF = [];
const qForm = $("#qf");

function initQcheck(pubs) {
  const by = new Map();
  // one row per lecturer; columns j2020, p2020, ... = journal / proceeding counts per CE year
  const ys = Object.keys(pubs[0] || {}).filter((k) => /^j\d{4}$/.test(k)).map((k) => +k.slice(1)).sort();
  for (const p of pubs) {
    const years = Object.fromEntries(ys.map((y) => [y, { j: +p[`j${y}`] || 0, p: +p[`p${y}`] || 0 }]));
    by.set(p.name, { name: p.name, progs: progList(p.programme), note: p.note, years });
  }
  STAFF = [...by.values()];
  // a 5-year window ending at CE year y needs y-4..y in the data
  const ays = ys.filter((y) => ys.includes(y - 4)).map((y) => y + 543).reverse();
  qForm.ay.innerHTML = ays.map((a) => `<option value="${a}">${a} (${a - 543})</option>`).join("");
  if (ays.includes(2567)) qForm.ay.value = "2567"; // latest complete year in the Q-Check file
  qForm.prog.insertAdjacentHTML("beforeend", PROGS.map((p) => `<option value="${p.id}">${p.th}</option>`).join(""));
  qForm.addEventListener("input", renderQcheck);
}

function evaluate(s, endCE) {
  let j = 0, p = 0;
  for (let y = endCE - 4; y <= endCE; y++) { j += s.years[y]?.j || 0; p += s.years[y]?.p || 0; }
  const total = j + p, counted = !s.note;
  return { ...s, j, p, total, bach: counted && total >= 1, mast: counted && total >= 3 };
}

function renderQcheck() {
  const f = Object.fromEntries(new FormData(qForm));
  const endCE = +f.ay - 543, q = (f.q || "").trim().toLowerCase();
  $("#qwin").textContent = `รอบ 5 ปี: พ.ศ. ${f.ay - 4}-${f.ay} (ค.ศ. ${endCE - 4}-${endCE})`;
  const all = STAFF.map((s) => evaluate(s, endCE));
  const rows = all.filter((s) => (!f.prog || s.progs.some((p) => p.id === f.prog))
    && (!f.st || (f.st === "pass" ? s.bach : !s.bach)) && (!q || s.name.toLowerCase().includes(q)));
  const pass = rows.filter((s) => s.bach).length;
  const mem = rows.filter((s) => s.progs.some((p) => p.id === "MsComp"));
  $("#qkpi").innerHTML = [
    ["อาจารย์ที่แสดง", nf.format(rows.length), "คน"],
    ["ผ่านเกณฑ์ ป.ตรี", nf.format(pass), rows.length ? `${Math.round((pass / rows.length) * 100)}% ของที่แสดง` : "-"],
    ["ไม่ผ่านเกณฑ์ ป.ตรี", nf.format(rows.length - pass), "ต้องติดตามผลงาน"],
    ["อาจารย์ MsComp ผ่านเกณฑ์ ป.โท", `${mem.filter((s) => s.mast).length}/${mem.length}`, "ผลงาน ≥ 3 ชิ้น"],
  ].map(([l, v, s]) => `<div class="kpi"><p>${l}</p><strong>${v}</strong><small>${s}</small></div>`).join("");

  // pass rate per programme: bachelor rule for Comp/DBiz/DE, master rule for MsComp
  const rate = PROGS.map((P) => {
    const m = all.filter((s) => s.progs.some((p) => p.id === P.id));
    const ok = m.filter((s) => (P.id === "MsComp" ? s.mast : s.bach)).length;
    return { P, ok, n: m.length, pct: m.length ? Math.round((ok / m.length) * 100) : 0 };
  });
  draw("c-pass", {
    type: "bar",
    data: { labels: rate.map((r) => r.P.id), datasets: [bar("อัตราผ่าน (%)", rate.map((r) => r.pct), "--s1")] },
    options: baseOpts({
      plugins: { ...baseOpts().plugins, legend: { display: false },
        tooltip: { ...baseOpts().plugins.tooltip, callbacks: { label: (c) => ` ผ่าน ${rate[c.dataIndex].ok}/${rate[c.dataIndex].n} คน (${c.raw}%) · เกณฑ์ ${rate[c.dataIndex].P.id === "MsComp" ? "ป.โท ≥3" : "ป.ตรี ≥1"}` } } },
      scales: { ...baseOpts().scales, y: { ...baseOpts().scales.y, max: 100, ticks: { ...baseOpts().scales.y.ticks, callback: (v) => v + "%" } } },
    }),
  });

  const yrs = []; for (let y = endCE - 4; y <= endCE; y++) yrs.push(y);
  draw("c-pub", {
    type: "bar",
    data: {
      labels: yrs.map((y) => `${y + 543}`),
      datasets: [
        bar("Journal", yrs.map((y) => rows.reduce((t, s) => t + (s.years[y]?.j || 0), 0)), "--s1", "s"),
        bar("Proceeding", yrs.map((y) => rows.reduce((t, s) => t + (s.years[y]?.p || 0), 0)), "--s2", "s"),
      ],
    },
    options: baseOpts({ scales: { ...baseOpts().scales, x: { ...baseOpts().scales.x, stacked: true }, y: { ...baseOpts().scales.y, stacked: true } } }),
  });

  const st = (ok) => ok ? `<span class="status ok">✓ ผ่าน</span>` : `<span class="status no">✕ ไม่ผ่าน</span>`;
  const tb = $("#qtable tbody");
  tb.innerHTML = rows.length ? rows.map((s, i) => `<tr>
    <td class="num">${i + 1}</td>
    <td>${esc(s.name)}${s.note ? `<span class="note">${esc(s.note)}</span>` : ""}</td>
    <td>${s.progs.map((p) => `${esc(p.id)}${p.lead ? '<span class="star">*</span>' : ""}`).join(", ")}</td>
    <td class="num">${s.j}</td><td class="num">${s.p}</td><td class="num"><strong>${s.total}</strong></td>
    <td>${st(s.bach)}</td><td>${st(s.mast)}</td></tr>`).join("")
    : `<tr><td colspan="8" class="empty">ไม่พบอาจารย์ตามตัวกรอง</td></tr>`;
}

// ---------- shell ----------
function setTab(name) {
  for (const t of ["awards", "qcheck"]) {
    $(`#tab-${t}`).setAttribute("aria-selected", t === name);
    $(`#panel-${t}`).hidden = t !== name;
  }
  try { history.replaceState(null, "", `#${name}`); } catch (e) {}
  rerender();
}
function rerender() {
  if (!$("#panel-awards").hidden && AWARDS.length) renderAwards();
  if (!$("#panel-qcheck").hidden && STAFF.length) renderQcheck();
}
$(".tabs").addEventListener("click", (e) => { const b = e.target.closest("[role=tab]"); if (b) setTab(b.id.slice(4)); });
$(".tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const next = $("#tab-awards").getAttribute("aria-selected") === "true" ? "qcheck" : "awards";
  setTab(next); $(`#tab-${next}`).focus();
});
$("#theme").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", document.documentElement.dataset.theme); } catch (e) {}
  rerender();
});
try { const t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}

(async () => {
  try {
    const [a, p] = await Promise.all([load("awards"), load("publications")]);
    AWARDS = a.rows.filter((r) => r.award_date).map((r) => ({ ...r, ay: academicYear(r.award_date), progs: progList(r.programme).map((x) => x.id) }));
    const src = $("#source");
    src.textContent = a.live ? "Google Sheets · สด" : "สำเนา CSV ในเว็บ";
    src.classList.toggle("live", a.live);
    initAwards(); initQcheck(p.rows);
    setTab(location.hash === "#qcheck" ? "qcheck" : "awards");
  } catch (e) {
    $("#source").textContent = "โหลดข้อมูลไม่สำเร็จ";
    console.error(e);
  }
})();
