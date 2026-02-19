/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanResult } from '../types/blueprint';

import JSZip from 'jszip';

const SCAN_PATTERNS = [
  { pattern: /bg-white/, suggestion: 'use bg-card' },
  { pattern: /text-black/, suggestion: 'use text-foreground' },
  { pattern: /bg-slate-/, suggestion: 'use a surface token' },
  { pattern: /text-gray-/, suggestion: 'use a text token' },
  { pattern: /border-gray-/, suggestion: 'use a border token' },
  { pattern: /style={{ color: "#" }}/, suggestion: 'use a text token' },
  { pattern: /style={{ backgroundColor: "rgb\(" }}/, suggestion: 'use a surface token' },
  { pattern: /rounded-lg/, suggestion: 'use a border-radius token' },
  { pattern: /rounded-xl/, suggestion: 'use a border-radius token' },
  { pattern: /borderRadius:/, suggestion: 'use a border-radius token' },
  { pattern: /dark:bg-/, suggestion: 'use dark mode tokens' },
  { pattern: /dark:text-/, suggestion: 'use dark mode tokens' },
];

export async function scanProject(zipFile: File): Promise<ScanResult[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const results: ScanResult[] = [];

  for (const [relativePath, file] of Object.entries(zip.files)) {
    if (file.dir || !/\.(tsx|jsx|ts|js|css)$/.test(relativePath)) {
      continue;
    }

    const content = await file.async('string');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      for (const { pattern, suggestion } of SCAN_PATTERNS) {
        if (pattern.test(line)) {
          results.push({
            file: relativePath,
            line: index + 1,
            pattern: pattern.source,
            suggestion,
          });
        }
      }
    });
  }

  return results;
}
