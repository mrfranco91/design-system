/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Playground from './components/Playground';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useBlueprint } from './hooks/useBlueprint';


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
        <Sidebar 
          tokens={tokens}
          components={components}
          applyPatch={applyPatch}
          isDarkMode={isDarkMode}
          scanResults={scanResults}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
        />
        <Playground 
          css={getPatchedCss()} 
          isDarkMode={isDarkMode} 
          components={components}
          onSelectComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
        />
      </main>
    </div>
  );
}
