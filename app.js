// CoC QA Dashboard, Topic 3. Data comes from Google Sheets (first tab of each sheet);
// falls back to the CSV copies in data/ when the sheet is unreachable.
const CONFIG = {
  // Google Sheet IDs. Sheets must be shared "Anyone with the link: Viewer".
  sheets: {
    awards: "1IC4gZUdoIGm3a0hqfotbkXTGnTJfYWGASt15Fbz0vYk",
    publications: "1TnKNMEPJpkfyJ2_4JWRFIy15F_f_wJ6e5F9me_EKWHE",
  },
};

// ---------- text (Thai default, English optional) ----------
const I18N = {
  th: {
    skip: "ข้ามไปเนื้อหา", brand: "CoC QA Dashboard", tabsLabel: "หน้าแดชบอร์ด", tabAwards: "ผลงานและรางวัล", tabQ: "คุณสมบัติอาจารย์",
    langLabel: "ภาษา", themeDark: "เปลี่ยนเป็นโหมดมืด", themeLight: "เปลี่ยนเป็นโหมดสว่าง", close: "ปิด", back: "← กลับ",
    aTitle: "ผลงาน การแข่งขัน และนวัตกรรม ของนักศึกษาและอาจารย์ CoC",
    aLede: "รวมรางวัลที่นักศึกษาและอาจารย์วิทยาลัยการคอมพิวเตอร์ได้รับ แยกตามปีการศึกษา หลักสูตร และระดับการแข่งขัน กดที่ผลงานหรือชื่อคนเพื่อดูรายละเอียด",
    hlTitle: "ผลงานเด่นล่าสุด", hlSub: "ผลงานระดับนานาชาติล่าสุดในช่วงที่เลือก กดการ์ดเพื่อดูรายละเอียด",
    filters: "ตัวกรอง", fYear: "ปีการศึกษา", fProg: "หลักสูตร", fRole: "ผู้ได้รับรางวัล", fLevel: "ระดับ", fCat: "ประเภท",
    fAy: "ปีการศึกษา (รอบ 5 ปี)", fStatus: "สถานะ ป.ตรี", search: "ค้นหา", searchPh: "ชื่อ ผลงาน หรือรางวัล", qSearchPh: "ชื่ออาจารย์",
    clear: "ล้างตัวกรองทั้งหมด", groupBy: "แยกกราฟตาม", gProg: "หลักสูตร", gRole: "นักศึกษา / อาจารย์", gLevel: "ระดับ",
    progSub: "นักศึกษาเทียบอาจารย์ ในช่วงที่เลือก", catSub: "การแข่งขัน นวัตกรรม รางวัลวิจัย และอื่น ๆ",
    listTitle: "รายการผลงาน", viewLabel: "มุมมอง", vList: "รายการ", vTimeline: "ไทม์ไลน์",
    qTitle: "ตรวจคุณสมบัติอาจารย์ประจำหลักสูตร",
    qLede: "ป.ตรี ต้องมีผลงานวิชาการอย่างน้อย 1 ชิ้น และ ป.โท อย่างน้อย 3 ชิ้น ในรอบ 5 ปี เลือกปีการศึกษา ระบบนับย้อนหลังให้เอง",
    passSub: "Comp, DBiz, DE ใช้เกณฑ์ ป.ตรี · MsComp ใช้เกณฑ์ ป.โท", pubSub: "Journal และ Proceeding ของอาจารย์ที่เลือก",
    qListTitle: "ผลการตรวจสอบรายบุคคล", qListSub: "กดชื่อเพื่อดูผลงานรายปีและรางวัล · J = Journal · P = Proceeding · * ผู้รับผิดชอบหลักสูตร",
    thNo: "ลำดับ", thName: "ชื่อ-สกุล", thProg: "อาจารย์ประจำหลักสูตร", thTotal: "รวม", thBach: "ป.ตรี (≥1)", thMast: "ป.โท (≥3)",
    foot1: "ข้อมูลอ่านสดจาก Google Sheets · ผลงานวิชาการจากไฟล์ Q-Check 2025 (อัปเดต 29 เม.ย. 2568) · ข้อมูลรางวัลรวบรวมจากข่าวเว็บวิทยาลัยการคอมพิวเตอร์และหน่วยงานผู้จัด ทุกผลงานมีลิงก์ข่าวต้นฉบับ · รายการที่ทราบเฉพาะปีนับเป็นเดือนมกราคม",
    foot2: "HCD-101 Visualization · วิทยาลัยการคอมพิวเตอร์ ม.อ. ภูเก็ต",
    live: "Google Sheets · สด", csv: "สำเนา CSV ในเว็บ", loading: "กำลังโหลด", loadFail: "โหลดข้อมูลไม่สำเร็จ",
    loadFailMsg: "ตรวจการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่", reload: "โหลดใหม่",
    ay: (y) => `ปีการศึกษา ${y}`, yearOnly: (y) => `ปี ${y}`, eyebrowA: (a, b) => `HCD-101 · หัวข้อที่ 3 · ปีการศึกษา ${a}-${b}`,
    eyebrowQ: (y, a, b) => `HCD-101 · หัวข้อที่ 3 · ปีการศึกษา ${y} · รอบ 5 ปี ${a}-${b}`,
    heroA: "ผลงานในช่วงที่เลือก", heroAPeak: (y, n) => `ปีที่มากที่สุดคือ ${y} (${n} ผลงาน)`,
    kStu: "นักศึกษาที่ได้รับรางวัล", kFac: "อาจารย์ที่ได้รับรางวัล", kIntl: "ผลงานระดับนานาชาติ", kTop: (p) => `หลักสูตรที่มีผลงานมากสุด: ${p}`,
    people: "คน", ofAll: (p) => `${p}% ของผลงานทั้งหมด`, nationalN: (n) => `ระดับชาติ ${n} ผลงาน`, relatedWorks: "ผลงานที่เกี่ยวข้องกับหลักสูตร",
    insYear: (y, n) => `${y} มีผลงานมากที่สุด ${n} ผลงาน`, insNone: "ไม่มีผลงานในช่วงที่เลือก",
    yearSub: "นับตามวันที่ได้รับรางวัล · ปีการศึกษาเริ่ม ส.ค. สิ้นสุด ก.ค.",
    yearSubProg: " · ผลงานที่มีคนจากหลายหลักสูตรนับในทุกหลักสูตร แท่งจึงสูงกว่าจำนวนผลงานได้",
    insProg: (p, n) => `${p} มีผลงานมากที่สุด ${n} ผลงาน`, insCat: (c, n) => `${c} เป็นประเภทที่พบมากที่สุด ${n} ผลงาน`,
    result: (n, all) => `แสดง ${n} จาก ${all} ผลงาน`, qResult: (n, all) => `แสดงอาจารย์ ${n} จาก ${all} คน`,
    listCount: (n) => `${n} ผลงาน · เรียงจากล่าสุด · กดเพื่อดูรายละเอียด`, showMore: (n) => `แสดงเพิ่ม (${n})`, emptyA: "ไม่พบผลงานตามตัวกรอง ลองล้างตัวกรอง",
    worksN: (n) => `${n} ผลงาน`, andMore: (n) => `และอีก ${n} คน`,
    student: "นักศึกษา", faculty: "อาจารย์", National: "ระดับชาติ", International: "นานาชาติ", all: "ทั้งหมด",
    cat: { Competition: "การแข่งขัน", "Research Award": "รางวัลวิจัย", Innovation: "นวัตกรรม", Hackathon: "แฮกกาธอน", Startup: "สตาร์ทอัพ", Other: "รางวัลอื่น ๆ" },
    pass: "ผ่าน", fail: "ไม่ผ่าน", passBach: "ผ่าน ป.ตรี", failBach: "ไม่ผ่าน ป.ตรี",
    heroQ: (y) => `ผ่านเกณฑ์ ป.ตรี ปีการศึกษา ${y}`, heroQSub: (ok, n) => `อาจารย์ ${ok} จาก ${n} คน มีผลงานอย่างน้อย 1 ชิ้นในรอบ 5 ปี`,
    kShown: "อาจารย์ที่แสดง", kShownSub: (n) => `ผ่านเกณฑ์ ป.ตรี ${n} คน`, kPubs: "ผลงานวิชาการรวม 5 ปี", kFail: "ไม่ผ่านเกณฑ์ ป.ตรี", kFailSub: "ต้องติดตามผลงาน",
    kMs: "อาจารย์ MsComp ผ่านเกณฑ์ ป.โท", kMsSub: "ผลงาน ≥ 3 ชิ้น",
    insPassAll: "ทุกหลักสูตรผ่านเกณฑ์ครบ 100%", insPassLow: (p, ok, n, pct) => `${p} ผ่านเกณฑ์ต่ำสุด ${ok}/${n} คน (${pct}%)`,
    insPub: (y, n) => `ปี ${y} มีผลงานวิชาการมากที่สุด ${n} ชิ้น`, insPubNone: "ไม่มีผลงานวิชาการในรอบที่เลือก", emptyQ: "ไม่พบอาจารย์ตามตัวกรอง",
    passRate: "อัตราผ่าน (%)", ruleB: "เกณฑ์ ป.ตรี ≥1", ruleM: "เกณฑ์ ป.โท ≥3", passOf: (ok, n, p) => `ผ่าน ${ok}/${n} คน (${p}%)`,
    dAward: "รางวัล", dDate: "วันที่", dAy: "ปีการศึกษา", dCat: "ประเภท", dLevel: "ระดับ", dProg: "หลักสูตร", dPeople: "ผู้ได้รับรางวัล",
    readSource: "อ่านข่าวต้นฉบับ ↗", related: "ผลงานเดียวกันได้รางวัลในงานอื่นด้วย", noSource: "ไม่มีลิงก์ข่าว", yearOnlyNote: "ทราบเฉพาะปี",
    pRole: "บทบาท", pAwards: "ผลงานและรางวัล", pNoAwards: "ยังไม่มีผลงานในชุดข้อมูลรางวัล", pQ: "คุณสมบัติอาจารย์ประจำหลักสูตร",
    pQWin: (y, a, b) => `ปีการศึกษา ${y} (รอบ ${a}-${b})`, pPubs: "ผลงานวิชาการรายปี", noteStudy: "ผลงานช่วงลาศึกษาต่อ ไม่นับ",
    progNames: { Comp: "Computing (Comp)", DBiz: "Digital Business (DBiz)", DE: "Digital Engineering (DE)", MsComp: "ป.โท Computing (MsComp)" },
    unknownProg: "ไม่ระบุหลักสูตร",
  },
  en: {
    skip: "Skip to content", brand: "CoC QA Dashboard", tabsLabel: "Dashboard pages", tabAwards: "Awards", tabQ: "Lecturer check",
    langLabel: "Language", themeDark: "Switch to dark mode", themeLight: "Switch to light mode", close: "Close", back: "← Back",
    aTitle: "Awards, competitions and innovations by CoC students and lecturers",
    aLede: "Awards won by College of Computing students and lecturers, by academic year, programme and level. Select a work or a name for details.",
    hlTitle: "Latest highlights", hlSub: "Most recent international awards in the selected range. Select a card for details.",
    filters: "Filters", fYear: "Academic year", fProg: "Programme", fRole: "Winner", fLevel: "Level", fCat: "Type",
    fAy: "Academic year (5-year window)", fStatus: "Bachelor rule", search: "Search", searchPh: "Name, work or award", qSearchPh: "Lecturer name",
    clear: "Clear all filters", groupBy: "Split chart by", gProg: "Programme", gRole: "Student / lecturer", gLevel: "Level",
    progSub: "Students compared with lecturers in the selected range", catSub: "Competitions, innovations, research awards and others",
    listTitle: "All works", viewLabel: "View", vList: "List", vTimeline: "Timeline",
    qTitle: "Programme lecturer qualification check",
    qLede: "Bachelor programmes need at least 1 academic work and the master programme at least 3 in the last 5 years. Pick an academic year and the window is counted for you.",
    passSub: "Comp, DBiz, DE use the bachelor rule · MsComp uses the master rule", pubSub: "Journal and proceeding papers of the selected lecturers",
    qListTitle: "Result per lecturer", qListSub: "Select a name for yearly output and awards · J = Journal · P = Proceeding · * programme chair",
    thNo: "No.", thName: "Name", thProg: "Programme", thTotal: "Total", thBach: "Bachelor (≥1)", thMast: "Master (≥3)",
    foot1: "Data is read live from Google Sheets · Academic output from the Q-Check 2025 file (updated 29 Apr 2025) · Awards collected from College of Computing news and organisers' sites; every work links its source · Items known only by year are counted as January. Award names are shown as published.",
    foot2: "HCD-101 Visualization · College of Computing, PSU Phuket",
    live: "Google Sheets · live", csv: "Local CSV copy", loading: "Loading", loadFail: "Could not load data",
    loadFailMsg: "Check your internet connection and try again.", reload: "Reload",
    ay: (y) => `AY ${y}`, yearOnly: (y) => `${y}`, eyebrowA: (a, b) => `HCD-101 · Topic 3 · AY ${a}-${b}`,
    eyebrowQ: (y, a, b) => `HCD-101 · Topic 3 · AY ${y} · window ${a}-${b}`,
    heroA: "Works in the selected range", heroAPeak: (y, n) => `Peak year is ${y} (${n} works)`,
    kStu: "Students with awards", kFac: "Lecturers with awards", kIntl: "International works", kTop: (p) => `Most works: ${p}`,
    people: "people", ofAll: (p) => `${p}% of all works`, nationalN: (n) => `${n} national works`, relatedWorks: "Works linked to the programme",
    insYear: (y, n) => `${y} had the most works: ${n}`, insNone: "No works in the selected range",
    yearSub: "Counted by award date · the academic year runs August to July",
    yearSubProg: " · a work with people from several programmes counts once in each, so bars can exceed the work count",
    insProg: (p, n) => `${p} has the most works: ${n}`, insCat: (c, n) => `${c} is the most common type: ${n} works`,
    result: (n, all) => `Showing ${n} of ${all} works`, qResult: (n, all) => `Showing ${n} of ${all} lecturers`,
    listCount: (n) => `${n} works · newest first · select one for details`, showMore: (n) => `Show more (${n})`, emptyA: "No works match these filters. Try clearing them.",
    worksN: (n) => `${n} works`, andMore: (n) => `and ${n} more`,
    student: "Student", faculty: "Lecturer", National: "National", International: "International", all: "All",
    cat: { Competition: "Competition", "Research Award": "Research award", Innovation: "Innovation", Hackathon: "Hackathon", Startup: "Startup", Other: "Other award" },
    pass: "Pass", fail: "Fail", passBach: "Meets bachelor rule", failBach: "Below bachelor rule",
    heroQ: (y) => `Meet the bachelor rule, AY ${y}`, heroQSub: (ok, n) => `${ok} of ${n} lecturers have at least 1 work in 5 years`,
    kShown: "Lecturers shown", kShownSub: (n) => `${n} meet the bachelor rule`, kPubs: "Academic works, 5 years", kFail: "Below bachelor rule", kFailSub: "Need follow-up",
    kMs: "MsComp lecturers meeting master rule", kMsSub: "3 or more works",
    insPassAll: "Every programme meets the rule at 100%", insPassLow: (p, ok, n, pct) => `${p} has the lowest pass rate: ${ok}/${n} (${pct}%)`,
    insPub: (y, n) => `${y} had the most academic works: ${n}`, insPubNone: "No academic works in this window", emptyQ: "No lecturers match these filters",
    passRate: "Pass rate (%)", ruleB: "bachelor rule ≥1", ruleM: "master rule ≥3", passOf: (ok, n, p) => `${ok}/${n} pass (${p}%)`,
    dAward: "Award", dDate: "Date", dAy: "Academic year", dCat: "Type", dLevel: "Level", dProg: "Programme", dPeople: "Winners",
    readSource: "Read the source news ↗", related: "The same work also won at other events", noSource: "No source link", yearOnlyNote: "year only",
    pRole: "Role", pAwards: "Works and awards", pNoAwards: "No works in the awards data yet", pQ: "Programme lecturer check",
    pQWin: (y, a, b) => `AY ${y} (window ${a}-${b})`, pPubs: "Academic works per year", noteStudy: "Work during study leave is not counted",
    progNames: { Comp: "Computing (Comp)", DBiz: "Digital Business (DBiz)", DE: "Digital Engineering (DE)", MsComp: "MSc Computing (MsComp)" },
    unknownProg: "Programme not stated",
  },
};
let lang = "th";
const t = (k, ...a) => { const v = I18N[lang][k] ?? I18N.th[k]; return typeof v === "function" ? v(...a) : v; };
const yl = (be) => (lang === "th" ? be : be - 543); // show B.E. in Thai, C.E. in English
const catName = (c) => t("cat")[c] || c;
const progName = (p) => t("progNames")[p] || p;

