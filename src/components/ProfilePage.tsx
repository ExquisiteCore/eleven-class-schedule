import { useState } from "react";
import { ALL_COURSES, getWeekNumber } from "../data/schedule";
import { saveSettings, type AppSettings } from "../data/settings";
import { getImportedCourses } from "../data/importedCourses";

interface ProfilePageProps {
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
  onOpenImport: () => void;
}

export default function ProfilePage({ settings, onSettingsChange, onOpenImport }: ProfilePageProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const currentWeek = getWeekNumber(new Date(), settings);
  const imported = getImportedCourses();
  const baseCourses = imported.length > 0 ? imported : ALL_COURSES;
  const uniqueCourses = new Set(baseCourses.map((c) => c.name)).size;
  const progress = Math.round((currentWeek / settings.totalWeeks) * 100);

  const update = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial };
    saveSettings(next);
    onSettingsChange(next);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar">都</div>
        <div className="profile-info">
          <span className="profile-name">都书锐</span>
          <span className="profile-id">252712004</span>
        </div>
      </div>

      <div className="info-group">
        <div className="info-row info-row-tap" onClick={() => setEditing("date")}>
          <span className="info-label">开学日期</span>
          {editing === "date" ? (
            <input
              type="date"
              className="info-input"
              value={settings.semesterStart}
              autoFocus
              onChange={(e) => update({ semesterStart: e.target.value })}
              onBlur={() => setEditing(null)}
            />
          ) : (
            <span className="info-value info-value-arrow">{settings.semesterStart}</span>
          )}
        </div>
        <div className="info-row info-row-tap" onClick={() => setEditing("name")}>
          <span className="info-label">学期</span>
          {editing === "name" ? (
            <input
              type="text"
              className="info-input"
              value={settings.semesterName}
              autoFocus
              onChange={(e) => update({ semesterName: e.target.value })}
              onBlur={() => setEditing(null)}
            />
          ) : (
            <span className="info-value info-value-arrow">{settings.semesterName}</span>
          )}
        </div>
        <div className="info-row info-row-tap" onClick={() => setEditing("weeks")}>
          <span className="info-label">总周数</span>
          {editing === "weeks" ? (
            <input
              type="number"
              className="info-input"
              value={settings.totalWeeks}
              min={1}
              max={30}
              autoFocus
              onChange={(e) => update({ totalWeeks: Math.max(1, Number(e.target.value) || 1) })}
              onBlur={() => setEditing(null)}
            />
          ) : (
            <span className="info-value info-value-arrow">{settings.totalWeeks}周</span>
          )}
        </div>
      </div>

      <div className="info-group">
        <div className="info-row info-row-tap" onClick={() => setEditing("jwxtUrl")}>
          <span className="info-label">教务系统地址</span>
          {editing === "jwxtUrl" ? (
            <input
              type="url"
              className="info-input"
              value={settings.jwxtUrl}
              placeholder="https://jwfw.example.edu.cn"
              autoFocus
              onChange={(e) => update({ jwxtUrl: e.target.value })}
              onBlur={() => setEditing(null)}
            />
          ) : (
            <span className="info-value info-value-arrow">
              {settings.jwxtUrl || "未设置"}
            </span>
          )}
        </div>
        <div className="info-row info-row-tap" onClick={onOpenImport}>
          <span className="info-label">导入课表</span>
          <span className="info-value info-value-arrow">
            {imported.length > 0
              ? `已导入 ${imported.length} 条`
              : "未导入"}
          </span>
        </div>
      </div>

      <div className="info-group">
        <div className="info-row">
          <span className="info-label">班级</span>
          <span className="info-value">计应252</span>
        </div>
        <div className="info-row">
          <span className="info-label">校区</span>
          <span className="info-value">新校区</span>
        </div>
      </div>

      <div className="info-group">
        <div className="info-row">
          <span className="info-label">当前周</span>
          <span className="info-value">第{currentWeek}周 / 共{settings.totalWeeks}周 ({progress}%)</span>
        </div>
        <div className="info-row">
          <span className="info-label">课程数</span>
          <span className="info-value">{uniqueCourses}门</span>
        </div>
      </div>

      <div className="info-group">
        <div className="info-row">
          <span className="info-label">数据来源</span>
          <span className="info-value">
            {imported.length > 0 ? "教务系统导入" : "内置数据"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">版本</span>
          <span className="info-value">0.3.0</span>
        </div>
      </div>
    </div>
  );
}
