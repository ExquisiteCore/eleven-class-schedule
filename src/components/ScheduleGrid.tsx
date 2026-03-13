import { useMemo } from "react";
import {
  TIME_SLOTS,
  DAY_NAMES,
  getWeekDates,
  getCoursesForWeekDay,
  isToday,
  type CourseEntry,
} from "../data/schedule";
import type { AppSettings } from "../data/settings";

interface ScheduleGridProps {
  week: number;
  settings: AppSettings;
  onCourseClick: (course: CourseEntry) => void;
}

const SLOT_HEIGHT = 68;
const BREAK_HEIGHT = 14;
const BREAKS_AFTER = [4, 8];

const BREAK_LABELS: Record<number, string> = {
  4: "午休",
  8: "晚间",
};

function slotTopPx(slot: number): number {
  let top = (slot - 1) * SLOT_HEIGHT;
  for (const b of BREAKS_AFTER) {
    if (slot > b) top += BREAK_HEIGHT;
  }
  return top;
}

function slotSpanPx(startSlot: number, endSlot: number): number {
  return slotTopPx(endSlot + 1) - slotTopPx(startSlot);
}

const TOTAL_HEIGHT =
  TIME_SLOTS.length * SLOT_HEIGHT + BREAKS_AFTER.length * BREAK_HEIGHT;

export default function ScheduleGrid({ week, settings, onCourseClick }: ScheduleGridProps) {
  const weekDates = useMemo(() => getWeekDates(week, settings), [week, settings]);

  const daysCourses = useMemo(
    () => Array.from({ length: 7 }, (_, i) => getCoursesForWeekDay(week, i + 1)),
    [week]
  );

  return (
    <div className="schedule-container">
      <div className="day-header-row">
        <div className="time-col-header">
          <span className="month-label">
            {weekDates[0].getMonth() + 1}月
          </span>
        </div>
        {weekDates.map((date, i) => {
          const today = isToday(date);
          return (
            <div key={i} className={`day-header${today ? " is-today" : ""}`}>
              <span className="day-name">{DAY_NAMES[i]}</span>
              <span className={`day-date${today ? " today-badge" : ""}`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid-body" style={{ height: TOTAL_HEIGHT }}>
        <div className="time-column">
          {TIME_SLOTS.map((ts) => (
            <div
              key={ts.slot}
              className="time-cell"
              style={{ top: slotTopPx(ts.slot), height: SLOT_HEIGHT }}
            >
              <span className="slot-num">{ts.slot}</span>
              <span className="slot-start">{ts.start}</span>
              <span className="slot-end">{ts.end}</span>
            </div>
          ))}
        </div>

        <div className="days-area">
          {TIME_SLOTS.map((ts) => (
            <div
              key={`line-${ts.slot}`}
              className="grid-line"
              style={{ top: slotTopPx(ts.slot) + SLOT_HEIGHT - 1 }}
            />
          ))}

          {BREAKS_AFTER.map((slot) => (
            <div
              key={`break-${slot}`}
              className="section-break"
              style={{ top: slotTopPx(slot + 1) - BREAK_HEIGHT, height: BREAK_HEIGHT }}
            >
              <span className="section-break-label">{BREAK_LABELS[slot]}</span>
            </div>
          ))}

          {weekDates.map((date, dayIdx) => {
            const today = isToday(date);
            const courses = daysCourses[dayIdx];
            return (
              <div
                key={dayIdx}
                className={`day-column${today ? " is-today-col" : ""}`}
                style={{ left: `${(dayIdx / 7) * 100}%`, width: `${100 / 7}%` }}
              >
                {today && <div className="today-bg" />}
                {dayIdx > 0 && <div className="col-line" />}

                {courses.map((course, ci) => (
                  <CourseCard
                    key={ci}
                    course={course}
                    onClick={() => onCourseClick(course)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }: { course: CourseEntry; onClick: () => void }) {
  const top = slotTopPx(course.startSlot);
  const endSlot = Math.min(course.endSlot, 10);
  const height = slotSpanPx(course.startSlot, endSlot);
  const slotCount = endSlot - course.startSlot + 1;

  const maxChars = slotCount <= 2 ? 5 : 7;
  const displayName =
    course.name.length > maxChars ? course.name.slice(0, maxChars) : course.name;

  const nameClamp = slotCount <= 2 ? 2 : slotCount <= 3 ? 3 : 4;

  return (
    <div
      className={`course-block ${course.color}`}
      style={{ top, height: height - 4 }}
      onClick={onClick}
    >
      <span
        className="cb-name"
        style={{ WebkitLineClamp: nameClamp }}
      >
        {displayName}{course.type}
      </span>
      {slotCount >= 2 && <span className="cb-room">{course.room}</span>}
      {slotCount >= 3 && <span className="cb-loc">@{course.location}</span>}
    </div>
  );
}
