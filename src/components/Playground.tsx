/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentBlock } from '../types/blueprint';
import { categorizeComponents } from '../utils/componentCategorizer';

interface PlaygroundProps {
  css: string | null;
  isDarkMode: boolean;
  components: ComponentBlock[];
  onSelectComponent: (component: ComponentBlock) => void;
  selectedComponent: ComponentBlock | null;
}



export default function Playground({ css, isDarkMode, components, onSelectComponent, selectedComponent }: PlaygroundProps) {
  const categorizedComponents = categorizeComponents(components);
  return (
    <div className="flex-1 p-8 bg-stone-100 overflow-y-auto">
      <style>{css}</style>
      <div id="playground-root" className={`bg-white h-full w-full shadow-inner rounded-lg p-8 space-y-8 ${isDarkMode ? 'dark' : ''}`}>
        {!css && <p className="text-center text-stone-500">Upload a Blueprint CSS file to begin.</p>}
        {css && Object.entries(categorizedComponents).map(([category, comps]) => (
          <div key={category}>
            <h2 className="text-lg font-bold text-stone-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comps.map(comp => (
                <div 
                  key={`${comp.selectorName}-${comp.scope}`}
                  className={`p-4 bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-colors ${selectedComponent === comp ? 'border-indigo-500 bg-indigo-50' : 'border-stone-200 hover:border-indigo-400'}`}
                  onClick={() => onSelectComponent(comp)}
                >
                  <p className="text-xs font-mono text-stone-500">{comp.selectorName}</p>
                  <div className="mt-2 flex items-center justify-center p-4 min-h-[60px]">
                    <div className={comp.selectorName}>
                      {comp.selectorName.includes('btn') && <span className="bp-bottomnav-icon">★</span>}
                      {comp.selectorName.includes('nav') ? <span className="bp-bottomnav-label">Item</span> : 'Preview'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
