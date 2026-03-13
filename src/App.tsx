import { useState, useCallback } from "react";
import Header from "./components/Header";
import ScheduleGrid from "./components/ScheduleGrid";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import BottomNav from "./components/BottomNav";
import CourseDetail from "./components/CourseDetail";
import AddCourse from "./components/AddCourse";
import { getWeekNumber, type CourseEntry } from "./data/schedule";
import { getSettings, type AppSettings } from "./data/settings";
import "./App.css";

function App() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [week, setWeek] = useState(() => getWeekNumber(new Date(), settings));
  const [tab, setTab] = useState("schedule");
  const [detailCourse, setDetailCourse] = useState<CourseEntry | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleSettingsChange = useCallback((s: AppSettings) => {
    setSettings(s);
    setWeek(getWeekNumber(new Date(), s));
  }, []);

  const handleCourseClick = useCallback((course: CourseEntry) => {
    setDetailCourse(course);
  }, []);

  const handleCourseDeleted = useCallback(() => {
    setDetailCourse(null);
    refresh();
  }, [refresh]);

  const handleCourseAdded = useCallback(() => {
    setShowAddCourse(false);
    refresh();
  }, [refresh]);

  return (
    <div className="app-shell">
      {tab === "schedule" && (
        <Header
          week={week}
          onWeekChange={setWeek}
          settings={settings}
          onAddCourse={() => setShowAddCourse(true)}
        />
      )}
      {tab === "home" && (
        <header className="page-header">
          <span className="page-header-title">十一课程表</span>
        </header>
      )}
      {tab === "profile" && (
        <header className="page-header">
          <span className="page-header-title">我的</span>
        </header>
      )}
      <main className="app-main">
        {tab === "home" && (
          <HomePage
            key={refreshKey}
            week={week}
            settings={settings}
            onCourseClick={handleCourseClick}
          />
        )}
        {tab === "schedule" && (
          <ScheduleGrid
            key={refreshKey}
            week={week}
            settings={settings}
            onCourseClick={handleCourseClick}
          />
        )}
        {tab === "profile" && (
          <ProfilePage
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />

      {detailCourse && (
        <CourseDetail
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onDeleted={handleCourseDeleted}
        />
      )}

      {showAddCourse && (
        <AddCourse
          onClose={() => setShowAddCourse(false)}
          onAdded={handleCourseAdded}
        />
      )}
    </div>
  );
}

export default App;
