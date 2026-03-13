import { getWeekNumber } from "../data/schedule";
import type { AppSettings } from "../data/settings";

interface HeaderProps {
  week: number;
  onWeekChange: (week: number) => void;
  settings: AppSettings;
  onAddCourse: () => void;
}

export default function Header({ week, onWeekChange, settings, onAddCourse }: HeaderProps) {
  const goPrev = () => onWeekChange(Math.max(1, week - 1));
  const goNext = () => onWeekChange(Math.min(settings.totalWeeks, week + 1));
  const currentWeek = getWeekNumber(new Date(), settings);

  return (
    <header className="app-header">
      <button className="header-add-btn" onClick={onAddCourse} aria-label="添加课程">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className="week-selector">
        <button className="week-nav" onClick={goPrev} disabled={week <= 1} aria-label="上一周">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="week-info">
          <span className="week-label">第{week}周</span>
          <span className="semester-name">{settings.semesterName}</span>
        </div>
        <button className="week-nav" onClick={goNext} disabled={week >= settings.totalWeeks} aria-label="下一周">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
      {week !== currentWeek && (
        <button className="today-btn" onClick={() => onWeekChange(currentWeek)}>
          回到本周
        </button>
      )}
    </header>
  );
}
