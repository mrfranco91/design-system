/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Token, ComponentBlock, ComponentProperty } from '../types/blueprint';

const TOKEN_REGEX = /--([a-zA-Z0-9-_]+):\s*(.+?);/g;
const COMPONENT_REGEX = /\.bp-([a-zA-Z0-9\-_]+)((?:\s*\.\S+)*)?\s*\{\s*([\s\S]+?)\s*\}/g;
const DARK_COMPONENT_REGEX = /\.dark\s*(\.bp-[a-zA-Z0-9\-_]+)((?:\s*\.\S+)*)?\s*\{\s*([\s\S]+?)\s*\}/g;

export function parseCss(cssText: string): { tokens: Token[], components: ComponentBlock[] } {
  const tokens = parseTokens(cssText);
  const components = parseComponents(cssText);
  return { tokens, components };
}

function parseTokens(cssText: string): Token[] {
  const rootContent = cssText.match(/:root\s*\{([\s\S]+?)\}/)?.[1] || '';
  const darkContent = cssText.match(/\.dark\s*\{([\s\S]+?)\}/)?.[1] || '';

  const rootTokens = [...rootContent.matchAll(TOKEN_REGEX)].map(match => createToken(match, 'root'));
  const darkTokens = [...darkContent.matchAll(TOKEN_REGEX)].map(match => createToken(match, 'dark'));

  return [...rootTokens, ...darkTokens];
}

function createToken(match: RegExpMatchArray, scope: 'root' | 'dark'): Token {
  const [fullMatch, name, value] = match;
  return {
    tokenName: `--${name}`,
    rawValue: value.trim(),
    scope,
    startIndex: match.index! + match[0].indexOf(value),
    endIndex: match.index! + match[0].indexOf(value) + value.length,
  };
}

function parseComponents(cssText: string): ComponentBlock[] {
  const lightComponents = [...cssText.matchAll(COMPONENT_REGEX)].map(match => createComponentBlock(match, 'light'));
  const darkComponents = [...cssText.matchAll(DARK_COMPONENT_REGEX)].map(match => createComponentBlock(match, 'dark'));
  return [...lightComponents, ...darkComponents];
}

function createComponentBlock(match: RegExpMatchArray, scope: 'light' | 'dark'): ComponentBlock {
  const [fullBlockText, name, modifiers, content] = match;
  const selectorName = `.bp-${name}${modifiers || ''}`;
  
  if (scope === 'dark') {
     const selectorName = `.dark .bp-${name}${modifiers || ''}`;
  }

  const properties = content.trim().split(';').filter(Boolean).map(prop => {
    const [name, value] = prop.split(':');
    return { name: name.trim(), value: value.trim() };
  });

  return {
    selectorName,
    fullBlockText,
    properties,
    startIndex: match.index!,
    endIndex: match.index! + fullBlockText.length,
    scope,
  };
}
