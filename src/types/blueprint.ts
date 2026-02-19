/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Token {
  tokenName: string;
  rawValue: string;
  scope: 'root' | 'dark';
  startIndex: number;
  endIndex: number;
}

export interface ComponentProperty {
  name: string;
  value: string;
}

export interface ComponentBlock {
  selectorName: string;
  fullBlockText: string;
  properties: ComponentProperty[];
  startIndex: number;
  endIndex: number;
  scope: 'light' | 'dark';
}

export type Patch = 
  | { type: 'token'; tokenName: string; scope: 'root' | 'dark'; newValue: string }
  | { type: 'component'; selectorName: string; scope: 'light' | 'dark'; property: string; newValue: string };

export interface ScanResult {
  file: string;
  line: number;
  pattern: string;
  suggestion: string;
}
