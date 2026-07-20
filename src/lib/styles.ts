import { css } from 'lit';

/** Shared host + focus + motion styles (reuse by reference). */
export const sharedStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--mb-font-body);
    color: var(--mb-color-fg);
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
`;

export const fieldStyles = css`
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-1);
    inline-size: 100%;
  }

  .label {
    font-size: var(--mb-font-size-sm);
    font-weight: 600;
    color: var(--mb-color-fg);
  }

  .hint,
  .error {
    font-size: var(--mb-font-size-sm);
    margin: 0;
  }

  .hint {
    color: var(--mb-color-muted);
  }

  .error {
    color: var(--mb-color-danger);
  }

  .control {
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding-block: var(--mb-space-2);
    padding-inline: var(--mb-space-3);
    border: 1px solid var(--mb-color-border);
    border-radius: var(--mb-radius-md);
    background: var(--mb-color-surface);
    color: var(--mb-color-fg);
    font: inherit;
    transition: border-color var(--mb-transition), box-shadow var(--mb-transition);
  }

  .control:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  :host([invalid]) .control {
    border-color: var(--mb-color-danger);
  }
`;
