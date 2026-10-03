import axe from 'axe-core';
import { expect } from 'vitest';

function formatViolations(violations: axe.Result[]): string {
  if (!violations.length) return '';
  return violations
    .map((v) => {
      const nodes = v.nodes.map((n) => `    - ${n.html}`).join('\n');
      return `${v.id} (${v.impact ?? 'unknown'}): ${v.help}\n${nodes}`;
    })
    .join('\n');
}

/**
 * Run axe on a mounted element. Page-level rules and color-contrast are off so
 * isolated component smoke tests stay stable in CI.
 */
export async function expectAccessible(
  element: Element,
  options: axe.RunOptions = {},
): Promise<void> {
  const results = await axe.run(element, {
    rules: {
      'color-contrast': { enabled: false },
      'document-title': { enabled: false },
      'html-has-lang': { enabled: false },
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
      ...(options.rules ?? {}),
    },
    ...options,
  });

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}
