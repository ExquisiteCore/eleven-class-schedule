use tauri::Emitter;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_jwxt(app: tauri::AppHandle, url: String) -> Result<(), String> {
    use tauri::webview::WebviewWindowBuilder;

    let init_script = r#"
        (function() {
            function addImportButton() {
                if (document.getElementById('__import_btn')) return;
                var btn = document.createElement('button');
                btn.id = '__import_btn';
                btn.textContent = '\u5BFC\u5165\u8BFE\u8868';
                btn.style.cssText = 'position:fixed;bottom:50%;left:50%;transform:translate(-50%,50%);z-index:99999;' +
                    'padding:16px 40px;background:#3478f6;color:#fff;border:none;border-radius:16px;' +
                    'font-size:18px;font-weight:700;box-shadow:0 6px 24px rgba(52,120,246,0.5);' +
                    'cursor:pointer;font-family:system-ui;';
                btn.addEventListener('click', function() {
                    try {
                        var html = document.documentElement.outerHTML;
                        window.__TAURI_INTERNALS__.invoke('receive_schedule_html', { html: html });
                        btn.textContent = '\u5DF2\u53D1\u9001!';
                        btn.style.background = '#34c759';
                        setTimeout(function() {
                            btn.textContent = '\u5BFC\u5165\u8BFE\u8868';
                            btn.style.background = '#3478f6';
                        }, 2000);
                    } catch(e) {
                        btn.textContent = '\u5931\u8D25: ' + e.message;
                        btn.style.background = '#ff3b30';
                        setTimeout(function() {
                            btn.textContent = '\u5BFC\u5165\u8BFE\u8868';
                            btn.style.background = '#3478f6';
                        }, 3000);
                    }
                });
                document.body.appendChild(btn);
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addImportButton);
            } else {
                addImportButton();
            }
        })();
    "#;

    WebviewWindowBuilder::new(&app, "jwxt", tauri::WebviewUrl::External(url.parse().map_err(|e: url::ParseError| e.to_string())?))
        .initialization_script(init_script)
        .build()
        .map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn receive_schedule_html(app: tauri::AppHandle, html: String) -> Result<(), String> {
    app.emit("schedule-imported", html).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, open_jwxt, receive_schedule_html])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
