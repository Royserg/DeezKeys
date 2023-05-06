use std::thread;

use macos::Event;
// use rdev::{listen, Event, EventType};
use tauri::{AppHandle, Error, GlobalShortcutManager, Manager};

#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "macos")]
use crate::macos::listen as macos_listen;
#[cfg(target_os = "macos")]
use crate::macos::EventType;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn macos_callback(event: Event) {
    println!("My callback {:?}", event);
    match event.name {
        Some(string) => {
            // println!("EventName: {}", &string);
        }
        None => {
            match event.event_type {
                EventType::KeyPress(key) => {
                    println!("KeyPress: {:?}", key)
                }
                EventType::KeyRelease(key) => {
                    println!("KeyRelease: {:?}", key)
                    // let key_str = format!("{:?}", key);
                    // emit("KeyRelease", &key_str);
                }
                _ => {}
            }
        }
    }
}

fn main() {
    // let q_shortcut = "Q";

    tauri::Builder::default()
        .setup(|app| {
            // let app_handle = app.app_handle().to_owned();
            // app_handle.get_window("main").unwrap().close().unwrap();

            #[cfg(target_os = "linux")]
            thread::spawn(|| {
                println!("We are on linux");
            });

            #[cfg(target_os = "macos")]
            thread::spawn(|| {
                if let Err(error) = macos_listen(macos_callback) {
                    println!("Error: {:?}", error);
                }
            });

            // app.global_shortcut_manager()
            //     .register(q_shortcut, move || {
            //         // TODO: handle possible error
            //         // open_url_preview(&app_handle);
            //         println!("Q was PRESSED")
            //     })
            //     .unwrap();
            // rdev key listener
            // if let Err(error) = listen(callback) {
            //     println!("Error: {:?}", error)
            // }

            Ok(())
        })
        // .invoke_handler(tauri::generate_handler![greet])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        })
}