const PROGS = [{ id: "Comp", v: "--s1" }, { id: "DBiz", v: "--s2" }, { id: "DE", v: "--s3" }, { id: "MsComp", v: "--s4" }];
const $ = (s, r = document) => r.querySelector(s);
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");
const nf = () => new Intl.NumberFormat(lang === "th" ? "th-TH" : "en-GB");
const fmt = (n) => nf().format(n);
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`, { cache: "no-store" });
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
const progList = (s) => (s || "").split(",").map((p) => p.trim()).filter(Boolean).map((p) => ({ id: p.replace("*", ""), lead: p.includes("*") }));
function dateText(e) {
  if (e.date_note) return t("yearOnly", yl(+e.award_date.slice(0, 4) + 543));
  const d = new Date(e.award_date + "T00:00:00");
  return isNaN(d) ? e.award_date : d.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// One entry per work: rows with the same work on the same date are one team,
// even when its members got different awards at that event.
let ENTRIES = [], PEOPLE = new Map(), STAFF = [];
function buildEntries(rows) {
  const map = new Map();
  for (const r of rows.filter((x) => x.award_date)) {
    const key = [r.work_title || r.award, r.award_date].join("|");
    if (!map.has(key)) {
      map.set(key, { id: "w" + map.size, title: r.work_title || r.award, award_date: r.award_date, date_note: r.date_note,
        ay: academicYear(r.award_date), category: r.category, level: r.level, image_url: r.image_url, awards: [], sources: [], people: [] });
    }
    const e = map.get(key);
    if (r.level === "International") e.level = r.level;
    if (!e.awards.includes(r.award)) e.awards.push(r.award);
    const src = safeUrl(r.source_url);
    if (src && !e.sources.includes(src)) e.sources.push(src);
    if (!e.people.some((p) => p.name === r.name)) e.people.push({ name: r.name, role: r.role, progs: progList(r.programme), award: r.award });
  }
  ENTRIES = [...map.values()].map((e) => ({
    ...e,
    award: e.awards.join(" · "),
    progs: [...new Set(e.people.flatMap((p) => p.progs.map((x) => x.id)))],
    roles: [...new Set(e.people.map((p) => p.role))],
  })).sort((a, b) => b.award_date.localeCompare(a.award_date));
  // same work, other events (e.g. a project that won again the next year)
  for (const e of ENTRIES) e.related = ENTRIES.filter((x) => x !== e && x.title === e.title);
  PEOPLE = new Map();
  for (const e of ENTRIES) for (const p of e.people) {
    if (!PEOPLE.has(p.name)) PEOPLE.set(p.name, { name: p.name, role: p.role, progs: p.progs, entries: [] });
    PEOPLE.get(p.name).entries.push(e);
  }
}

// ---------- charts ----------
const charts = {};
Chart.register({
  // value above each bar (or the stack total) so readers need not trace the axis
  id: "valueLabels",
  afterDatasetsDraw(chart, _a, opts) {
    if (!opts || !opts.mode) return;
    const { ctx } = chart, horizontal = chart.options.indexAxis === "y";
    ctx.save();
    ctx.fillStyle = css("--ink"); ctx.font = "600 12px 'IBM Plex Sans Thai', sans-serif";
    ctx.textAlign = horizontal ? "left" : "center"; ctx.textBaseline = horizontal ? "middle" : "bottom";
    const vis = chart.data.datasets.map((_, i) => i).filter((i) => chart.isDatasetVisible(i));
    chart.data.labels.forEach((_, j) => {
      if (opts.mode === "total") {
        const total = vis.reduce((s, i) => s + (chart.data.datasets[i].data[j] || 0), 0);
        const top = chart.getDatasetMeta(vis.at(-1))?.data[j];
        if (total && top) ctx.fillText(fmt(total) + (opts.suffix || ""), top.x, top.y - 4);
      } else vis.forEach((i) => {
        const v = chart.data.datasets[i].data[j], el = chart.getDatasetMeta(i).data[j];
        if (v && el) horizontal ? ctx.fillText(fmt(v) + (opts.suffix || ""), el.x + 6, el.y) : ctx.fillText(fmt(v) + (opts.suffix || ""), el.x, el.y - 4);
      });
    });
    ctx.restore();
  },
});
function baseOpts(extra = {}) {
  const ink = css("--ink-2"), F = { family: "IBM Plex Sans Thai", size: 13 };
  const o = {
    responsive: true, maintainAspectRatio: false, animation: calm ? false : { duration: 700, easing: "easeOutQuart" },
    layout: { padding: { top: 20, right: 28 } }, interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top", align: "start", labels: { color: ink, boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2, font: F } },
      tooltip: { backgroundColor: css("--ink"), titleColor: css("--bg"), bodyColor: css("--bg"), padding: 10, cornerRadius: 8, boxPadding: 4, titleFont: F, bodyFont: F },
    },
    scales: {
      x: { grid: { display: false }, border: { color: css("--line-2") }, ticks: { color: ink, font: F } },
      y: { beginAtZero: true, grid: { color: css("--line") }, border: { display: false }, ticks: { color: ink, precision: 0, font: F } },
    },
  };
  for (const [k, v] of Object.entries(extra)) o[k] = typeof v === "object" && !Array.isArray(v) ? { ...o[k], ...v } : v;
  return o;
}
const stackScales = () => { const s = baseOpts().scales; return { x: { ...s.x, stacked: true }, y: { ...s.y, stacked: true } }; };
function draw(id, config) {
  charts[id]?.destroy();
  charts[id] = new Chart(document.getElementById(id), config);
}
const bar = (label, data, colorVar, stack) => ({
  label, data, backgroundColor: css(colorVar), borderColor: css("--surface"), borderWidth: 2,
  borderRadius: 4, borderSkipped: false, stack, maxBarThickness: 48,
});

function countUp(root) {
  if (calm) return;
  root.querySelectorAll("strong[data-n]").forEach((el) => {
    const end = +el.dataset.n, suffix = el.dataset.suffix || "", t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 700);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3)))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
const kpi = (label, n, sub, suffix = "") => `<div class="kpi"><p>${label}</p><strong data-n="${n}" data-suffix="${suffix}">${fmt(n)}${suffix}</strong><small>${sub}</small></div>`;

// ---------- chips ----------
function renderChips(box, options, selected, single) {
  box.innerHTML = options.map((o) => `<button type="button" class="chip" data-v="${esc(o.v)}" aria-pressed="${selected.has(o.v)}">${esc(o.label)}</button>`).join("");
  box.onclick = (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    const v = b.dataset.v;
    if (single) { selected.clear(); selected.add(v); } else selected.has(v) ? selected.delete(v) : selected.add(v);
    box.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", selected.has(c.dataset.v)));
    box.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  };
}

// ---------- awards page ----------
const A = { years: new Set(), progs: new Set(), roles: new Set(), levels: new Set(), cats: new Set(), q: "", view: "list", groupBy: "programme", more: false };
const AY_ALL = () => [...new Set(ENTRIES.map((e) => e.ay))].sort();
const hit = (set, vals) => !set.size || vals.some((v) => set.has(v));

function filteredEntries() {
  const q = A.q.trim().toLowerCase();
  return ENTRIES.filter((e) => hit(A.years, [String(e.ay)]) && hit(A.progs, e.progs) && hit(A.roles, e.roles)
    && hit(A.levels, [e.level]) && hit(A.cats, [e.category])
    && (!q || [e.title, e.award, ...e.people.map((p) => p.name)].join(" ").toLowerCase().includes(q)));
}

function renderAwardChips() {
  const box = (k) => $(`#af .chips[data-key="${k}"]`);
  renderChips(box("years"), AY_ALL().map((y) => ({ v: String(y), label: String(yl(y)) })), A.years);
  renderChips(box("progs"), PROGS.map((p) => ({ v: p.id, label: p.id })), A.progs);
  renderChips(box("roles"), ["student", "faculty"].map((r) => ({ v: r, label: t(r) })), A.roles);
  renderChips(box("levels"), ["National", "International"].map((l) => ({ v: l, label: t(l) })), A.levels);
  const cats = Object.keys(I18N.th.cat).filter((c) => ENTRIES.some((e) => e.category === c));
  renderChips(box("cats"), cats.map((c) => ({ v: c, label: catName(c) })), A.cats);
}

