interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab${active === "home" ? " active" : ""}`}
        onClick={() => onChange("home")}
        aria-label="首页"
      >
        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" fill={active === "home" ? "currentColor" : "none"} />
          {active === "home" ? (
            <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" />
          ) : (
            <polyline points="9 22 9 12 15 12 15 22" />
          )}
        </svg>
        <span className="nav-label">首页</span>
      </button>

      <button
        className={`nav-tab${active === "schedule" ? " active" : ""}`}
        onClick={() => onChange("schedule")}
        aria-label="课表"
      >
        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" fill={active === "schedule" ? "currentColor" : "none"} />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" stroke={active === "schedule" ? "#fff" : "currentColor"} />
        </svg>
        <span className="nav-label">课表</span>
      </button>

      <button
        className={`nav-tab${active === "profile" ? " active" : ""}`}
        onClick={() => onChange("profile")}
        aria-label="我的"
      >
        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" fill={active === "profile" ? "currentColor" : "none"} />
          <path d="M20 21a8 8 0 1 0-16 0" fill={active === "profile" ? "currentColor" : "none"} />
        </svg>
        <span className="nav-label">我的</span>
      </button>
    </nav>
  );
}
