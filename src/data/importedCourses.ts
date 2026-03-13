import type { CourseEntry } from "./schedule";

const STORAGE_KEY = "imported-courses";

export function getImportedCourses(): CourseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function saveImportedCourses(courses: CourseEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export function clearImportedCourses(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getImportedCount(): number {
  return getImportedCourses().length;
}
