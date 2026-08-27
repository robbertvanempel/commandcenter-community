import "server-only";

const COLLECTION_INTERVAL_MS = 15 * 60 * 1000;
const STARTUP_DELAY_MS = 5_000;

declare global {
  var commandCenterCollectorTimer: NodeJS.Timeout | undefined;
  var commandCenterCollectorStartupTimer: NodeJS.Timeout | undefined;
  var commandCenterCollectorRunning: boolean | undefined;
}

function localBaseUrl() {
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

async function refreshAllCollectors() {
  if (globalThis.commandCenterCollectorRunning) return;
  globalThis.commandCenterCollectorRunning = true;
  try {
    const baseUrl = localBaseUrl();
    await Promise.allSettled([
      "/api/live/industry?refresh=1",
      "/api/live/mentions?refresh=1",
      "/api/live/audience",
      "/api/live/newsletters?refresh=1",
    ].map(async (path) => {
      const response = await fetch(`${baseUrl}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(path.startsWith("/api/live/newsletters") ? 300_000 : 60_000),
      });
      await response.body?.cancel();
    }));
  } finally {
    globalThis.commandCenterCollectorRunning = false;
  }
}

export function startLocalCollectorScheduler() {
  if (globalThis.commandCenterCollectorTimer || globalThis.commandCenterCollectorStartupTimer) return;
  globalThis.commandCenterCollectorStartupTimer = setTimeout(() => {
    globalThis.commandCenterCollectorStartupTimer = undefined;
    void refreshAllCollectors();
    globalThis.commandCenterCollectorTimer = setInterval(() => void refreshAllCollectors(), COLLECTION_INTERVAL_MS);
    globalThis.commandCenterCollectorTimer.unref();
  }, STARTUP_DELAY_MS);
  globalThis.commandCenterCollectorStartupTimer.unref();
}
