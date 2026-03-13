import type { CourseEntry } from "./schedule";

const COLOR_POOL = [
  "course-purple", "course-blue-light", "course-pink", "course-lavender",
  "course-orange", "course-mint", "course-yellow", "course-salmon",
  "course-violet", "course-green", "course-teal", "course-gray",
  "course-peach", "course-sky", "course-cyan", "course-aqua",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length];
}

const TYPE_SYMBOLS = ["★", "☆", "●", "■", "〇", "◆", "▲"];

function extractTypeFromName(rawName: string): { name: string; type: string } {
  let name = rawName.replace(/^【调】/, "").trim();
  let type = "★";
  for (const sym of TYPE_SYMBOLS) {
    if (name.endsWith(sym)) {
      type = sym;
      name = name.slice(0, -sym.length).trim();
      break;
    }
  }
  return { name, type };
}

/**
 * Parse grid table (Format 1): cells with id="DAY-SLOTGROUP"
 * e.g. id="1-1" = Monday slot group 1 (slots 1-2)
 */
function parseGridTable(doc: Document): CourseEntry[] {
  const courses: CourseEntry[] = [];
  const table = doc.querySelector("#kbgrid_table_0");
  if (!table) return courses;

  const cells = table.querySelectorAll("td[id]");
  for (const cell of cells) {
    const cellId = cell.getAttribute("id") || "";
    const idMatch = cellId.match(/^(\d)-(\d)$/);
    if (!idMatch) continue;

    const day = parseInt(idMatch[1], 10);
    const slotGroup = parseInt(idMatch[2], 10);
    const defaultStart = (slotGroup - 1) * 2 + 1;
    const defaultEnd = defaultStart + 1;

    const conDivs = cell.querySelectorAll(".timetable_con");
    for (const con of conDivs) {
      const titleEl = con.querySelector(".title");
      if (!titleEl) continue;

      const rawTitle = (titleEl.querySelector("font")?.textContent || titleEl.textContent || "").trim();
      if (!rawTitle) continue;

      const { name, type } = extractTypeFromName(rawTitle);

      let startSlot = defaultStart;
      let endSlot = defaultEnd;
      let weekRange = "";
      let room = "";
      let teacher = "";

      const paragraphs = con.querySelectorAll("p");
      for (const p of paragraphs) {
        const tooltip = p.querySelector("[data-toggle='tooltip']");
        const tipTitle = tooltip?.getAttribute("title") || "";

        // Get text from direct-child <font> elements (not the icon font inside tooltip)
        let dataText = "";
        const directFonts = p.querySelectorAll(":scope > font");
        for (const f of directFonts) {
          const t = f.textContent?.trim();
          if (t) dataText = t;
        }
        if (!dataText) {
          dataText = p.textContent?.trim() || "";
        }

        if (tipTitle.includes("节") || tipTitle.includes("周")) {
          const slotMatch = dataText.match(/\(?(\d+)-(\d+)节\)?/);
          if (slotMatch) {
            startSlot = parseInt(slotMatch[1], 10);
            endSlot = parseInt(slotMatch[2], 10);
          }
          weekRange = dataText.replace(/\(?\d+-\d+节\)?/, "").trim();
        } else if (tipTitle.includes("地点")) {
          room = dataText;
        } else if (tipTitle.includes("教师")) {
          teacher = dataText;
        }
      }

      if (name) {
        courses.push({
          name,
          type,
          teacher,
          location: "",
          room,
          day,
          startSlot,
          endSlot,
          weekRange,
          color: colorForName(name),
        });
      }
    }
  }

  return courses;
}

/**
 * Parse list table (Format 2): day sections with id="xq_DAY",
 * slot cells with id="jc_DAY-START-END"
 */
function parseListTable(doc: Document): CourseEntry[] {
  const courses: CourseEntry[] = [];
  const table = doc.querySelector("#kblist_table");
  if (!table) return courses;

  for (let day = 1; day <= 7; day++) {
    const tbody = table.querySelector(`#xq_${day}`);
    if (!tbody) continue;

    const rows = tbody.querySelectorAll("tr");
    let currentStart = 0;
    let currentEnd = 0;

    for (const row of rows) {
      // Check for slot cell
      const slotCell = row.querySelector(`td[id^="jc_${day}-"]`);
      if (slotCell) {
        const slotId = slotCell.getAttribute("id") || "";
        const slotMatch = slotId.match(/jc_\d+-(\d+)-(\d+)/);
        if (slotMatch) {
          currentStart = parseInt(slotMatch[1], 10);
          currentEnd = parseInt(slotMatch[2], 10);
        }
      }

      const conDivs = row.querySelectorAll(".timetable_con");
      for (const con of conDivs) {
        const titleEl = con.querySelector(".title");
        if (!titleEl) continue;

        const rawTitle = (titleEl.querySelector("font")?.textContent || titleEl.textContent || "").trim();
        if (!rawTitle) continue;

        const { name, type } = extractTypeFromName(rawTitle);

        let weekRange = "";
        let room = "";
        let teacher = "";

        const fonts = con.querySelectorAll("p font");
        for (const font of fonts) {
          const text = font.textContent?.trim() || "";
          if (text.match(/周数[：:]/)) {
            weekRange = text.replace(/.*周数[：:]/, "").trim();
          } else if (text.match(/上课地点[：:]/)) {
            room = text.replace(/.*上课地点[：:]/, "").trim();
          } else if (text.match(/教师\s*[：:]/)) {
            teacher = text.replace(/.*教师\s*[：:]/, "").trim();
          }
        }

        if (name && currentStart > 0) {
          courses.push({
            name,
            type,
            teacher,
            location: "",
            room,
            day,
            startSlot: currentStart,
            endSlot: currentEnd,
            weekRange,
            color: colorForName(name),
          });
        }
      }
    }
  }

  return courses;
}

/**
 * Parse schedule HTML from 正方教务系统.
 * Automatically detects grid table (Format 1) or list table (Format 2).
 */
export function parseScheduleHtml(html: string): CourseEntry[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Try grid table first
  const gridCourses = parseGridTable(doc);
  if (gridCourses.length > 0) return gridCourses;

  // Fallback to list table
  return parseListTable(doc);
}
