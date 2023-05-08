import { action, atom } from "nanostores";

// -- Store
export const isCapsLockOn = atom<boolean>(false);
// -- Actions
export const setCapsLockStatus = action(
  isCapsLockOn,
  "switch",
  (store, val: boolean) => {
    store.set(val);
  }
);