function renderAwards() {
  const rows = filteredEntries();
  const ays = AY_ALL(), years = A.years.size ? ays.filter((y) => A.years.has(String(y))) : ays;
  const lo = years[0], hi = years.at(-1);
  const active = A.years.size + A.progs.size + A.roles.size + A.levels.size + A.cats.size + (A.q.trim() ? 1 : 0);
  $("#af-count").textContent = active ? fmt(active) : "";
  $("#a-clear").hidden = !active;
  $("#a-result").textContent = t("result", fmt(rows.length), fmt(ENTRIES.length));
  $("#a-eyebrow").textContent = t("eyebrowA", yl(lo), yl(hi));

  const perYear = years.map((y) => [y, rows.filter((r) => r.ay === y).length]);
  const peak = perYear.reduce((m, x) => (x[1] > m[1] ? x : m), [lo, -1]);
  renderAwardHero(perYear, peak, rows.length);

  const people = (role) => new Set(rows.flatMap((e) => e.people.filter((p) => p.role === role).map((p) => p.name))).size;
  const intl = rows.filter((r) => r.level === "International").length;
  const byProg = PROGS.map((p) => [p.id, rows.filter((r) => r.progs.includes(p.id)).length]).sort((a, b) => b[1] - a[1]);
  $("#akpi").innerHTML = kpi(t("kStu"), people("student"), t("people")) + kpi(t("kFac"), people("faculty"), t("people"))
    + kpi(t("kIntl"), intl, t("nationalN", fmt(rows.length - intl))) + kpi(t("kTop", byProg[0][0]), byProg[0][1], t("relatedWorks"));
  countUp($("#akpi"));

  renderHighlights(rows);

  // chart 1: per academic year, split by the chosen dimension
  $("#ins-year").textContent = rows.length ? t("insYear", t("ay", yl(peak[0])), fmt(peak[1])) : t("insNone");
  $("#year-sub").textContent = t("yearSub") + (A.groupBy === "programme" ? t("yearSubProg") : "");
  const groups = A.groupBy === "programme"
    ? PROGS.map((p) => ({ label: progName(p.id), v: p.v, test: (r) => r.progs.includes(p.id) }))
    : A.groupBy === "role"
      ? [{ label: t("student"), v: "--s1", test: (r) => r.roles.includes("student") }, { label: t("faculty"), v: "--s2", test: (r) => r.roles.includes("faculty") }]
      : [{ label: t("National"), v: "--s1", test: (r) => r.level === "National" }, { label: t("International"), v: "--s2", test: (r) => r.level === "International" }];
  $("#c-year").setAttribute("aria-label", $("#ins-year").textContent);
  draw("c-year", {
    type: "bar",
    data: { labels: years.map((y) => String(yl(y))), datasets: groups.map((g) => bar(g.label, years.map((y) => rows.filter((r) => r.ay === y && g.test(r)).length), g.v, "s")) },
    options: baseOpts({ plugins: { ...baseOpts().plugins, valueLabels: { mode: "total" } }, scales: stackScales() }),
  });

  // chart 2: programme, student vs lecturer
  $("#ins-prog").textContent = rows.length ? t("insProg", byProg[0][0], fmt(byProg[0][1])) : t("insNone");
  $("#c-prog").setAttribute("aria-label", $("#ins-prog").textContent);
  draw("c-prog", {
    type: "bar",
    data: {
      labels: PROGS.map((p) => p.id),
      datasets: [
        bar(t("student"), PROGS.map((p) => rows.filter((r) => r.roles.includes("student") && r.progs.includes(p.id)).length), "--s1"),
        bar(t("faculty"), PROGS.map((p) => rows.filter((r) => r.roles.includes("faculty") && r.progs.includes(p.id)).length), "--s2"),
      ],
    },
    options: baseOpts({ plugins: { ...baseOpts().plugins, valueLabels: { mode: "each" } } }),
  });

  // chart 3: type, single series sorted
  const cats = Object.entries(rows.reduce((m, r) => ((m[r.category] = (m[r.category] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  $("#ins-cat").textContent = cats.length ? t("insCat", catName(cats[0][0]), fmt(cats[0][1])) : t("insNone");
  $("#c-cat").setAttribute("aria-label", $("#ins-cat").textContent);
  const s = baseOpts().scales;
  draw("c-cat", {
    type: "bar",
    data: { labels: cats.map((c) => catName(c[0])), datasets: [bar(t("vList"), cats.map((c) => c[1]), "--s1")] },
    options: baseOpts({ indexAxis: "y", plugins: { ...baseOpts().plugins, legend: { display: false }, valueLabels: { mode: "each" } },
      scales: { x: { ...s.y, grid: { color: css("--line") } }, y: { ...s.x } } }),
  });

  renderWorks(rows);
}

function renderAwardHero(perYear, peak, total) {
  const w = 300, h = 64, gap = 6, bw = (w - gap * (perYear.length - 1)) / Math.max(perYear.length, 1);
  const max = Math.max(1, ...perYear.map((p) => p[1]));
  const bars = perYear.map(([y, n], i) => {
    const bh = Math.max(2, (n / max) * h);
    return `<rect class="${y === peak[0] && n ? "hi" : ""}" x="${i * (bw + gap)}" y="${h - bh}" width="${bw}" height="${bh}" rx="2"><title>${t("ay", yl(y))}: ${n}</title></rect>`;
  }).join("");
  $("#a-hero").innerHTML = `<p class="sub">${t("heroA")}</p><strong data-n="${total}">${fmt(total)}</strong>
    <p class="sub">${peak[1] > 0 ? t("heroAPeak", yl(peak[0]), fmt(peak[1])) : t("insNone")}</p>
    <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(t("insNone") && t("heroA"))}">${bars}</svg>
    <div class="spark-x" style="grid-template-columns: repeat(${perYear.length}, 1fr)" aria-hidden="true">${perYear.map(([y]) => `<span>${String(yl(y)).slice(2)}</span>`).join("")}</div>`;
  countUp($("#a-hero"));
}

const peopleLine = (e, max = 3) => {
  const names = e.people.map((p) => p.name);
  return esc(names.slice(0, max).join(", ")) + (names.length > max ? ` ${t("andMore", names.length - max)}` : "");
};
const levelTag = (e) => `<span class="tag${e.level === "International" ? " intl" : ""}">${esc(t(e.level) || e.level)}</span>`;

function renderHighlights(rows) {
  const intl = rows.filter((e) => e.level === "International");
  const picks = [...intl, ...rows.filter((e) => e.level !== "International")].slice(0, 4);
  $("#highlights").innerHTML = picks.length ? picks.map((e) => `<button type="button" class="hl" data-entry="${e.id}">
      ${levelTag(e)}
      <span class="hl-title">${esc(e.title)}</span>
      <span class="hl-award">${esc(e.award)}</span>
      <span class="hl-meta">${esc(dateText(e))} · ${peopleLine(e, 2)}</span>
    </button>`).join("") : `<p class="empty">${t("emptyA")}</p>`;
}

function workButton(e, withDate = true) {
  const dots = e.progs.map((p) => { const P = PROGS.find((x) => x.id === p); return `<span class="tag"><span class="dot" style="background:var(${P ? P.v : "--line-2"})"></span>${esc(p)}</span>`; }).join("");
  return `<button type="button" class="work" data-entry="${e.id}">
    ${withDate ? `<span class="work-date">${esc(dateText(e))}</span>` : ""}
    <span class="work-main"><span class="work-title">${esc(e.title)}</span><span class="work-award">${esc(e.award)}</span><span class="work-people">${peopleLine(e)}</span></span>
    <span class="work-tags">${levelTag(e)}<span class="tag">${esc(catName(e.category))}</span>${dots}</span>
  </button>`;
}

function renderWorks(rows) {
  $("#acount").textContent = t("listCount", fmt(rows.length));
  const box = $("#alist");
  if (!rows.length) { box.innerHTML = `<p class="empty">${t("emptyA")}</p>`; return; }
  if (A.view === "timeline") {
    const byAy = [...new Set(rows.map((e) => e.ay))].sort((a, b) => b - a);
    box.innerHTML = `<div class="timeline swap">${byAy.map((y) => {
      const list = rows.filter((e) => e.ay === y);
      return `<div class="tl-year"><h3>${esc(t("ay", yl(y)))}<small>${t("worksN", fmt(list.length))}</small></h3>
        <div class="tl-items">${list.map((e) => workButton(e)).join("")}</div></div>`;
    }).join("")}</div>`;
    return;
  }
  const LIMIT = 10, shown = A.more ? rows : rows.slice(0, LIMIT);
  box.innerHTML = `<div class="works swap">${shown.map((e) => workButton(e)).join("")}</div>`
    + (rows.length > LIMIT && !A.more ? `<button type="button" class="btn-text more" id="a-more">${t("showMore", fmt(rows.length - LIMIT))}</button>` : "");
}

function initAwards() {
  renderAwardChips();
  $("#af").addEventListener("change", () => { A.more = false; renderAwards(); });
  let timer;
  $("#aq").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { A.q = e.target.value; A.more = false; renderAwards(); }, 150); });
  $("#a-clear").addEventListener("click", () => {
    ["years", "progs", "roles", "levels", "cats"].forEach((k) => A[k].clear());
    A.q = ""; $("#aq").value = ""; renderAwardChips(); renderAwards();
  });
  const seg = (id, key, attr) => $(id).addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    A[key] = b.dataset[attr];
    $(id).querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", x === b));
    key === "view" ? renderWorks(filteredEntries()) : renderAwards();
  });
  seg("#groupby", "groupBy", "g");
  seg("#view", "view", "v");
  $("#alist").addEventListener("click", (e) => { if (e.target.id === "a-more") { A.more = true; renderWorks(filteredEntries()); } });
}

