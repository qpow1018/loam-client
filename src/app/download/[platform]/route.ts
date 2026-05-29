import { redirect } from 'next/navigation';

import packageInfo from '../../../../package.json';

const RELEASE_BASE_URL = 'https://github.com/qpow1018/loam-client/releases/latest/download';

const DOWNLOAD_ASSETS = {
  mac: `LoaM_${packageInfo.version}_universal.dmg`,
  windows: `LoaM_${packageInfo.version}_x64-setup.exe`,
} as const;

type TDownloadPlatform = keyof typeof DOWNLOAD_ASSETS;

function isDownloadPlatform(platform: string): platform is TDownloadPlatform {
  return platform in DOWNLOAD_ASSETS;
}

export async function GET(_: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;

  if (!isDownloadPlatform(platform)) redirect('/settings');

  redirect(`${RELEASE_BASE_URL}/${DOWNLOAD_ASSETS[platform]}`);
}
