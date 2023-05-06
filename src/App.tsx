import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

// Register shortcuts
// NOTE: it overrides the native key actions
// import { registerAll } from "@tauri-apps/api/globalShortcut";
// await registerAll(
//   ["CommandOrControl+Shift+C", "Ctrl+Alt+F12", "Z", "G"],
//   (shortcut) => {
//     console.log(`Shortcut ${shortcut} triggered`);
//   }
// );

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <div class="container">
      <h1>DeezKeys</h1>

      <div class="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>

      <p>{greetMsg()}</p>
    </div>
  );
}

export default App;