// ---------- Q-Check page ----------
const Q = { ay: new Set(), progs: new Set(), st: new Set(), q: "" };
let Q_AYS = [], PUB_YEARS = [];

function initQcheck(pubs) {
  PUB_YEARS = Object.keys(pubs[0] || {}).filter((k) => /^j\d{4}$/.test(k)).map((k) => +k.slice(1)).sort();
  STAFF = pubs.map((p) => ({ name: p.name, progs: progList(p.programme), note: p.note,
    years: Object.fromEntries(PUB_YEARS.map((y) => [y, { j: +p[`j${y}`] || 0, p: +p[`p${y}`] || 0 }])) }));
  // a 5-year window ending at C.E. year y needs y-4..y in the data
  Q_AYS = PUB_YEARS.filter((y) => PUB_YEARS.includes(y - 4)).map((y) => y + 543).reverse();
  Q.ay.add(String(Q_AYS.includes(2567) ? 2567 : Q_AYS[0])); // 2567 is the latest complete year in the file
  renderQChips();
  $("#qf").addEventListener("change", renderQcheck);
  let timer;
  $("#qq").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { Q.q = e.target.value; renderQcheck(); }, 150); });
  $("#q-clear").addEventListener("click", () => { Q.progs.clear(); Q.st.clear(); Q.q = ""; $("#qq").value = ""; renderQChips(); renderQcheck(); });
  $("#qtable").addEventListener("click", (e) => { const b = e.target.closest("[data-person]"); if (b) openPerson(b.dataset.person); });
}
function renderQChips() {
  const box = (k) => $(`#qf .chips[data-key="${k}"]`);
  renderChips(box("ay"), Q_AYS.map((a) => ({ v: String(a), label: String(yl(a)) })), Q.ay, true);
  renderChips(box("progs"), PROGS.map((p) => ({ v: p.id, label: p.id })), Q.progs);
  renderChips(box("st"), [{ v: "pass", label: t("passBach") }, { v: "fail", label: t("failBach") }], Q.st);
}
function evaluate(s, endCE) {
  let j = 0, p = 0;
  for (let y = endCE - 4; y <= endCE; y++) { j += s.years[y]?.j || 0; p += s.years[y]?.p || 0; }
  const total = j + p, counted = !s.note;
  return { ...s, j, p, total, bach: counted && total >= 1, mast: counted && total >= 3 };
}
const qAy = () => +[...Q.ay][0];

