/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Token, ComponentBlock, Patch, ScanResult } from '../types/blueprint';
import { categorizeComponents, ComponentCategory } from '../utils/componentCategorizer';
import ComponentInspector from './ComponentInspector';

interface SidebarProps {
  tokens: Token[];
  components: ComponentBlock[];
  applyPatch: (patch: Patch) => void;
  isDarkMode: boolean;
  scanResults: ScanResult[];
  selectedComponent: ComponentBlock | null;
  onSelectComponent: (component: ComponentBlock | null) => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left font-bold text-stone-800 py-2 flex items-center justify-between">
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="pl-2 border-l-2 border-stone-200">{children}</div>}
    </div>
  );
};

export default function Sidebar({ 
  tokens, 
  components, 
  applyPatch, 
  isDarkMode, 
  scanResults, 
  selectedComponent, 
  onSelectComponent 
}: SidebarProps) {
  const groupedTokens = tokens.reduce((acc, token) => {
    let group = 'Component';
    if (token.tokenName.startsWith('--color-')) group = 'Foundation';
    if (token.tokenName.startsWith('--text-')) group = 'Text';
    if (token.tokenName.startsWith('--surface-')) group = 'Surface';
    if (!acc[group]) acc[group] = [];
    acc[group].push(token);
    return acc;
  }, {} as Record<string, Token[]>);

  const categorizedComponents = categorizeComponents(components);

  return (
    <div className="w-96 bg-stone-50 border-r border-stone-200 p-4 space-y-4 overflow-y-auto">
      <input type="text" placeholder="Search..." className="w-full px-2 py-1.5 text-sm border border-stone-300 rounded-md" />
      
      <CollapsibleSection title="🎨 Tokens">
        {Object.entries(groupedTokens).map(([group, groupTokens]) => (
          <CollapsibleSection key={group} title={group}>
            <div className="space-y-2 py-2">
              {groupTokens.map(token => (
                <div key={`${token.tokenName}-${token.scope}`} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700 font-mono">{token.tokenName}</span>
                  <input 
                    type="text" 
                    defaultValue={token.rawValue} 
                    onBlur={(e) => applyPatch({ type: 'token', tokenName: token.tokenName, scope: token.scope, newValue: e.target.value })}
                    className="w-32 text-sm text-right bg-white border border-stone-300 rounded-md px-2 py-1"
                  />
                </div>
              ))}
            </div>
          </CollapsibleSection>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="🧩 Components">
        {Object.entries(categorizedComponents).map(([category, comps]) => (
          <CollapsibleSection key={category} title={category}>
            <div className="space-y-1 py-2">
              {comps.map(comp => (
                <button 
                  key={`${comp.selectorName}-${comp.scope}`}
                  onClick={() => onSelectComponent(comp)}
                  className={`w-full text-left text-sm font-mono p-1 rounded-md ${selectedComponent === comp ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-stone-200'}`}>
                  {comp.selectorName} {comp.scope === 'dark' && '(dark)'}
                </button>
              ))}
            </div>
          </CollapsibleSection>
        ))}
      </CollapsibleSection>

      {selectedComponent && (
        <CollapsibleSection title={`Editing: ${selectedComponent.selectorName}`}>
          <ComponentInspector 
            selectedComponent={selectedComponent} 
            applyPatch={applyPatch} 
            isDarkMode={isDarkMode}
            components={components} // Pass all components for context if needed
          />
        </CollapsibleSection>
      )}

      {scanResults.length > 0 && (
        <CollapsibleSection title="🔍 System Integrity">
          <div className="mt-2 space-y-2 text-xs font-mono p-2 bg-white rounded-md border border-stone-200">
            {scanResults.map((result, i) => (
              <div key={i}>
                <p className="font-bold">{result.file}:{result.line}</p>
                <p>Found: <code className="bg-red-100 text-red-800 px-1 rounded">{result.pattern}</code></p>
                <p>Suggestion: {result.suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
