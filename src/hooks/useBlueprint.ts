/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Token, ComponentBlock, Patch, ScanResult } from '../types/blueprint';
import { parseCss } from '../services/blueprintParser';
import { patchCss } from '../services/cssPatcher';
import { scanProject } from '../services/projectScanner';

export function useBlueprint() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [originalCssText, setOriginalCssText] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [components, setComponents] = useState<ComponentBlock[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentBlock | null>(null);
  
  const [history, setHistory] = useState<Patch[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCssUpload = useCallback((cssText: string) => {
    setOriginalCssText(cssText);
    const { tokens, components } = parseCss(cssText);
    setTokens(tokens);
    setComponents(components);
    setHistory([[]]);
    setHistoryIndex(0);
  }, []);

  const handleProjectUpload = useCallback(async (zipFile: File) => {
    const results = await scanProject(zipFile);
    setScanResults(results);
  }, []);

  const applyPatch = useCallback((patch: Patch) => {
    const newPatches = [...history[historyIndex], patch];
    const newHistory = [...history.slice(0, historyIndex + 1), newPatches];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const reset = useCallback(() => {
    setHistory([[]]);
    setHistoryIndex(0);
  }, []);

  const getPatchedCss = useCallback(() => {
    if (!originalCssText) return '';
    return patchCss(originalCssText, history[historyIndex]);
  }, [originalCssText, history, historyIndex]);

  const currentPatches = history[historyIndex] || [];

  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
    originalCssText,
    tokens,
    components,
    patches: currentPatches,
    scanResults,
    handleCssUpload,
    handleProjectUpload,
    applyPatch,
    undo,
    redo,
    reset,
    getPatchedCss,
    selectedComponent,
    setSelectedComponent: (comp: ComponentBlock | null) => setSelectedComponent(comp),
  };
}