function renderQcheck() {
  const ay = qAy(), endCE = ay - 543, q = Q.q.trim().toLowerCase();
  $("#q-eyebrow").textContent = t("eyebrowQ", yl(ay), yl(ay - 4), yl(ay));
  const all = STAFF.map((s) => evaluate(s, endCE));
  const rows = all.filter((s) => hit(Q.progs, s.progs.map((p) => p.id))
    && (!Q.st.size || (Q.st.has("pass") && s.bach) || (Q.st.has("fail") && !s.bach)) && (!q || s.name.toLowerCase().includes(q)));
  const active = Q.progs.size + Q.st.size + (q ? 1 : 0);
  $("#qf-count").textContent = active ? fmt(active) : "";
  $("#q-clear").hidden = !active;
  $("#q-result").textContent = t("qResult", fmt(rows.length), fmt(all.length));

  const okAll = all.filter((s) => s.bach).length, pctAll = all.length ? Math.round((okAll / all.length) * 100) : 0;
  $("#q-hero").innerHTML = `<p class="sub">${t("heroQ", yl(ay))}</p><strong data-n="${pctAll}" data-suffix="%">${pctAll}%</strong>
    <p class="sub">${t("heroQSub", fmt(okAll), fmt(all.length))}</p>
    <div class="meter" role="img" aria-label="${pctAll}%"><span style="width:${pctAll}%"></span></div>`;
  countUp($("#q-hero"));

  const pass = rows.filter((s) => s.bach).length, ms = rows.filter((s) => s.progs.some((p) => p.id === "MsComp"));
  $("#qkpi").innerHTML = kpi(t("kShown"), rows.length, t("kShownSub", fmt(pass))) + kpi(t("kPubs"), rows.reduce((n, s) => n + s.total, 0), "Journal + Proceeding")
    + kpi(t("kFail"), rows.length - pass, t("kFailSub"))
    + `<div class="kpi"><p>${t("kMs")}</p><strong>${ms.filter((s) => s.mast).length}/${ms.length}</strong><small>${t("kMsSub")}</small></div>`;
  countUp($("#qkpi"));

  const rate = PROGS.map((P) => {
    const m = all.filter((s) => s.progs.some((p) => p.id === P.id));
    const ok = m.filter((s) => (P.id === "MsComp" ? s.mast : s.bach)).length;
    return { P, ok, n: m.length, pct: m.length ? Math.round((ok / m.length) * 100) : 0 };
  });
  const low = [...rate].sort((a, b) => a.pct - b.pct)[0];
  $("#ins-pass").textContent = low.pct === 100 ? t("insPassAll") : t("insPassLow", low.P.id, low.ok, low.n, low.pct);
  $("#c-pass").setAttribute("aria-label", $("#ins-pass").textContent);
  const s = baseOpts().scales;
  draw("c-pass", {
    type: "bar",
    data: { labels: rate.map((r) => r.P.id), datasets: [bar(t("passRate"), rate.map((r) => r.pct), "--s1")] },
    options: baseOpts({
      plugins: { ...baseOpts().plugins, legend: { display: false }, valueLabels: { mode: "each", suffix: "%" },
        tooltip: { ...baseOpts().plugins.tooltip, callbacks: { label: (c) => ` ${t("passOf", rate[c.dataIndex].ok, rate[c.dataIndex].n, c.raw)} · ${rate[c.dataIndex].P.id === "MsComp" ? t("ruleM") : t("ruleB")}` } } },
      scales: { ...s, y: { ...s.y, max: 100, ticks: { ...s.y.ticks, callback: (v) => v + "%" } } },
    }),
  });

  const yrs = []; for (let y = endCE - 4; y <= endCE; y++) yrs.push(y);
  const pubYear = yrs.map((y) => [y, rows.reduce((n, x) => n + (x.years[y]?.j || 0) + (x.years[y]?.p || 0), 0)]).sort((a, b) => b[1] - a[1])[0];
  $("#ins-pub").textContent = pubYear[1] ? t("insPub", yl(pubYear[0] + 543), fmt(pubYear[1])) : t("insPubNone");
  $("#c-pub").setAttribute("aria-label", $("#ins-pub").textContent);
  draw("c-pub", {
    type: "bar",
    data: {
      labels: yrs.map((y) => String(yl(y + 543))),
      datasets: [
        bar("Journal", yrs.map((y) => rows.reduce((n, x) => n + (x.years[y]?.j || 0), 0)), "--s1", "s"),
        bar("Proceeding", yrs.map((y) => rows.reduce((n, x) => n + (x.years[y]?.p || 0), 0)), "--s2", "s"),
      ],
    },
    options: baseOpts({ plugins: { ...baseOpts().plugins, valueLabels: { mode: "total" } }, scales: stackScales() }),
  });

  const st = (ok) => (ok ? `<span class="status ok">✓ ${t("pass")}</span>` : `<span class="status no">✕ ${t("fail")}</span>`);
  $("#qtable tbody").innerHTML = rows.length ? rows.map((x, i) => `<tr>
    <td class="num" data-label="${t("thNo")}">${i + 1}</td>
    <td data-label="${t("thName")}"><button type="button" class="name-btn" data-person="${esc(x.name)}">${esc(x.name)}</button>${x.note ? `<span class="note">${t("noteStudy")}</span>` : ""}</td>
    <td data-label="${t("thProg")}">${x.progs.map((p) => `${esc(p.id)}${p.lead ? '<span class="star">*</span>' : ""}`).join(", ")}</td>
    <td class="num" data-label="Journal">${x.j}</td><td class="num" data-label="Proceeding">${x.p}</td><td class="num" data-label="${t("thTotal")}"><strong>${x.total}</strong></td>
    <td data-label="${t("thBach")}">${st(x.bach)}</td><td data-label="${t("thMast")}">${st(x.mast)}</td></tr>`).join("")
    : `<tr><td colspan="8" class="empty">${t("emptyQ")}</td></tr>`;
}

