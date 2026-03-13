export interface AppSettings {
  semesterStart: string; // ISO date string "YYYY-MM-DD"
  semesterName: string;
  totalWeeks: number;
  jwxtUrl: string; // 教务系统 URL
}

const STORAGE_KEY = "app-settings";

const DEFAULTS: AppSettings = {
  semesterStart: "2026-02-23",
  semesterName: "2025-2026 第2学期",
  totalWeeks: 17,
  jwxtUrl: "",
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULTS };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Parse the stored ISO date string into a Date (midnight local) */
export function getSemesterStartDate(settings?: AppSettings): Date {
  const s = settings || getSettings();
  const [y, m, d] = s.semesterStart.split("-").map(Number);
  return new Date(y, m - 1, d);
}
