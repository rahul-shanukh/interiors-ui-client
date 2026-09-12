//src/shared/hooks/useScrollState.ts

import { useSyncExternalStore } from "react";

/**
 * A highly scalable, performant custom hook for tracking window scroll state.
 * Uses React 18's useSyncExternalStore to prevent re-render tearing.
 * 
 * @param threshold The scroll Y value in pixels to trigger a 'true' state.
 * @returns boolean indicating if the window has been scrolled past the threshold.
 */
export const useScrollState = (threshold: number = 20): boolean => {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("scroll", callback);
      return () => window.removeEventListener("scroll", callback);
    },
    () => window.scrollY > threshold,
    // Optional: Server snapshot for SSR  compatibility if ever needed
    () => false 
  );
};
