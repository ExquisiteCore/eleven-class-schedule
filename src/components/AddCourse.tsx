import { useState } from "react";
import { DAY_NAMES } from "../data/schedule";
import { addCustomCourse } from "../data/customCourses";

interface AddCourseProps {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddCourse({ onClose, onAdded }: AddCourseProps) {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [location, setLocation] = useState("新校区");
  const [room, setRoom] = useState("");
  const [day, setDay] = useState(1);
  const [startSlot, setStartSlot] = useState(1);
  const [endSlot, setEndSlot] = useState(2);
  const [weekRange, setWeekRange] = useState("1-17周");
  const [type, setType] = useState<"★" | "▲">("★");

  const canSubmit = name.trim() && room.trim() && startSlot <= endSlot;

  const handleSubmit = () => {
    if (!canSubmit) return;
    addCustomCourse({
      name: name.trim(),
      teacher: teacher.trim() || "未知",
      location: location.trim(),
      room: room.trim(),
      day,
      startSlot,
      endSlot,
      weekRange: weekRange.trim() || "1-17周",
      type,
    });
    onAdded();
  };

  return (
    <div className="add-course-page">
      <header className="add-course-header">
        <button className="add-course-cancel" onClick={onClose}>取消</button>
        <span className="add-course-title">添加课程</span>
        <button
          className="add-course-save"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          保存
        </button>
      </header>

      <div className="add-course-form">
        <div className="form-group">
          <label className="form-label">课程名称 *</label>
          <input
            className="form-input"
            placeholder="例: 高等数学"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">教师</label>
          <input
            className="form-input"
            placeholder="例: 张老师"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">校区</label>
            <input
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">教室 *</label>
            <input
              className="form-input"
              placeholder="例: JXF05030"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">星期</label>
          <div className="day-picker">
            {DAY_NAMES.map((d, i) => (
              <button
                key={i}
                className={`day-pick-btn${day === i + 1 ? " active" : ""}`}
                onClick={() => setDay(i + 1)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">开始节次</label>
            <select
              className="form-input"
              value={startSlot}
              onChange={(e) => setStartSlot(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>第{i + 1}节</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">结束节次</label>
            <select
              className="form-input"
              value={endSlot}
              onChange={(e) => setEndSlot(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1)
                .filter((s) => s >= startSlot)
                .map((s) => (
                  <option key={s} value={s}>第{s}节</option>
                ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">周次</label>
          <input
            className="form-input"
            placeholder="例: 1-17周 或 1-8周(单)"
            value={weekRange}
            onChange={(e) => setWeekRange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">类型</label>
          <div className="type-picker">
            <button
              className={`type-pick-btn${type === "★" ? " active" : ""}`}
              onClick={() => setType("★")}
            >★ 必修</button>
            <button
              className={`type-pick-btn${type === "▲" ? " active" : ""}`}
              onClick={() => setType("▲")}
            >▲ 选修</button>
          </div>
        </div>
      </div>
    </div>
  );
}
