import { ALL_COURSES, TIME_SLOTS, getWeekNumber, getCoursesForWeekDay, type CourseEntry } from "../data/schedule";
import type { AppSettings } from "../data/settings";

interface HomePageProps {
  week: number;
  settings: AppSettings;
  onCourseClick: (course: CourseEntry) => void;
}

export default function HomePage({ week, settings, onCourseClick }: HomePageProps) {
  const now = new Date();
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const todayCourses = getCoursesForWeekDay(week, dayOfWeek);
  const currentWeek = getWeekNumber(new Date(), settings);

  const hours = now.getHours();
  const greeting = hours < 6 ? "夜深了" : hours < 12 ? "上午好" : hours < 18 ? "下午好" : "晚上好";

  const uniqueCourses = new Set(ALL_COURSES.map((c) => c.name)).size;

  return (
    <div className="home-page">
      <div className="home-greeting">
        <span className="greeting-text">{greeting}</span>
        <span className="greeting-sub">{settings.semesterName}</span>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <span className="stat-num">{currentWeek}</span>
          <span className="stat-label">当前周</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{settings.totalWeeks}</span>
          <span className="stat-label">总周数</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{uniqueCourses}</span>
          <span className="stat-label">课程数</span>
        </div>
      </div>

      <div className="home-section">
        <div className="section-title">今日课程</div>
        {todayCourses.length === 0 ? (
          <div className="empty-hint">今天没有课程，好好休息吧</div>
        ) : (
          <div className="today-list">
            {todayCourses.map((c, i) => {
              const startTime = TIME_SLOTS.find(t => t.slot === c.startSlot)?.start || "";
              return (
                <div
                  key={i}
                  className="today-item"
                  onClick={() => onCourseClick(c)}
                >
                  <div className={`ti-slot-badge ${c.color}`}>
                    {c.startSlot}-{c.endSlot}
                  </div>
                  <div className="ti-info">
                    <span className="ti-name">{c.name}{c.type}</span>
                    <span className="ti-detail">{c.teacher} · {c.room}</span>
                  </div>
                  <span className="ti-time-right">{startTime}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
