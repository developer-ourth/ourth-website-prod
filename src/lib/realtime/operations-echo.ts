"use client";

let echoInstance: any | null = null;

function parsePort(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function getOperationsEcho(): Promise<any | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  if (!key) {
    return null;
  }

  const host = process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost";
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http";
  const wsPort = parsePort(process.env.NEXT_PUBLIC_REVERB_PORT, scheme === "https" ? 443 : 8080);

  const [{ default: Echo }, { default: Pusher }] = await Promise.all([
    import("laravel-echo"),
    import("pusher-js"),
  ]);

  (window as any).Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort,
    wssPort: wsPort,
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
  });

  return echoInstance;
}