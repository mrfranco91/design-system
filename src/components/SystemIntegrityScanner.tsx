/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanResult } from '../types/blueprint';

interface SystemIntegrityScannerProps {
  scanResults: ScanResult[];
}

export default function SystemIntegrityScanner({ scanResults }: SystemIntegrityScannerProps) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-bold text-stone-600">System Integrity</h2>
      {scanResults.length === 0 && <p className="text-sm text-stone-500 mt-2">Upload a project .zip to scan for issues.</p>}
      {scanResults.length > 0 && (
        <div className="mt-2 space-y-2 text-xs font-mono p-2 bg-white rounded-md border border-stone-200">
          {scanResults.map((result, i) => (
            <div key={i}>
              <p className="font-bold">{result.file}:{result.line}</p>
              <p>Found: <code className="bg-red-100 text-red-800 px-1 rounded">{result.pattern}</code></p>
              <p>Suggestion: {result.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
