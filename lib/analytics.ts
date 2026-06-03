declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID ?? "";

/** Безопасно отправляет достижение цели в Яндекс.Метрику. */
export function ymGoal(target: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.ym || !YM_ID) return;
  window.ym(Number(YM_ID), "reachGoal", target, params);
}
