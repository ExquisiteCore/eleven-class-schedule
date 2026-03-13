import { getSemesterStartDate, getSettings, type AppSettings } from "./settings";
import { getCustomCourses } from "./customCourses";

export { type AppSettings } from "./settings";

export const TIME_SLOTS: { slot: number; start: string; end: string }[] = [
  { slot: 1, start: "08:20", end: "09:05" },
  { slot: 2, start: "09:15", end: "10:00" },
  { slot: 3, start: "10:15", end: "11:00" },
  { slot: 4, start: "11:10", end: "11:55" },
  { slot: 5, start: "14:30", end: "15:15" },
  { slot: 6, start: "15:25", end: "16:10" },
  { slot: 7, start: "16:20", end: "17:05" },
  { slot: 8, start: "17:15", end: "18:00" },
  { slot: 9, start: "18:15", end: "19:00" },
  { slot: 10, start: "19:10", end: "19:55" },
];

export const DAY_NAMES = ["一", "二", "三", "四", "五", "六", "日"] as const;

export interface CourseEntry {
  id?: string; // present only on custom courses
  name: string;
  type: "★" | "▲";
  teacher: string;
  location: string;
  room: string;
  day: number; // 1=Mon ... 7=Sun
  startSlot: number;
  endSlot: number;
  weekRange: string;
  color: string;
}

// Distinct pastel palette — each course name maps to a unique color
const COURSE_COLORS: Record<string, string> = {
  "Python高级程序设计": "course-purple",
  "大学英语（2）": "course-blue-light",
  "Linux操作系统基础": "course-pink",
  "大学美育": "course-lavender",
  "高等数学": "course-orange",
  "人工智能通识课": "course-mint",
  "大学体育（2）": "course-yellow",
  "计算机视觉应用开发实训-科学素养": "course-salmon",
  "人工智能伦理与安全": "course-violet",
  "形势与政策2": "course-green",
  "中华民族共同体概论": "course-teal",
  "职业发展与就业指导（2）": "course-gray",
  "大学生心理健康": "course-peach",
  "毛泽东思想和中国特色社会主义理论体系概论": "course-sky",
  "交换路由技术": "course-cyan",
  "创新创业教育": "course-aqua",
};

function getColor(name: string): string {
  return COURSE_COLORS[name] || "course-default";
}

