/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentBlock } from '../types/blueprint';

interface PlaygroundProps {
  css: string | null;
  isDarkMode: boolean;
  components: ComponentBlock[];
  onSelectComponent: (component: ComponentBlock) => void;
}

const playgroundSections = [
  {
    title: 'Typography',
    components: [
      { class: 'bp-page-title', element: 'h1', text: 'Page Title' },
      { class: 'bp-section-title', element: 'h2', text: 'Section Title' },
      { class: 'bp-card-title', element: 'h3', text: 'Card Title' },
      { class: 'bp-stat-value', element: 'p', text: '1,234.56' },
      { class: 'bp-subtitle', element: 'h4', text: 'Subtitle for a section' },
      { class: 'bp-overline', element: 'p', text: 'Overline' },
      { class: 'bp-body', element: 'p', text: 'This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { class: 'bp-body-sm', element: 'p', text: 'This is small body text. Used for less important information.' },
      { class: 'bp-caption', element: 'p', text: 'This is a caption. Used for image captions or footnotes.' },
    ]
  },
  {
    title: 'Buttons',
    components: [
      { class: 'bp-btn-primary', element: 'button', text: 'Primary Button' },
      { class: 'bp-btn-secondary', element: 'button', text: 'Secondary Button' },
      { class: 'bp-btn-ghost', element: 'button', text: 'Ghost Button' },
      { class: 'bp-btn-disabled', element: 'button', text: 'Disabled Button', props: { disabled: true } },
    ]
  },
  {
    title: 'Inputs',
    components: [
      { class: 'bp-input', element: 'input', props: { type: 'text', placeholder: 'Editable input' } },
      { class: 'bp-input-readonly', element: 'input', props: { type: 'text', placeholder: 'Read-only input', readOnly: true } },
    ]
  },
  {
    title: 'Containers',
    components: [
      { class: 'bp-container-compact', element: 'div', text: 'Compact Container' },
      { class: 'bp-container-tall', element: 'div', text: 'Tall Container' },
      { class: 'bp-container-list', element: 'div', text: 'List Container' },
    ]
  },
  {
    title: 'Navigation',
    components: [
      { class: 'bp-bottomnav', element: 'div', children: [
        { class: 'bp-bottomnav-item', element: 'div', children: [{ class: 'bp-bottomnav-label', element: 'span', text: 'Home' }] },
        { class: 'bp-bottomnav-item', element: 'div', children: [{ class: 'bp-bottomnav-label', element: 'span', text: 'Search' }] },
        { class: 'bp-bottomnav-item', element: 'div', children: [{ class: 'bp-bottomnav-label', element: 'span', text: 'Profile' }] },
      ] },
    ]
  }
];

export default function Playground({ css, isDarkMode, components, onSelectComponent }: PlaygroundProps) {
  return (
    <div className="flex-1 p-8 bg-stone-100 overflow-y-auto">
      <style>{css}</style>
      <div id="playground-root" className={`bg-white h-full w-full shadow-inner rounded-lg p-8 space-y-8 ${isDarkMode ? 'dark' : ''}`}>
        {!css && <p className="text-center text-stone-500">Upload a Blueprint CSS file to begin.</p>}
        {css && playgroundSections.map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-stone-800 mb-4">{section.title}</h2>
            <div className="space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
              {section.components.map(comp => {
                const Element = comp.element as keyof JSX.IntrinsicElements;
                if (comp.children) {
                  return (
                    <Element key={comp.class} className={comp.class} {...comp.props}>
                      {comp.children.map((child, i) => {
                        const ChildElement = child.element as keyof JSX.IntrinsicElements;
                        return <ChildElement key={i} className={child.class}>{child.text}</ChildElement>
                      })}
                    </Element>
                  )
                }
                const componentData = components.find(c => c.selectorName === comp.class && (isDarkMode ? c.scope === 'dark' : c.scope === 'light')) 
                  || components.find(c => c.selectorName === comp.class);

                return <Element 
                  key={comp.class} 
                  className={comp.class} 
                  {...comp.props}
                  onClick={() => componentData && onSelectComponent(componentData)}
                >
                  {comp.text}
                </Element>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
