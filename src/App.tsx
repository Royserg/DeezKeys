import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { For, createSignal, onCleanup, onMount } from "solid-js";
import "./App.css";

// --- Move mouse on top of the application window ---
// `mouseenter` will gets triggered to get status of CapsLock
import { LogicalPosition, appWindow } from "@tauri-apps/api/window";
await appWindow.setCursorPosition(new LogicalPosition(50, 50));
// -----

const KEY_EVENT = "key-event";
interface KeyEvent {
  id: number;
  event: string;
  payload: {
    event_type: "KeyPress" | "KeyRelease";
    key: string;
  };
  windowLabel?: string;
}

function App() {
  const body = document.querySelector("body")!;

  const [isCapsLockOn, setIsCapsLockOn] = createSignal(false);
  const [keys, setKeys] = createSignal<string[]>([]);

  const mouseEventHandler = (e: MouseEvent) => {
    const isCapsLockOn = e.getModifierState("CapsLock");
    setIsCapsLockOn(isCapsLockOn);
    body.removeEventListener("mouseenter", mouseEventHandler);
  };

  let unlisten: UnlistenFn;
  onMount(async () => {
    // Mouse event - Workaround to find Modifier key state (CapsLock)
    // Should fire one time
    body.addEventListener("mouseenter", mouseEventHandler);

    // TODO: create key mapper -> display icons, strip away meta words
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      // console.log("EVENT: ", event);
      let clickedKey = event.payload.key;
      // Remove meta words
      if (clickedKey === "Escape") {
        clickedKey = "Esc";
      } else {
        clickedKey = clickedKey.replace("Key", "").replace("Num", "");
      }

      if (clickedKey === "CapsLock") {
        if (event.payload.event_type === "KeyPress") {
          setIsCapsLockOn(true);
        }
        if (event.payload.event_type === "KeyRelease") {
          setIsCapsLockOn(false);
        }
      }

      const updatedKeys = keys();
      if (updatedKeys.length > 3) {
        updatedKeys.pop();
      }

      setKeys([clickedKey, ...updatedKeys]);
    });
  });

  onCleanup(() => {
    unlisten();
  });

  return (
    <div class="container">
      <div>Caps: {isCapsLockOn() ? "ON" : "OFF"}</div>

      <div class="row">
        <For each={keys()}>
          {(item, idx) => (
            <span class={idx() === 0 ? "bigger" : ""}>{item} &nbsp;</span>
          )}
        </For>
      </div>
    </div>
  );
}

export default App;
