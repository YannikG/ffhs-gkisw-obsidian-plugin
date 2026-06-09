#!/usr/bin/env node
/**
 * Semi-automated Markdown validation for generated summary files (P11-I03).
 *
 * Checks:
 *   1. No unclosed code fences (``` or ~~~)
 *   2. No torn inline math — lone $ not part of a valid $...$ pair on the same line
 *   3. No broken display math — $$ opened but not closed within the file
 *
 * Usage:
 *   node scripts/check-markdown.mjs <path-to-summary.md>
 *
 * Exit 0 = all checks passed. Exit 1 = one or more issues found.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/check-markdown.mjs <path-to-summary.md>');
  process.exit(1);
}

let content;
try {
  content = readFileSync(resolve(filePath), 'utf8');
} catch (err) {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
}
const lines = content.split('\n');

const issues = [];

// --- Check 1 + 3: unclosed code fences, torn inline math and display math (single pass) ---
// Inline math check and display-math counting skip lines inside code fences and
// ignore inline code segments (backticks) as well as escaped dollars (\$).
let inCodeFence = false;
let codeFenceChar = '';
let codeFenceOpenLine = -1;
let displayMathCount = 0; // count of $$ occurrences outside code fences/inline-code

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const tripleBacktick = line.trimStart().startsWith('```');
  const tildeFence = line.trimStart().startsWith('~~~');

  if (!inCodeFence) {
    if (tripleBacktick) {
      inCodeFence = true;
      codeFenceChar = '```';
      codeFenceOpenLine = i + 1;
    } else if (tildeFence) {
      inCodeFence = true;
      codeFenceChar = '~~~';
      codeFenceOpenLine = i + 1;
    }
  } else {
    if (tripleBacktick && codeFenceChar === '```') {
      inCodeFence = false;
    } else if (tildeFence && codeFenceChar === '~~~') {
      inCodeFence = false;
    }
  }

  // Skip any checks for lines that are fence delimiters or inside code fences.
  if (inCodeFence || tripleBacktick || tildeFence) {
    continue;
  }

  // Remove inline code segments (backticks) to avoid false positives from `$` in code.
  // This removes simple inline code spans like `...` (multiple occurrences handled).
  let cleaned = line.replace(/`[^`]*`/g, '');

  // Remove escaped dollars (\$) which are not math markers.
  cleaned = cleaned.replace(/(^|[^\\\\/])(\\\\\\)*\\\\\\$/g, '$1$2');

  // Count display-math markers ($$) on this cleaned line and accumulate.
  const dmMatches = cleaned.match(/\$\$/g) ?? [];
  displayMathCount += dmMatches.length;

  // For inline math heuristic, remove $$ pairs so they aren't counted as single $.
  const withoutDouble = cleaned.replace(/\$\$/g, '');

  // Now count single $ characters. Odd number likely indicates torn inline math.
  const dollarCount = (withoutDouble.match(/\$/g) ?? []).length;
  if (dollarCount % 2 !== 0) {
    issues.push(
      `Line ${i + 1}: odd number of $ signs — possible torn inline math. Content: "${line.trim().slice(0, 80)}"`,
    );
  }
}
if (inCodeFence) {
  issues.push(`Unclosed code fence (${codeFenceChar}) opened at line ${codeFenceOpenLine}.`);
}

// --- Check 2: torn display math ($$ not closed) ---
// Use the per-line accumulated count to avoid counting $$ inside code fences or
// inside inline code segments.
if (displayMathCount % 2 !== 0) {
  issues.push(
    `Odd number of $$ markers (${displayMathCount}) — display math block likely unclosed.`,
  );
}

// --- Report ---
if (issues.length === 0) {
  console.log('✓ All Markdown checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  process.exit(1);
}
