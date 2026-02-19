/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentBlock } from '../types/blueprint';

export type ComponentCategory = 'Typography' | 'Buttons' | 'Inputs' | 'Navigation' | 'Containers & Layout' | 'Other';

const categoryPatterns: Record<ComponentCategory, RegExp> = {
  'Typography': /title|subtitle|body|caption|overline|stat/,
  'Buttons': /btn/,
  'Inputs': /input/,
  'Navigation': /nav/,
  'Containers & Layout': /container|shape|page|grid/,
  'Other': /.*/, // Fallback
};

export function categorizeComponents(components: ComponentBlock[]): Record<ComponentCategory, ComponentBlock[]> {
  const categorized: Record<ComponentCategory, ComponentBlock[]> = {
    'Typography': [],
    'Buttons': [],
    'Inputs': [],
    'Navigation': [],
    'Containers & Layout': [],
    'Other': [],
  };

  for (const component of components) {
    let found = false;
    for (const [category, pattern] of Object.entries(categoryPatterns)) {
      if (pattern.test(component.selectorName)) {
        categorized[category as ComponentCategory].push(component);
        found = true;
        break;
      }
    }
  }

  return categorized;
}
