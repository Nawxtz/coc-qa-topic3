# CoC QA Dashboard, Topic 3

คู่มือภาษาไทย (ผู้ใช้ ผู้อัปเดตข้อมูล ผู้ดูแลระบบ): [MANUAL.md](MANUAL.md) · ลิงก์ทั้งหมด: [LINKS.md](LINKS.md) · เว็บ: https://nawxtz.github.io/coc-qa-topic3/

HCD-101 Visualization dashboard assignment, College of Computing, PSU Phuket.

The site has two pages:

- **Awards and competitions**: awards, competitions and innovations won by CoC students and lecturers, counted per academic year (August to July), by programme, by student or lecturer, and by national or international level.
- **Q-Check**: every lecturer with their journal and proceeding count over the last five years, and whether they meet the programme lecturer rule (bachelor: at least 1 work, master: at least 3 works).

Rows of the same work on the same date are shown as one entry (a team, even if members got different awards). Select an entry for its details and source link, or a name for that person's works and Q-Check result. The interface is Thai by default with an English switch.

## Data

Each page reads a Google Sheet through the `gviz` CSV endpoint (sheet IDs in `app.js`, `CONFIG.sheets`). Edit the sheet and reload the page. If the sheet cannot be reached, the page falls back to the copies in `data/`.

- `awards`: one row per person per award. Columns: `name, role, programme, work_title, category, award, award_date, level, source_url, image_url, date_note`. Award rows were collected from news on computing.psu.ac.th and the organisers' sites; each row links its source.
- `publications`: one row per lecturer, `j2020, p2020, ...` are journal and proceeding counts per year, taken from the course file Q-Check 2025 (updated 29 Apr 2025).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Members: นายพงศภัค ได้รูป (6730614028), นายอริยะ ลือสวัสดิ์ (6730614023).

## Tests

The data rules (CSV parsing, academic year, the 5-year lecturer rule) live in `logic.js` and are tested without any packages:

```bash
node --test tests/*.test.js
```

Dates in the `awards` sheet must be `YYYY-MM-DD`. Rows with another format are skipped and the page says how many.
