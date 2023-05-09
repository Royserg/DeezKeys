import { KeyEventType } from "../interfaces/key.interface";
import { setCapsLockStatus } from "../stores/modifiers";

export const handleClickedKey = (data: {
  keyName: string;
  eventType: KeyEventType;
}): string => {
  const { keyName, eventType } = data;

  // Handle modifiers: CapsLock, [Shift], [Ctrl]
  // - Caps
  {
    if (keyName === "CapsLock") {
      if (eventType === "KeyPress") {
        setCapsLockStatus(true);
      }
      if (eventType === "KeyRelease") {
        setCapsLockStatus(false);
      }
    }
  }
  // - Shift?
  // - Ctrl?
  // - Fn?

  // Map to symbol that will be displayed
  const keySymbol = mapKeyToSymbol(keyName);

  return keySymbol;
};

const mapKeyToSymbol = (keyName: string): string => {
  const mappedToSymbol = keyNameToSymbolMap[keyName] || keyName;
  return mappedToSymbol;
};

// TODO: add Windows / MacOS symbols
const keyNameToSymbolMap: { [key: string]: string } = {
  Escape: "Esc",
  CapsLock: "⇪",
  Space: "␣",
  Backspace: "⌫",
  Return: "⏎",
  ShiftRight: "⇧",
  ShiftLeft: "⇧",
  ControlLeft: "⌃",
  ControlRight: "⌃",
  MetaLeft: "⌘",
  MetaRight: "⌘",
  Alt: "⌥",
  Tab: "⇥",
  // TODO: Finish all the other keys (Copilot?)
  // --- Letter keys
  KeyA: "a",
  KeyB: "b",
  KeyC: "c",
  KeyD: "d",
  // --- Num keys
  Num1: "1",
  Num2: "2",
  // --- Extras
  RightArrow: "→ ",
  LeftArrow: "←",
  UpArrow: "↑",
  DownArrow: "↓",
};
