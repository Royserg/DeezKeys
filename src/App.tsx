import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { For, createSignal, onCleanup, onMount } from "solid-js";
import "./App.css";
import { Modifiers } from "./components/modifiers";
import { setCapsLockStatus } from "./stores/modifiers";

// TODO: EXTRACT TO INTERFACES
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
  const [keys, setKeys] = createSignal<string[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
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

      // Caps
      if (clickedKey === "CapsLock") {
        if (event.payload.event_type === "KeyPress") {
          setCapsLockStatus(true);
        }
        if (event.payload.event_type === "KeyRelease") {
          setCapsLockStatus(false);
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
    <div class="container p-1">
      <Modifiers />

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
