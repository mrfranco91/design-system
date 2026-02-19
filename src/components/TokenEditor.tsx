/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Token } from '../types/blueprint';

import { Patch } from '../types/blueprint';

interface TokenEditorProps {
  tokens: Token[];
  applyPatch: (patch: Patch) => void;
  isDarkMode: boolean;
}

export default function TokenEditor({ tokens, applyPatch, isDarkMode }: TokenEditorProps) {
  const groupedTokens = tokens.reduce((acc, token) => {
    let group = 'Component';
    if (token.tokenName.startsWith('--color-')) group = 'Foundation';
    if (token.tokenName.startsWith('--text-')) group = 'Text';
    if (token.tokenName.startsWith('--surface-')) group = 'Surface';

    if (!acc[group]) acc[group] = [];
    acc[group].push(token);
    return acc;
  }, {} as Record<string, Token[]>);

  return (
    <div className="w-80 bg-stone-50 border-r border-stone-200 p-4 space-y-6 overflow-y-auto">
      <h2 className="text-sm font-bold text-stone-600">Token Editor</h2>
      {tokens.length === 0 && <p className="text-sm text-stone-500">No tokens found.</p>}
      <div className="space-y-4">
        {Object.entries(groupedTokens).map(([group, tokens]) => (
          <div key={group}>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{group}</h3>
            <div className="space-y-2">
              {tokens.map(token => (
                <div key={`${token.tokenName}-${token.scope}`} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700 font-mono">{token.tokenName}</span>
                  <input 
                    type="text" 
                    defaultValue={token.rawValue} 
                    onBlur={(e) => applyPatch({
                      type: 'token',
                      tokenName: token.tokenName,
                      scope: isDarkMode && tokens.some(t => t.tokenName === token.tokenName && t.scope === 'dark') ? 'dark' : 'root',
                      newValue: e.target.value,
                    })}
                    className="w-32 text-sm text-right bg-white border border-stone-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
