#!/usr/bin/env node
// Dev-only QA helper for the pretty skill. Injects a sample-markup file into a
// fresh copy of shell.html and writes a ready-to-open verification page.
// Usage: node scripts/verify-pretty.mjs <sample-markup-file> [out.html]
import { readFileSync, writeFileSync } from 'node:fs';

const [, , sampleArg, outArg] = process.argv;
if (!sampleArg) {
  console.error('Usage: node scripts/verify-pretty.mjs <sample.html> [out.html]');
  process.exit(1);
}
const shellPath = new URL('../skills/pretty/assets/shell.html', import.meta.url);
const shell = readFileSync(shellPath, 'utf8');
const sample = readFileSync(sampleArg, 'utf8');
const marker = '<div class="container">';
if (!shell.includes(marker)) {
  console.error('container marker not found in shell.html');
  process.exit(1);
}
const out = outArg || '/tmp/pretty-verify.html';
writeFileSync(out, shell.replace(marker, marker + '\n' + sample + '\n'));
console.log(out);
