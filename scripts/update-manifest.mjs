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

const updatedManifest = {
  ...existingManifest,
  currentVersion: `${pkg.version}-production`,
  integritySha256: contentHash,
  totalEpochs: existingManifest.versions.length,
  buildReady: true,
};

fs.writeFileSync(
  manifestPath,
  JSON.stringify(updatedManifest, null, 2) + '\n',
  'utf8',
);

console.log(
  `[Shahnameh Manifest] Updated public/version-manifest.json -> v${pkg.version} (${updatedManifest.totalEpochs} epochs, hash: ${contentHash})`,
);
