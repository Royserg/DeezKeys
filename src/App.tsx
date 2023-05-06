import { For, createSignal, onCleanup, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { UnlistenFn, listen } from "@tauri-apps/api/event";

const KEY_EVENT = "key-event";
interface KeyEvent {
  id: number;
  event: string;
  payload: {
    event_type: string;
    key: string;
  };
  windowLabel?: string;
}

function App() {
  // TODO: need to check on app init if CapsLock was flipped
  const [isCapsLockOn, setIsCapsLockOn] = createSignal(false);
  const [keys, setKeys] = createSignal<string[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      // console.log("EVENT: ", event);
      let clickedKey = event.payload.key;
      // Remove meta words
      if (clickedKey === "Escape") {
        clickedKey = "Esc";
      } else {
        clickedKey = clickedKey.replace("Key", "").replace("Num", "");
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
      <div class="row">
        <For each={keys()}>{(item) => <span>{item} &nbsp;</span>}</For>
      </div>
    </div>
  );
}

export default App;
