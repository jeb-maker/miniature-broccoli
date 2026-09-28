import { css } from 'lit';

/** Shared host + focus + motion styles (reuse by reference). */
export const sharedStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--mb-font-body);
    color: var(--mb-color-fg);
    max-inline-size: 100%;
    overflow-wrap: anywhere;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  .control:focus-visible,
  button:focus-visible,
  a:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  input:focus-visible {
    outline: var(--mb-focus-ring);
    outline-offset: var(--mb-focus-offset);
  }

  @media (prefers-reduced-motion: reduce) {
    :host,
    :host * {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .control,
    button,
    a {
      border: 1px solid ButtonText;
    }

    .control:focus-visible,
    button:focus-visible,
    a:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    input:focus-visible {
      outline: 2px solid Highlight;
    }
  }
`;

export const fieldStyles = css`
  /* Block fields fill their containing track by default. */
  :host {
    display: block;
    inline-size: 100%;
  }

  .field {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--mb-field-label-gap, var(--mb-space-2, 0.5rem));
    inline-size: 100%;
  }

  .label {
    display: block;
    margin: 0;
    font-size: var(--mb-font-size-sm);
    font-weight: 600;
    line-height: var(--mb-line-height-tight);
    color: var(--mb-color-fg);
  }

  .label.visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .hint,
  .error {
    font-size: var(--mb-font-size-sm);
    line-height: var(--mb-line-height-tight);
    margin: 0;
  }

  .hint {
    color: var(--mb-color-muted);
  }

  .error {
    color: var(--mb-color-danger);
  }

  .control {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    /* Fixed track height so toolbar siblings (input / select / button) match. */
    block-size: var(--mb-control-height, 2.5rem);
    min-block-size: var(--mb-control-height, 2.5rem);
    min-inline-size: 0;
    padding-block: 0;
    padding-inline: var(--mb-control-padding-inline, var(--mb-space-3, 0.75rem));
    border: 1px solid var(--mb-color-border-strong, #6e857a);
    border-radius: var(--mb-radius-md);
    background: var(--mb-color-surface);
    color: var(--mb-color-fg);
    font: inherit;
    line-height: calc(var(--mb-control-height, 2.5rem) - 2px);
    transition:
      border-color var(--mb-transition),
      background-color var(--mb-transition),
      box-shadow var(--mb-transition);
  }

  .control::placeholder {
    color: var(--mb-color-muted);
    opacity: 1;
  }

  .control:hover:not(:disabled) {
    border-color: var(--mb-color-border-hover);
  }

  .control:focus-visible {
    border-color: var(--mb-color-accent);
  }

  .control:disabled {
    opacity: 1;
    cursor: not-allowed;
    background: var(--mb-color-bg);
    color: var(--mb-color-muted);
    border-color: var(--mb-color-border);
  }

  select.control {
    appearance: none;
    -webkit-appearance: none;
    padding-inline-end: var(
      --mb-control-padding-inline-end-select,
      var(--mb-space-5, 1.5rem)
    );
    background-color: var(--mb-color-surface, #fbfcf9);
    background-image: linear-gradient(
        45deg,
        transparent 50%,
        var(--mb-color-muted, #4a5f55) 50%
      ),
      linear-gradient(135deg, var(--mb-color-muted, #4a5f55) 50%, transparent 50%);
    background-position:
      calc(100% - 1rem) 50%,
      calc(100% - 0.65rem) 50%;
    background-size:
      0.35rem 0.35rem,
      0.35rem 0.35rem;
    background-repeat: no-repeat;
  }

  select.control:disabled {
    background-color: var(--mb-color-bg);
  }

  :host([invalid]) .control,
  :host([invalid]) .control:hover:not(:disabled),
  :host([invalid]) .control:focus-visible {
    border-color: var(--mb-color-danger);
  }

  :host([density='compact']) .field {
    gap: 0;
  }

  :host([density='compact']) .control {
    block-size: var(--mb-control-height-sm, 2rem);
    min-block-size: var(--mb-control-height-sm, 2rem);
    padding-block: 0;
    padding-inline: var(--mb-space-2, 0.5rem);
    font-size: var(--mb-font-size-sm);
    line-height: calc(var(--mb-control-height-sm, 2rem) - 2px);
  }

  :host([density='compact']) select.control {
    padding-inline-end: var(--mb-space-5, 1.5rem);
    background-position:
      calc(100% - 0.85rem) 50%,
      calc(100% - 0.5rem) 50%;
  }

  :host([density='compact']) textarea.control {
    block-size: auto;
    min-block-size: var(--mb-control-height-sm, 2rem);
    padding-block: var(--mb-space-2, 0.5rem);
    line-height: var(--mb-line-height, 1.5);
  }
`;

/** Resolve label rendering for field controls (visible, visually-hidden, or aria-only). */
export function fieldLabelState(
  label: string,
  hideLabel: boolean,
  ariaLabel: string,
): { labelText: string; hideVisually: boolean; controlAriaLabel: string } {
  if (label) {
    return { labelText: label, hideVisually: hideLabel, controlAriaLabel: '' };
  }
  return { labelText: '', hideVisually: false, controlAriaLabel: ariaLabel };
}
