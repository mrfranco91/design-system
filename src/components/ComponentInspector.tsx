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

import { useState } from 'react';

const availableProperties = [
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'display', 'gap', 'align-items', 'justify-content',
  'background-color', 'background-image', 'background-size', 'background-repeat', 'background-position',
  'border-width', 'border-style', 'border-color', 'border-radius',
  'color', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'stroke-width', 'fill',
];

export default function ComponentInspector({ selectedComponent, applyPatch, isDarkMode }: ComponentInspectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProp, setNewProp] = useState('');
  const [overrideWarning, setOverrideWarning] = useState<string | null>(null);

  if (!selectedComponent) return null;

  const handleAddProperty = () => {
    if (newProp && !selectedComponent.properties.some(p => p.name === newProp)) {
      applyPatch({
        type: 'component-add-prop',
        selectorName: selectedComponent.selectorName,
        scope: selectedComponent.scope,
        property: newProp,
        newValue: ' ' // Default value
      });
    }
    setIsAdding(false);
    setNewProp('');
  };

  return (
    <div className="p-2">
      {overrideWarning && <div className="p-2 mb-2 text-sm text-amber-800 bg-amber-100 border border-amber-200 rounded-md">{overrideWarning}</div>}
      <div className="space-y-2">
        {selectedComponent.properties.map(prop => (
          <div key={prop.name} className="flex items-center justify-between">
            <span className="text-sm text-stone-700 font-mono">{prop.name}</span>
            <input 
              type="text" 
              defaultValue={prop.value} 
onBlur={(e) => {
                const playgroundElement = document.querySelector(`#playground-root .${selectedComponent.selectorName.replace(/\./g, '')}`);
                if (playgroundElement) {
                  const initialValue = getComputedStyle(playgroundElement).getPropertyValue(prop.name);
                  applyPatch({
                    type: 'component-edit-prop',
                    selectorName: selectedComponent.selectorName,
                    scope: selectedComponent.scope,
                    property: prop.name,
                    newValue: e.target.value,
                  });
                  setTimeout(() => {
                    const finalValue = getComputedStyle(playgroundElement).getPropertyValue(prop.name);
                    if (initialValue === finalValue) {
                      setOverrideWarning(`Property '${prop.name}' might be overridden.`);
                    } else {
                      setOverrideWarning(null);
                    }
                  }, 100);
                } else {
                  applyPatch({
                    type: 'component-edit-prop',
                    selectorName: selectedComponent.selectorName,
                    scope: selectedComponent.scope,
                    property: prop.name,
                    newValue: e.target.value,
                  });
                }
              }}
              className="w-40 text-sm text-right bg-white border border-stone-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        {isAdding ? (
          <div className="flex gap-2">
            <select 
              value={newProp}
              onChange={(e) => setNewProp(e.target.value)}
              className="flex-1 text-sm bg-white border border-stone-300 rounded-md px-2 py-1"
            >
              <option value="">Select a property</option>
              {availableProperties.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={handleAddProperty} className="px-2 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md">Add</button>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
            + Add Property
          </button>
        )}
      </div>
    </div>
  );
}
