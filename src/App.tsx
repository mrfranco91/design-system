/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ComponentInspector from './components/ComponentInspector';
import Playground from './components/Playground';
import SystemIntegrityScanner from './components/SystemIntegrityScanner';
import TokenEditor from './components/TokenEditor';
import TopBar from './components/TopBar';
import { useBlueprint } from './hooks/useBlueprint';
import { Token, ComponentBlock, ScanResult } from './types/blueprint';

export default function App() {
  const {
    selectedComponent,
    setSelectedComponent,
    applyPatch,
    isDarkMode,
    toggleDarkMode,
    originalCssText,
    tokens,
    components,
    patches,
    scanResults,
    handleCssUpload,
    handleProjectUpload,
    undo,  
    redo,
    reset,
    getPatchedCss,
  } = useBlueprint();

  return (
    <div className="h-screen w-screen bg-stone-100 text-stone-800 flex flex-col font-sans">
      <TopBar 
        onCssUpload={handleCssUpload} 
        onProjectUpload={handleProjectUpload}
        onToggleDarkMode={toggleDarkMode}
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
        onDownload={getPatchedCss}
        isDarkMode={isDarkMode}
      />
      <main className="flex flex-1 overflow-hidden">
        <TokenEditor tokens={tokens} applyPatch={applyPatch} isDarkMode={isDarkMode} />
        <Playground 
          css={getPatchedCss()} 
          isDarkMode={isDarkMode} 
          components={components}
          onSelectComponent={setSelectedComponent}
        />
        <div className="w-80 bg-stone-50 border-l border-stone-200 p-4 space-y-4 overflow-y-auto">
          <ComponentInspector 
            components={components} 
            selectedComponent={selectedComponent} 
            applyPatch={applyPatch} 
            isDarkMode={isDarkMode}
          />
          <SystemIntegrityScanner scanResults={scanResults} />
        </div>
      </main>
    </div>
  );
}
