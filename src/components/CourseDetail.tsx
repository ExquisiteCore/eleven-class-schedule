import { TIME_SLOTS, type CourseEntry } from "../data/schedule";
import { deleteCustomCourse } from "../data/customCourses";

interface CourseDetailProps {
  course: CourseEntry;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function CourseDetail({ course, onClose, onDeleted }: CourseDetailProps) {
  const startTime = TIME_SLOTS.find((t) => t.slot === course.startSlot);
  const endTime = TIME_SLOTS.find((t) => t.slot === course.endSlot);
  const isCustom = !!course.id;

  const handleDelete = () => {
    if (course.id) {
      deleteCustomCourse(course.id);
      onDeleted?.();
    }
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className={`sheet-color-bar ${course.color}`} />

        <div className="sheet-header">
          <span className="sheet-title">{course.name}</span>
          <span className="sheet-type">{course.type}</span>
        </div>

        <div className="sheet-rows">
          <div className="sheet-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>第{course.startSlot}-{course.endSlot}节 ({startTime?.start} - {endTime?.end})</span>
          </div>
          <div className="sheet-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span>{course.teacher}</span>
          </div>
          <div className="sheet-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span>{course.location} {course.room}</span>
          </div>
          <div className="sheet-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{course.weekRange}</span>
          </div>
        </div>

        <div className="sheet-actions">
          {isCustom && (
            <button className="sheet-btn sheet-btn-danger" onClick={handleDelete}>
              删除课程
            </button>
          )}
          <button className="sheet-btn sheet-btn-close" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
