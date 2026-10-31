#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const rootDir = process.cwd();
const epochsPath = path.join(rootDir, 'src/game/epochs.ts');
const manifestPath = path.join(rootDir, 'public/version-manifest.json');
const pkgPath = path.join(rootDir, 'package.json');

const epochsSource = fs.readFileSync(epochsPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const contentHash = crypto
  .createHash('sha256')
  .update(epochsSource)
  .digest('hex')
  .slice(0, 16);

const releaseAssets = {
  androidApk: 'Shahnameh-Crown-of-Ash-and-Light-android.apk',
  windowsExe: 'Shahnameh-Crown-of-Ash-and-Light-windows-x64.exe',
  windowsPortableZip: 'Shahnameh-Crown-of-Ash-and-Light-windows-x64-portable.zip',
  linuxTarGz: 'Shahnameh-Crown-of-Ash-and-Light-linux-x64.tar.gz',
  macosZip: 'Shahnameh-Crown-of-Ash-and-Light-macos-x64.zip',
  webPwaZip: 'Shahnameh-Crown-of-Ash-and-Light-web-pwa.zip',
  checksumsTxt: 'SHA256SUMS.txt',
};

const updatedManifest = {
  ...existingManifest,
  currentVersion: `${pkg.version}-production`,
  releaseTag: `v${pkg.version}`,
  integritySha256: contentHash,
  totalEpochs: existingManifest.versions.length,
  buildReady: true,
  releaseAssets,
};

fs.writeFileSync(
  manifestPath,
  JSON.stringify(updatedManifest, null, 2) + '\n',
  'utf8',
);

console.log(
  `[Shahnameh Manifest] Updated public/version-manifest.json -> v${pkg.version} (${updatedManifest.totalEpochs} epochs, hash: ${contentHash})`,
);
