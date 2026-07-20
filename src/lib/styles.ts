import { css } from 'lit';

/** Shared host + focus + motion styles (reuse by reference). */
export const sharedStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--ds-font-body);
    color: var(--ds-color-fg);
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
  select:focus-visible,
  textarea:focus-visible,
  input:focus-visible {
    outline: var(--ds-focus-ring);
    outline-offset: var(--ds-focus-offset);
  }

  @media (prefers-reduced-motion: reduce) {
    :host,
    :host * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const fieldStyles = css`
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    inline-size: 100%;
  }

  .label {
    font-size: var(--ds-font-size-sm);
    font-weight: 600;
    color: var(--ds-color-fg);
  }

  .hint,
  .error {
    font-size: var(--ds-font-size-sm);
    margin: 0;
  }

  .hint {
    color: var(--ds-color-muted);
  }

  .error {
    color: var(--ds-color-danger);
  }

  .control {
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding-block: var(--ds-space-2);
    padding-inline: var(--ds-space-3);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-surface);
    color: var(--ds-color-fg);
    font: inherit;
    transition: border-color var(--ds-transition), box-shadow var(--ds-transition);
  }

  .control:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  :host([invalid]) .control {
    border-color: var(--ds-color-danger);
  }
`;
