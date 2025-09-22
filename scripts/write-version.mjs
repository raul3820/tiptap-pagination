#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

(function main() {
  // Read package.json
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  const version = packageJson.version;

  // Get git short SHA
  let commit = 'unknown';
  try {
    commit = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.warn('Could not get git SHA:', error.message);
  }

  // Get current timestamp
  const builtAt = new Date().toISOString();

  // Create version details
  const versionData = {
    version,
    builtAt,
    commit
  };

  // Write version.json
  writeFileSync('./public/version.json', JSON.stringify(versionData, null, 2));
  console.log('Generated public/version.json:', JSON.stringify(versionData, null, 2));

  // Create/update .env.local with VITE_APP_VERSION
  const envVar = `VITE_APP_VERSION=${version}-${commit}-${new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').split('.')[0]}\n`;
  writeFileSync('.env.local', envVar);
  console.log('Generated .env.local with:', envVar.trim());
})();