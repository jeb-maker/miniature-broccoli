import { describe, expect, it } from 'vitest';
import './radio-group.js';
import './radio.js';
import type { MbRadioGroup } from './radio-group.js';
import type { MbRadio } from './radio.js';

describe('mb-radio-group', () => {
  it('includes selected value in FormData', async () => {
    const form = document.createElement('form');
    const group = document.createElement('mb-radio-group') as MbRadioGroup;
    group.name = 'org';
    group.value = 'a';
    const a = document.createElement('mb-radio') as MbRadio;
    a.value = 'a';
    a.textContent = 'A';
    const b = document.createElement('mb-radio') as MbRadio;
    b.value = 'b';
    b.textContent = 'B';
    group.append(a, b);
    form.appendChild(group);
    document.body.appendChild(form);
    await group.updateComplete;
    await group.updateComplete;
    await a.updateComplete;
    await b.updateComplete;

    expect(new FormData(form).get('org')).toBe('a');
    form.remove();
  });

  it('honors fieldset disabled via formDisabledCallback', async () => {
    const fieldset = document.createElement('fieldset');
    const group = document.createElement('mb-radio-group') as MbRadioGroup;
    group.name = 'jira';
    group.options = [
      { value: 'cloud', label: 'Cloud' },
      { value: 'server', label: 'Server' },
    ];
    group.value = 'cloud';
    fieldset.appendChild(group);
    document.body.appendChild(fieldset);
    await group.updateComplete;
    await group.updateComplete;

    fieldset.disabled = true;
    await group.updateComplete;
    await group.updateComplete;

    const radios = [...group.shadowRoot!.querySelectorAll('mb-radio')] as MbRadio[];
    expect(radios.length).toBe(2);
    expect(radios.every((r) => r.disabled)).toBe(true);
    fieldset.remove();
  });

  it('restores slotted radio disabled state when the group re-enables', async () => {
    const group = document.createElement('mb-radio-group') as MbRadioGroup;
    group.name = 'org';
    const a = document.createElement('mb-radio') as MbRadio;
    a.value = 'a';
    a.label = 'A';
    const b = document.createElement('mb-radio') as MbRadio;
    b.value = 'b';
    b.label = 'B';
    b.disabled = true;
    group.append(a, b);
    document.body.appendChild(group);
    await group.updateComplete;
    await group.updateComplete;
    await a.updateComplete;
    await b.updateComplete;

    group.disabled = true;
    await group.updateComplete;
    await group.updateComplete;
    expect(a.disabled).toBe(true);
    expect(b.disabled).toBe(true);

    group.disabled = false;
    await group.updateComplete;
    await group.updateComplete;
    expect(a.disabled).toBe(false);
    expect(b.disabled).toBe(true);
    group.remove();
  });

  it('updates value from slotted radio selection', async () => {
    const group = document.createElement('mb-radio-group') as MbRadioGroup;
    group.name = 'org';
    const a = document.createElement('mb-radio') as MbRadio;
    a.value = 'a';
    const b = document.createElement('mb-radio') as MbRadio;
    b.value = 'b';
    group.append(a, b);
    document.body.appendChild(group);
    await group.updateComplete;
    await a.updateComplete;
    await b.updateComplete;

    const changes: string[] = [];
    group.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail.value));

    b.dispatchEvent(
      new CustomEvent('mb-radio-select', {
        detail: { value: 'b' },
        bubbles: true,
        composed: true,
      }),
    );
    await group.updateComplete;

    expect(group.value).toBe('b');
    expect(changes).toEqual(['b']);
    group.remove();
  });

  it('synchronizes FormData before change and rejects stale values', async () => {
    const form = document.createElement('form');
    const group = document.createElement('mb-radio-group') as MbRadioGroup;
    group.name = 'org';
    group.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];
    form.appendChild(group);
    document.body.appendChild(form);
    await group.updateComplete;
    await group.updateComplete;

    let serialized: FormDataEntryValue | null = null;
    group.addEventListener('mb-change', () => {
      serialized = new FormData(form).get('org');
    });
    group.dispatchEvent(
      new CustomEvent('mb-radio-select', {
        detail: { value: 'b' },
        bubbles: true,
        composed: true,
      }),
    );
    expect(serialized).toBe('b');

    group.value = 'removed';
    await group.updateComplete;
    expect(new FormData(form).get('org')).toBeNull();
    expect(form.checkValidity()).toBe(false);
    form.remove();
  });
});
