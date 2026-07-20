import { describe, expect, it } from 'vitest';
import './select.js';
import type { MbSelect } from './select.js';

const OPTIONS = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy', disabled: true },
];

async function mount(setup?: (el: MbSelect) => void): Promise<{ el: MbSelect; form: HTMLFormElement }> {
  const form = document.createElement('form');
  const el = document.createElement('mb-select') as MbSelect;
  el.options = OPTIONS;
  setup?.(el);
  form.appendChild(el);
  document.body.appendChild(form);
  await el.updateComplete;
  await el.updateComplete;
  return { el, form };
}

describe('mb-select', () => {
  it('renders options and reflects disabled option state', async () => {
    const { el, form } = await mount();
    const rendered = [...el.shadowRoot!.querySelectorAll('option')];

    // First option is the empty placeholder.
    expect(rendered).toHaveLength(OPTIONS.length + 1);
    expect(rendered[1].value).toBe('fr');
    expect(rendered[1].textContent).toContain('France');
    expect(rendered[3].disabled).toBe(true);
    form.remove();
  });

  it('submits value in FormData only when named', async () => {
    const { el, form } = await mount((s) => {
      s.value = 'de';
    });

    expect([...new FormData(form).keys()]).toEqual([]);

    el.name = 'country';
    await el.updateComplete;
    await el.updateComplete;
    expect(new FormData(form).get('country')).toBe('de');
    form.remove();
  });

  it('is invalid when required with no selection', async () => {
    const { el, form } = await mount((s) => {
      s.name = 'country';
      s.required = true;
    });

    expect(form.checkValidity()).toBe(false);

    el.value = 'fr';
    await el.updateComplete;
    await el.updateComplete;
    expect(form.checkValidity()).toBe(true);
    form.remove();
  });

  it('emits mb-change and syncs value from user interaction', async () => {
    const { el, form } = await mount((s) => {
      s.name = 'country';
    });

    const changes: string[] = [];
    el.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail.value));

    const select = el.shadowRoot!.querySelector('select')!;
    select.value = 'de';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe('de');
    expect(changes).toEqual(['de']);
    form.remove();
  });

  it('restores default value on form reset', async () => {
    const { el, form } = await mount((s) => {
      s.name = 'country';
      s.value = 'fr';
    });

    el.value = 'de';
    await el.updateComplete;
    form.reset();
    await el.updateComplete;
    await el.updateComplete;

    expect(el.value).toBe('fr');
    expect(el.shadowRoot!.querySelector('select')!.value).toBe('fr');
    form.remove();
  });

  it('accepts JSON options attribute for non-JS hosts', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-select') as MbSelect;
    el.setAttribute(
      'options',
      JSON.stringify([
        { value: 'ok', label: 'OK' },
        { value: 'ko', label: 'KO' },
      ]),
    );
    el.name = 'status';
    el.value = 'ok';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;

    const rendered = [...el.shadowRoot!.querySelectorAll('option')].map((o) => o.value);
    expect(rendered).toContain('ok');
    expect(rendered).toContain('ko');
    expect(new FormData(form).get('status')).toBe('ok');
    form.remove();
  });

  it('prefers slotted option elements over the options property', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-select') as MbSelect;
    el.options = OPTIONS;
    el.name = 'status';
    el.value = 'done';
    const a = document.createElement('option');
    a.value = 'todo';
    a.textContent = 'Todo';
    const b = document.createElement('option');
    b.value = 'done';
    b.textContent = 'Done';
    el.append(a, b);
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;
    await el.updateComplete;

    const values = [...el.shadowRoot!.querySelectorAll('option')].map((o) => o.value);
    expect(values).toContain('todo');
    expect(values).toContain('done');
    expect(values).not.toContain('fr');
    expect(new FormData(form).get('status')).toBe('done');
    form.remove();
  });

  it('supports compact density and aria-label-only mode', async () => {
    const el = document.createElement('mb-select') as MbSelect;
    el.density = 'compact';
    el.setAttribute('aria-label', 'Status');
    el.options = OPTIONS;
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.getAttribute('density')).toBe('compact');
    const control = el.shadowRoot!.querySelector('select')!;
    expect(control.getAttribute('aria-label')).toBe('Status');
    expect(el.shadowRoot!.querySelector('label')).toBeNull();
    el.remove();
  });
});
