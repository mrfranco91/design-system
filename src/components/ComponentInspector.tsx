/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentBlock, Patch } from '../types/blueprint';

interface ComponentInspectorProps {
  components: ComponentBlock[];
  selectedComponent: ComponentBlock | null;
  applyPatch: (patch: Patch) => void;
  isDarkMode: boolean;
}

export default function ComponentInspector({ components, selectedComponent, applyPatch, isDarkMode }: ComponentInspectorProps) {
  return (
    <div className="w-80 bg-stone-50 border-l border-stone-200 p-4 space-y-6 overflow-y-auto">
      <h2 className="text-sm font-bold text-stone-600">Component Inspector</h2>
      {!selectedComponent && <p className="text-sm text-stone-500">Click a component in the playground to inspect it.</p>}
      {selectedComponent && (
        <div>
          <h3 className="text-sm font-mono font-bold text-indigo-600">{selectedComponent.selectorName}</h3>
          <div className="mt-2 space-y-2">
            {selectedComponent.properties.map(prop => (
              <div key={prop.name} className="flex items-center justify-between">
                <span className="text-sm text-stone-700 font-mono">{prop.name}</span>
                <input 
                  type="text" 
                  defaultValue={prop.value} 
                  onBlur={(e) => applyPatch({
                    type: 'component',
                    selectorName: selectedComponent.selectorName,
                    scope: selectedComponent.scope,
                    property: prop.name,
                    newValue: e.target.value,
                  })}
                  className="w-40 text-sm text-right bg-white border border-stone-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