// All built-in course entries
export const ALL_COURSES: CourseEntry[] = [
  // === Monday ===
  { name: "Python高级程序设计", type: "★", teacher: "薛慧君", location: "新校区", room: "SXD06030", day: 1, startSlot: 1, endSlot: 4, weekRange: "1-5周,7-9周,11-16周", color: getColor("Python高级程序设计") },
  { name: "大学英语（2）", type: "★", teacher: "张媛", location: "新校区", room: "JXF01020", day: 1, startSlot: 5, endSlot: 6, weekRange: "1-7周(单)", color: getColor("大学英语（2）") },
  { name: "Linux操作系统基础", type: "★", teacher: "续东升", location: "新校区", room: "SXA03060", day: 1, startSlot: 5, endSlot: 6, weekRange: "9-17周(单)", color: getColor("Linux操作系统基础") },
  { name: "大学美育", type: "★", teacher: "耿婧", location: "新校区", room: "JXF05050", day: 1, startSlot: 5, endSlot: 6, weekRange: "2-4周(双),8周,12-16周(双)", color: getColor("大学美育") },
  { name: "高等数学", type: "★", teacher: "包晓兰", location: "新校区", room: "JXF05030", day: 1, startSlot: 7, endSlot: 8, weekRange: "1-5周,7-9周,11-17周", color: getColor("高等数学") },
  { name: "人工智能通识课", type: "★", teacher: "孟欣", location: "新校区", room: "SXA03060", day: 1, startSlot: 9, endSlot: 10, weekRange: "11周", color: getColor("人工智能通识课") },
  { name: "人工智能通识课", type: "★", teacher: "崔娜", location: "新校区", room: "SXA03060", day: 1, startSlot: 9, endSlot: 10, weekRange: "13周", color: getColor("人工智能通识课") },
  { name: "人工智能通识课", type: "★", teacher: "董圣华", location: "新校区", room: "SXA0304B", day: 1, startSlot: 9, endSlot: 10, weekRange: "14周", color: getColor("人工智能通识课") },

  // === Tuesday ===
  { name: "大学体育（2）", type: "★", teacher: "武雄飞", location: "新校区", room: "WTZX0510", day: 2, startSlot: 3, endSlot: 4, weekRange: "1-9周,11-12周,14-15周", color: getColor("大学体育（2）") },
  { name: "Linux操作系统基础", type: "★", teacher: "续东升", location: "新校区", room: "SXA03050", day: 2, startSlot: 3, endSlot: 4, weekRange: "17周", color: getColor("Linux操作系统基础") },
  { name: "计算机视觉应用开发实训-科学素养", type: "★", teacher: "胡秀丽", location: "新校区", room: "SXD05010", day: 2, startSlot: 9, endSlot: 10, weekRange: "1-9周,11-17周", color: getColor("计算机视觉应用开发实训-科学素养") },

  // === Wednesday ===
  { name: "大学英语（2）", type: "★", teacher: "张媛", location: "新校区", room: "JXF01020", day: 3, startSlot: 1, endSlot: 2, weekRange: "1-17周(单)", color: getColor("大学英语（2）") },
  { name: "人工智能伦理与安全", type: "★", teacher: "弓艳荣", location: "新校区", room: "JXF01020", day: 3, startSlot: 1, endSlot: 2, weekRange: "2-16周(双)", color: getColor("人工智能伦理与安全") },
  { name: "Linux操作系统基础", type: "★", teacher: "续东升", location: "新校区", room: "SXA03070", day: 3, startSlot: 3, endSlot: 4, weekRange: "2-14周,16周", color: getColor("Linux操作系统基础") },
  { name: "形势与政策2", type: "★", teacher: "邢思雨", location: "新校区", room: "JXF05030", day: 3, startSlot: 5, endSlot: 6, weekRange: "1-3周,7周", color: getColor("形势与政策2") },
  { name: "中华民族共同体概论", type: "★", teacher: "张欣", location: "新校区", room: "JXF05020", day: 3, startSlot: 5, endSlot: 6, weekRange: "4-6周,8-12周,14-15周", color: getColor("中华民族共同体概论") },
  { name: "职业发展与就业指导（2）", type: "▲", teacher: "白洋", location: "新校区", room: "JXF05010", day: 3, startSlot: 7, endSlot: 8, weekRange: "1-7周(单)", color: getColor("职业发展与就业指导（2）") },
  { name: "大学生心理健康", type: "★", teacher: "宝乌日吉木苏", location: "新校区", room: "JXF05020", day: 3, startSlot: 7, endSlot: 8, weekRange: "2-8周(双),9-16周", color: getColor("大学生心理健康") },
  { name: "高等数学", type: "★", teacher: "包晓兰", location: "新校区", room: "JXF05030", day: 3, startSlot: 7, endSlot: 8, weekRange: "17周", color: getColor("高等数学") },

  // === Thursday ===
  { name: "毛泽东思想和中国特色社会主义理论体系概论", type: "★", teacher: "李忠友", location: "新校区", room: "JXF05030", day: 4, startSlot: 1, endSlot: 2, weekRange: "2-12周,14-16周", color: getColor("毛泽东思想和中国特色社会主义理论体系概论") },
  { name: "交换路由技术", type: "★", teacher: "张兴飞", location: "新校区", room: "SXA03060", day: 4, startSlot: 3, endSlot: 4, weekRange: "1-12周", color: getColor("交换路由技术") },

  // === Friday ===
  { name: "大学英语（2）", type: "★", teacher: "张媛", location: "新校区", room: "JXF01020", day: 5, startSlot: 1, endSlot: 2, weekRange: "1周,4-6周(双),7-8周,10-12周,14-15周,17周", color: getColor("大学英语（2）") },
  { name: "大学美育", type: "★", teacher: "耿婧", location: "新校区", room: "JXF05050", day: 5, startSlot: 1, endSlot: 2, weekRange: "3-5周(单)", color: getColor("大学美育") },
  { name: "创新创业教育", type: "★", teacher: "耿婧", location: "新校区", room: "JXF05050", day: 5, startSlot: 1, endSlot: 2, weekRange: "2周", color: getColor("创新创业教育") },
  { name: "创新创业教育", type: "★", teacher: "耿婧", location: "新校区", room: "JXF05050", day: 5, startSlot: 3, endSlot: 4, weekRange: "1-7周(单),11周,15-17周(单)", color: getColor("创新创业教育") },
  { name: "交换路由技术", type: "★", teacher: "张兴飞", location: "新校区", room: "SXA03070", day: 5, startSlot: 5, endSlot: 8, weekRange: "1-8周,10-12周,14-15周,17周", color: getColor("交换路由技术") },
  { name: "人工智能通识课", type: "★", teacher: "崔娜", location: "新校区", room: "SXA0304B", day: 5, startSlot: 9, endSlot: 10, weekRange: "12周", color: getColor("人工智能通识课") },
];

/**
 * Parse a Chinese week-range string and return the set of weeks a course is active.
 */
export function parseWeekRange(range: string): Set<number> {
  const weeks = new Set<number>();
  const parts = range.split(/[,，]/);
  for (const part of parts) {
    const trimmed = part.trim();
    const isOdd = trimmed.includes("(单)") || trimmed.includes("（单）");
    const isEven = trimmed.includes("(双)") || trimmed.includes("（双）");
    const nums = trimmed.replace(/[^0-9\-]/g, "");
    const dashMatch = nums.match(/^(\d+)-(\d+)$/);
    if (dashMatch) {
      const start = parseInt(dashMatch[1], 10);
      const end = parseInt(dashMatch[2], 10);
      for (let w = start; w <= end; w++) {
        if (isOdd && w % 2 === 0) continue;
        if (isEven && w % 2 === 1) continue;
        weeks.add(w);
      }
    } else {
      const single = parseInt(nums, 10);
      if (!isNaN(single)) weeks.add(single);
    }
  }
  return weeks;
}

/** Get all courses (built-in + custom) for a given week and day */
export function getCoursesForWeekDay(week: number, day: number): CourseEntry[] {
  const custom = getCustomCourses();
  const all: CourseEntry[] = [...ALL_COURSES, ...custom];
  return all.filter(
    (c) => c.day === day && parseWeekRange(c.weekRange).has(week)
  );
}

/** Calculate current week number */
export function getWeekNumber(date: Date = new Date(), settings?: AppSettings): number {
  const s = settings || getSettings();
  const start = getSemesterStartDate(s);
  const diff = date.getTime() - start.getTime();
  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) return 1;
  return Math.min(Math.floor(daysDiff / 7) + 1, s.totalWeeks);
}

/** Get the Monday date for a given week number */
export function getMondayOfWeek(week: number, settings?: AppSettings): Date {
  const s = settings || getSettings();
  const start = getSemesterStartDate(s);
  const d = new Date(start);
  d.setDate(d.getDate() + (week - 1) * 7);
  return d;
}

/** Get dates for all 7 days in a given week */
export function getWeekDates(week: number, settings?: AppSettings): Date[] {
  const monday = getMondayOfWeek(week, settings);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Check if a date is today */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
