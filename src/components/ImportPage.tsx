import { useState, useEffect } from "react";
import { parseScheduleHtml } from "../data/htmlParser";
import { saveImportedCourses, getImportedCount, clearImportedCourses } from "../data/importedCourses";
import type { AppSettings } from "../data/settings";

interface ImportPageProps {
  settings: AppSettings;
  onClose: () => void;
  onImported: () => void;
}

export default function ImportPage({ settings, onClose, onImported }: ImportPageProps) {
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [importedCount, setImportedCount] = useState(() => getImportedCount());

  // Listen for schedule-imported event from WebView (Tauri)
  useEffect(() => {
    let unlisten: (() => void) | null = null;
    (async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");
        const u = await listen<string>("schedule-imported", (event) => {
          handleParse(event.payload);
        });
        unlisten = u;
      } catch {
        // Not in Tauri environment
      }
    })();
    return () => { unlisten?.(); };
  }, []);

  function handleParse(htmlContent: string) {
    try {
      const courses = parseScheduleHtml(htmlContent);
      if (courses.length === 0) {
        setStatus("error");
        setMessage("未能解析到任何课程，请确认HTML内容是否包含课表");
        return;
      }
      saveImportedCourses(courses);
      setImportedCount(courses.length);
      setStatus("success");

      const uniqueNames = new Set(courses.map((c) => c.name));
      setMessage(`成功导入 ${courses.length} 条课程记录（${uniqueNames.size} 门课）`);
      onImported();
    } catch {
      setStatus("error");
      setMessage("解析失败，请检查HTML格式");
    }
  }

  function handlePasteImport() {
    if (!html.trim()) {
      setStatus("error");
      setMessage("请先粘贴HTML内容");
      return;
    }
    handleParse(html);
  }

  async function handleOpenWebView() {
    const url = settings.jwxtUrl;
    if (!url) {
      setStatus("error");
      setMessage("请先在「我的」页面设置教务系统地址");
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("open_jwxt", { url });
      setMessage("已打开教务系统，登录后在课表页面点击「导入课表」按钮");
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("无法打开WebView，请使用粘贴HTML方式导入");
    }
  }

  function handleClear() {
    clearImportedCourses();
    setImportedCount(0);
    setStatus("idle");
    setMessage("已清除导入的课表数据");
    onImported();
  }

  return (
    <div className="import-page">
      <div className="import-header">
        <button className="import-back" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="import-title">导入课表</span>
        <div style={{ width: 20 }} />
      </div>

      {importedCount > 0 && (
        <div className="import-status-bar">
          <span className="import-status-text">已导入 {importedCount} 条课程记录</span>
          <button className="import-clear-btn" onClick={handleClear}>清除</button>
        </div>
      )}

      <div className="import-section">
        <div className="import-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          方式一：WebView 打开教务系统
        </div>
        <p className="import-desc">
          打开教务系统网页，登录后进入课表页面，点击注入的「导入课表」按钮自动读取。
        </p>
        <button
          className="import-btn import-btn-primary"
          onClick={handleOpenWebView}
          disabled={!settings.jwxtUrl}
        >
          打开教务系统
        </button>
        {!settings.jwxtUrl && (
          <p className="import-hint">请先在「我的」页面设置教务系统地址</p>
        )}
      </div>

      <div className="import-divider">
        <span>或</span>
      </div>

      <div className="import-section">
        <div className="import-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          方式二：粘贴HTML
        </div>
        <p className="import-desc">
          在浏览器中打开教务系统课表页面，按 F12 打开开发者工具，复制整个页面HTML，粘贴到下方。
        </p>
        <textarea
          className="import-textarea"
          placeholder="在此粘贴课表页面的HTML内容..."
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
            setStatus("idle");
            setMessage("");
          }}
          rows={8}
        />
        <button
          className="import-btn import-btn-primary"
          onClick={handlePasteImport}
          disabled={!html.trim()}
        >
          解析并导入
        </button>
      </div>

      {message && (
        <div className={`import-message ${status}`}>
          {status === "success" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          {status === "error" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          )}
          {message}
        </div>
      )}
    </div>
  );
}
