use serde::Serialize;
use std::{fs, path::PathBuf};
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AutoBackupResult {
    file_path: String,
    deleted_count: usize,
}

fn normalize_backup_file_name(file_name: &str) -> Result<String, String> {
    let name = PathBuf::from(file_name)
        .file_name()
        .and_then(|name| name.to_str())
        .ok_or_else(|| "백업 파일 이름이 올바르지 않습니다.".to_string())?
        .to_string();

    if !name.starts_with("loam-backup-") || !name.ends_with(".json") {
        return Err("백업 파일 이름이 올바르지 않습니다.".to_string());
    }

    Ok(name)
}

#[tauri::command]
async fn select_auto_backup_directory(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let folder = app.dialog().file().blocking_pick_folder();
    match folder {
        Some(folder) => folder
            .into_path()
            .map(|path| Some(path.to_string_lossy().into_owned()))
            .map_err(|error| error.to_string()),
        None => Ok(None),
    }
}

#[tauri::command]
fn write_auto_backup(
    directory_path: String,
    file_name: String,
    payload: serde_json::Value,
    retention_count: usize,
) -> Result<AutoBackupResult, String> {
    let file_name = normalize_backup_file_name(&file_name)?;
    let backup_dir = PathBuf::from(directory_path);

    if !backup_dir.is_dir() {
        return Err("자동백업 폴더를 찾을 수 없습니다.".to_string());
    }

    fs::create_dir_all(&backup_dir).map_err(|error| error.to_string())?;

    let backup_path = backup_dir.join(file_name);
    let content = serde_json::to_string_pretty(&payload).map_err(|error| error.to_string())?;
    fs::write(&backup_path, content).map_err(|error| error.to_string())?;

    let mut backup_files = fs::read_dir(&backup_dir)
        .map_err(|error| error.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if !file_name.starts_with("loam-backup-") || !file_name.ends_with(".json") {
                return None;
            }

            let modified = entry.metadata().ok()?.modified().ok()?;
            Some((entry.path(), modified))
        })
        .collect::<Vec<_>>();

    backup_files.sort_by(|a, b| b.1.cmp(&a.1));

    let mut deleted_count = 0;
    for (path, _) in backup_files.into_iter().skip(retention_count.max(1)) {
        if fs::remove_file(path).is_ok() {
            deleted_count += 1;
        }
    }

    Ok(AutoBackupResult {
        file_path: backup_path.to_string_lossy().into_owned(),
        deleted_count,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            select_auto_backup_directory,
            write_auto_backup
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
