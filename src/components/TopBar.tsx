/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';

interface TopBarProps {
  onCssUpload: (cssText: string) => void;
  onProjectUpload: (zipFile: File) => void;
  onToggleDarkMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onDownload: () => string;
  isDarkMode: boolean;
}

export default function TopBar({
  onCssUpload,
  onProjectUpload,
  onToggleDarkMode,
  onUndo,
  onRedo,
  onReset,
  onDownload,
  isDarkMode,
}: TopBarProps) {
  const cssInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const handleCssFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCssUpload(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleProjectFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onProjectUpload(file);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center px-4 justify-between z-10">
      <h1 className="font-bold text-stone-800">Blueprint Design Lab</h1>
      <div className="flex items-center gap-4">
        <input type="file" accept=".css" ref={cssInputRef} onChange={handleCssFileSelected} className="hidden" />
        <button onClick={() => cssInputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
          Upload index.css
        </button>

        <input type="file" accept=".zip" ref={projectInputRef} onChange={handleProjectFileSelected} className="hidden" />
        <button onClick={() => projectInputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
          Upload Project (.zip)
        </button>

        <div className="h-6 w-px bg-stone-200"></div>

        <button onClick={onToggleDarkMode} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
          {isDarkMode ? 'Dark Mode: On' : 'Dark Mode: Off'}
        </button>
        <button onClick={onUndo} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
          Undo
        </button>
        <button onClick={onRedo} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
          Redo
        </button>
        <button onClick={onReset} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
          Reset
        </button>
        <button onClick={() => {
          const css = onDownload();
          const blob = new Blob([css], { type: 'text/css' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'index.css';
          a.click();
          URL.revokeObjectURL(url);
        }} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
          Download
        </button>
      </div>
    </header>
  );
}
