import { describe, expect, it } from 'vitest';
import './combobox.js';
import type { MbCombobox } from './combobox.js';

const OPTIONS = [
  { value: 'math', label: 'Mathematics', group: 'Subjects' },
  { value: 'hist', label: 'History', group: 'Subjects' },
  { value: 'run-1', label: 'Weekly review', group: 'Runs', href: '/runs/1' },
  { value: 'tpl', label: 'Template A', group: 'Templates', disabled: true },
];

async function mount(setup?: (el: MbCombobox) => void): Promise<{
  el: MbCombobox;
  form: HTMLFormElement;
}> {
  const form = document.createElement('form');
  const el = document.createElement('mb-combobox') as MbCombobox;
  el.label = 'Search';
  el.options = OPTIONS;
  setup?.(el);
  form.appendChild(el);
  document.body.appendChild(form);
  await el.updateComplete;
  await el.updateComplete;
  return { el, form };
}

function control(el: MbCombobox): HTMLInputElement {
  return el.shadowRoot!.querySelector('input')!;
}

describe('mb-combobox', () => {
  it('opens on focus and renders grouped options', async () => {
    const { el, form } = await mount();
    const input = control(el);
    input.focus();
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    expect(el.open).toBe(true);
    const panel = el.shadowRoot!.querySelector('[part="panel"]');
    expect(panel).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain('Subjects');
    expect(el.shadowRoot!.textContent).toContain('Mathematics');
    expect(el.shadowRoot!.querySelectorAll('[role="option"]')).toHaveLength(4);
    form.remove();
  });

  it('emits mb-input while typing and keeps the panel open', async () => {
    const { el, form } = await mount();
    const values: string[] = [];
    el.addEventListener('mb-input', (e) => values.push((e as CustomEvent).detail.value));

    const input = control(el);
    input.value = 'ma';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe('ma');
    expect(values).toEqual(['ma']);
    expect(el.open).toBe(true);
    form.remove();
  });

  it('selects with Enter and emits mb-select + mb-change', async () => {
    const { el, form } = await mount();
    const selects: Array<{ value: string; label: string; href?: string }> = [];
    const changes: string[] = [];
    el.addEventListener('mb-select', (e) => selects.push((e as CustomEvent).detail));
    el.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail.value));

    const input = control(el);
    input.focus();
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    // Open clamps to the first enabled option; Enter selects it.
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    expect(selects).toEqual([{ value: 'math', label: 'Mathematics', href: undefined }]);
    expect(changes).toEqual(['Mathematics']);
    expect(el.value).toBe('Mathematics');
    expect(el.open).toBe(false);
    form.remove();
  });

  it('supports href on selected options and skips disabled ones', async () => {
    const { el, form } = await mount();
    const selects: Array<{ value: string; href?: string }> = [];
    el.addEventListener('mb-select', (e) => selects.push((e as CustomEvent).detail));

    const input = control(el);
    input.focus();
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    // math -> hist -> run-1 (skips disabled template)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    expect(selects[0]?.value).toBe('run-1');
    expect(selects[0]?.href).toBe('/runs/1');
    form.remove();
  });

  it('shows loading and empty states', async () => {
    const { el, form } = await mount((c) => {
      c.options = [];
      c.loading = true;
      c.open = true;
      c.loadingMessage = 'Chargement…';
      c.emptyMessage = 'Aucun résultat';
    });
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain('Chargement…');

    el.loading = false;
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Aucun résultat');
    form.remove();
  });

  it('closes on Escape and outside pointerdown', async () => {
    const { el, form } = await mount((c) => {
      c.open = true;
    });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="panel"]')).toBeTruthy();

    control(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);

    el.open = true;
    await el.updateComplete;
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    form.remove();
  });

  it('accepts slotted options with data-group / data-href', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-combobox') as MbCombobox;
    el.label = 'Go';
    el.innerHTML = `
      <option value="a" data-group="Subjects">Alpha</option>
      <option value="b" data-href="/b">Beta</option>
    `;
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;

    el.open = true;
    await el.updateComplete;
    const options = [...el.shadowRoot!.querySelectorAll('[role="option"]')];
    expect(options).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain('Subjects');
    expect(el.shadowRoot!.textContent).toContain('Alpha');
    form.remove();
  });

  it('submits named value in FormData', async () => {
    const { el, form } = await mount((c) => {
      c.name = 'q';
      c.value = 'hello';
    });
    await el.updateComplete;
    await el.updateComplete;
    expect(new FormData(form).get('q')).toBe('hello');
    form.remove();
  });

  it('sets combobox ARIA on the input', async () => {
    const { el, form } = await mount((c) => {
      c.open = true;
    });
    await el.updateComplete;
    const input = control(el);
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBeTruthy();
    form.remove();
  });
});
