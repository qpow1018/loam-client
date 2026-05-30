type TTauriCore = {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
};

type TTauriWindow = Window & {
  __TAURI__?: {
    core?: TTauriCore;
  };
};

export function getTauriCore(): TTauriCore | null {
  if (typeof window === 'undefined') return null;

  return (window as TTauriWindow).__TAURI__?.core ?? null;
}

export function isTauriAvailable(): boolean {
  return getTauriCore() !== null;
}
