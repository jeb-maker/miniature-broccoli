/**
 * JSX intrinsic element typings for React 19+ custom element usage.
 * React ≤18: prefer string attributes; property binding is not first-class.
 *
 * Reference via:
 *   import '@miniature-broccoli/mb/jsx'
 * or:
 *   /// <reference types="@miniature-broccoli/mb/jsx" />
 *
 * Avoids a hard React dependency — props are typed without importing React.
 */

type MbBaseAttrs = {
  children?: unknown;
  class?: string;
  className?: string;
  style?: unknown;
  slot?: string;
  id?: string;
  [key: string]: unknown;
};

declare namespace JSX {
  interface IntrinsicElements {
    'mb-button': MbBaseAttrs & {
      variant?: 'primary' | 'secondary' | 'ghost';
      size?: 'sm' | 'md' | 'lg';
      type?: 'button' | 'submit' | 'reset';
      disabled?: boolean;
      loading?: boolean;
      name?: string;
      value?: string;
    };
    'mb-input': MbBaseAttrs & {
      label?: string;
      hint?: string;
      error?: string;
      type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';
      value?: string;
      name?: string;
      placeholder?: string;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
    };
    'mb-textarea': MbBaseAttrs & {
      label?: string;
      hint?: string;
      error?: string;
      value?: string;
      name?: string;
      placeholder?: string;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      rows?: number;
    };
    'mb-select': MbBaseAttrs & {
      label?: string;
      hint?: string;
      error?: string;
      value?: string;
      name?: string;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      options?: Array<{ value: string; label: string; disabled?: boolean }>;
    };
    'mb-checkbox': MbBaseAttrs & {
      label?: string;
      error?: string;
      name?: string;
      value?: string;
      checked?: boolean;
      indeterminate?: boolean;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
    };
    'mb-badge': MbBaseAttrs & {
      variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
    };
    'mb-alert': MbBaseAttrs & {
      variant?: 'info' | 'success' | 'warning' | 'danger';
    };
    'mb-card': MbBaseAttrs;
    'mb-modal': MbBaseAttrs & {
      open?: boolean;
      heading?: string;
    };
  }
}

export {};