// ---------- detail drawer ----------
const drawer = $("#drawer"), stack = [];
function showDrawer(html) {
  $("#dr-body").innerHTML = `<div class="swap">${html}</div>`;
  $("#dr-back").hidden = stack.length < 2;
  if (!drawer.open) drawer.showModal();
  $("#dr-body").scrollTop = 0;
}
function openEntry(id, push = true) {
  const e = ENTRIES.find((x) => x.id === id); if (!e) return;
  record({ type: "entry", id }, push);
  const multi = e.awards.length > 1;
  showDrawer(`
    <div>${levelTag(e)} <span class="tag">${esc(catName(e.category))}</span></div>
    <h2 id="dr-title">${esc(e.title)}</h2>
    <dl class="dl">
      <dt>${t("dAward")}</dt><dd>${multi ? `<ul class="awards">${e.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : esc(e.award)}</dd>
      <dt>${t("dDate")}</dt><dd>${esc(dateText(e))}${e.date_note ? ` <span class="sub">(${t("yearOnlyNote")})</span>` : ""}</dd>
      <dt>${t("dAy")}</dt><dd>${yl(e.ay)}</dd>
      <dt>${t("dProg")}</dt><dd>${e.progs.map((p) => esc(progName(p))).join(", ") || t("unknownProg")}</dd>
    </dl>
    <h2 class="sub">${t("dPeople")} (${e.people.length})</h2>
    <div class="people">${e.people.map((p) => `<button type="button" class="person" data-person="${esc(p.name)}"><span>${esc(p.name)}<br><small>${t(p.role)} · ${p.progs.map((x) => esc(x.id)).join(", ") || t("unknownProg")}${multi ? ` · ${esc(p.award)}` : ""}</small></span><span aria-hidden="true">›</span></button>`).join("")}</div>
    ${e.sources.length ? e.sources.map((u, i) => `<a class="btn-primary" href="${esc(u)}" target="_blank" rel="noopener">${t("readSource")}${e.sources.length > 1 ? ` (${i + 1})` : ""}</a>`).join("") : `<p class="sub">${t("noSource")}</p>`}
    ${e.related.length ? `<h2 class="sub">${t("related")}</h2><div class="works">${e.related.map((x) => workButton(x)).join("")}</div>` : ""}
    ${safeUrl(e.image_url) ? `<img src="${esc(safeUrl(e.image_url))}" alt="${esc(e.title)}" style="width:100%;border-radius:12px">` : ""}`);
}
function openPerson(name, push = true) {
  const p = PEOPLE.get(name), s = STAFF.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!p && !s) return;
  record({ type: "person", name }, push);
  const role = p ? t(p.role) : t("faculty"), progs = (s ? s.progs : p.progs).map((x) => esc(x.id) + (x.lead ? '<span class="star">*</span>' : "")).join(", ");
  let qHtml = "";
  if (s) {
    const ay = qAy(), ev = evaluate(s, ay - 543), max = Math.max(1, ...PUB_YEARS.map((y) => s.years[y].j + s.years[y].p));
    qHtml = `<h2 class="sub">${t("pQ")} · ${t("pQWin", yl(ay), yl(ay - 4), yl(ay))}</h2>
      <div>${ev.bach ? `<span class="status ok">✓ ${t("thBach")}</span>` : `<span class="status no">✕ ${t("thBach")}</span>`}
      ${ev.mast ? `<span class="status ok">✓ ${t("thMast")}</span>` : `<span class="status no">✕ ${t("thMast")}</span>`}</div>
      ${s.note ? `<p class="sub">${t("noteStudy")}</p>` : ""}
      <h2 class="sub">${t("pPubs")} (<span style="color:var(--s1)">■</span> Journal <span style="color:var(--s2)">■</span> Proceeding)</h2>
      <div class="yearbars">${PUB_YEARS.map((y) => { const v = s.years[y]; return `<div class="yearbar"><span>${yl(y + 543)}</span><span class="track"><span class="j" style="width:${(v.j / max) * 100}%"></span><span class="p" style="width:${(v.p / max) * 100}%"></span></span><span>${v.j + v.p}</span></div>`; }).join("")}</div>`;
  }
  const works = p ? p.entries : [];
  showDrawer(`
    <p class="eyebrow">${role}${progs ? ` · ${progs}` : ""}</p>
    <h2 id="dr-title">${esc(name)}</h2>
    ${qHtml}
    <h2 class="sub">${t("pAwards")} (${works.length})</h2>
    ${works.length ? `<div class="works">${works.map((e) => workButton(e)).join("")}</div>` : `<p class="sub">${t("pNoAwards")}</p>`}`);
}
function record(item, push) {
  if (!drawer.open) stack.length = 0;
  if (push) stack.push(item);
}
$("#dr-back").addEventListener("click", () => {
  stack.pop(); const prev = stack.at(-1); if (!prev) return;
  prev.type === "entry" ? openEntry(prev.id, false) : openPerson(prev.name, false);
});
$("#dr-close").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
drawer.addEventListener("close", () => { stack.length = 0; });
document.addEventListener("click", (e) => {
  const w = e.target.closest("[data-entry]"); if (w) return openEntry(w.dataset.entry);
  const p = e.target.closest(".person[data-person]"); if (p) return openPerson(p.dataset.person);
});

// ---------- shell: tabs, language, theme ----------
function setTab(name) {
  for (const k of ["awards", "qcheck"]) {
    $(`#tab-${k}`).setAttribute("aria-selected", k === name);
    $(`#panel-${k}`).hidden = k !== name;
  }
  try { history.replaceState(null, "", `#${name}`); } catch (e) {}
  rerender();
}
function rerender() {
  if (!$("#panel-awards").hidden && ENTRIES.length) renderAwards();
  if (!$("#panel-qcheck").hidden && STAFF.length) renderQcheck();
}
$(".tabs").addEventListener("click", (e) => { const b = e.target.closest("[role=tab]"); if (b) setTab(b.id.slice(4)); });
$(".tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const next = $("#tab-awards").getAttribute("aria-selected") === "true" ? "qcheck" : "awards";
  setTab(next); $(`#tab-${next}`).focus();
});

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.title = `${t("brand")} · ${t("tabAwards")}`;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPh)));
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  syncTheme();
  setSource();
  if (ENTRIES.length) { renderAwardChips(); renderQChips(); rerender(); }
  if (drawer.open) { const cur = stack.at(-1); cur?.type === "entry" ? openEntry(cur.id, false) : cur && openPerson(cur.name, false); }
  try { localStorage.setItem("lang", lang); } catch (e) {}
}
document.querySelector(".switch").addEventListener("click", (e) => { const b = e.target.closest("[data-lang]"); if (b && b.dataset.lang !== lang) applyLang(b.dataset.lang); });

