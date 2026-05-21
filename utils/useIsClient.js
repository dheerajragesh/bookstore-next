import { useSyncExternalStore } from "react";

const subscribe = () => {
  return () => {};
};

export const useIsClient = () => {
  return useSyncExternalStore(subscribe, () => true, () => false);
};

