import { action, atom } from "nanostores";

export const isCapsLockOn = atom<boolean>(false);

// this methods doesn't seem to work - INVESTIGATE
export const setCapsLockStatus = (val: boolean) => {
  action(isCapsLockOn, "switch", (store) => {
    console.log("SETTING NEW CAPS LOCK", val);
    store.set(val);
  });
};

export const setCapsLockOn = action(isCapsLockOn, "switchOn", (store) => {
  store.set(true);
});
export const setCapsLockOff = action(isCapsLockOn, "switchOff", (store) => {
  store.set(false);
});
