import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { Component, For, createSignal, onCleanup, onMount } from 'solid-js';
import './App.css';
import { Modifiers } from './components/modifiers';
import { handleClickedKey } from './services/keys';
import { KEY_EVENT, KeyEvent } from './interfaces/key.interface';

function App() {
  const [keys, setKeys] = createSignal<string[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      const updatedKeys = keys();
      if (updatedKeys.length > 5) {
        updatedKeys.pop();
      }

      setKeys([clickedKey, ...updatedKeys]);
    });
  });

  onCleanup(() => {
    unlisten();
  });

  return (
    <div class='container p-1'>
      <Modifiers />

      <div class='flex flex-row-reverse gap-x-0.5'>
        <For each={keys()}>
          {(item, idx) => <ClickedKey key={item}></ClickedKey>}
        </For>
      </div>
    </div>
  );
}

export default App;

// -- ClickedKey
interface ClickedKeyProps {
  key: string;
}
const ClickedKey: Component<ClickedKeyProps> = (props) => {
  return (
    <div class='p-2 border-2 border-solid border-slate-300 rounded-md w-10 flex justify-center items-center bg-slate-200'>
      {props.key}
    </div>
  );
};
