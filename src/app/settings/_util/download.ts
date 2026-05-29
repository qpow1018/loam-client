export const DOWNLOAD_OPTIONS = {
  mac: {
    label: 'macOS',
    url: '/download/mac',
  },
  windows: {
    label: 'Windows',
    url: '/download/windows',
  },
} as const;

export type TDownloadPlatform = keyof typeof DOWNLOAD_OPTIONS;

export function getDownloadPlatform(): TDownloadPlatform | null {
  if (typeof navigator === 'undefined') return null;

  const normalizedPlatform = navigator.platform.toLowerCase();

  if (normalizedPlatform.includes('mac')) return 'mac';
  if (normalizedPlatform.includes('win')) return 'windows';

  return null;
}

function getPrimaryDownload(platform: TDownloadPlatform | null) {
  return platform === null ? null : DOWNLOAD_OPTIONS[platform];
}

export function getDownloadLabel(platform: TDownloadPlatform | null) {
  const primaryDownload = getPrimaryDownload(platform);
  return primaryDownload === null ? '지원 OS 아님' : `${primaryDownload.label} 다운로드`;
}

export function getDownloadUrl(platform: TDownloadPlatform | null) {
  const primaryDownload = getPrimaryDownload(platform);
  return primaryDownload?.url ?? null;
}

export function subscribeDownloadPlatformStore() {
  return () => undefined;
}