const isDark = () => document.documentElement.dataset.theme === "dark";
function syncTheme() { $("#theme").setAttribute("aria-label", isDark() ? t("themeLight") : t("themeDark")); }
$("#theme").addEventListener("click", () => {
  document.documentElement.dataset.theme = isDark() ? "light" : "dark";
  try { localStorage.setItem("theme", document.documentElement.dataset.theme); } catch (e) {}
  syncTheme(); rerender();
});

let LIVE = null;
function setSource() {
  const src = $("#source");
  src.textContent = LIVE === null ? t("loading") : LIVE ? t("live") : t("csv");
  src.classList.toggle("live", !!LIVE);
}

try {
  const th = localStorage.getItem("theme"); if (th) document.documentElement.dataset.theme = th;
  const lg = localStorage.getItem("lang"); if (lg && I18N[lg]) lang = lg;
} catch (e) {}
applyLang(lang);

(async () => {
  try {
    const [a, p] = await Promise.all([load("awards"), load("publications")]);
    LIVE = a.live; setSource();
    buildEntries(a.rows);
    initQcheck(p.rows);
    initAwards();
    setTab(location.hash === "#qcheck" ? "qcheck" : "awards");
    document.body.dataset.state = "ready";
    const io = "IntersectionObserver" in window && !calm
      ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" })
      : null;
    document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  } catch (e) {
    document.body.dataset.state = "error";
    LIVE = null; $("#source").textContent = t("loadFail");
    const msg = $("#state-msg");
    msg.className = "state-msg error"; msg.hidden = false;
    msg.innerHTML = `<strong>! ${t("loadFail")}</strong> ${t("loadFailMsg")} <button type="button" class="btn-text" onclick="location.reload()">${t("reload")}</button>`;
  }
})();
