import type { CourseEntry } from "./schedule";

export interface CustomCourse extends CourseEntry {
  id: string;
}

const STORAGE_KEY = "custom-courses";

const COLOR_POOL = [
  "course-purple", "course-blue-light", "course-pink", "course-lavender",
  "course-orange", "course-mint", "course-yellow", "course-salmon",
  "course-violet", "course-green", "course-teal", "course-gray",
  "course-peach", "course-sky", "course-cyan", "course-aqua",
];

/** Deterministic color from course name */
function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length];
}

export function getCustomCourses(): CustomCourse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function saveCustomCourses(courses: CustomCourse[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export function addCustomCourse(
  course: Omit<CustomCourse, "id" | "color">
): CustomCourse {
  const courses = getCustomCourses();
  const newCourse: CustomCourse = {
    ...course,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    color: colorForName(course.name),
  };
  courses.push(newCourse);
  saveCustomCourses(courses);
  return newCourse;
}

export function deleteCustomCourse(id: string): void {
  const courses = getCustomCourses().filter((c) => c.id !== id);
  saveCustomCourses(courses);
}
