/**
 * JSX intrinsic element typings for React 19+ custom element usage.
 * React ≤18: prefer string attributes; property binding is not first-class.
 *
 * Reference via:
 *   import '@jeb-maker/mb/jsx'
 * or:
 *   /// <reference types="@jeb-maker/mb/jsx" />
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
      variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
      size?: 'sm' | 'md' | 'lg';
      type?: 'button' | 'submit' | 'reset';
      disabled?: boolean;
      loading?: boolean;
      name?: string;
      value?: string;
      href?: string;
      target?: string;
      rel?: string;
      'icon-only'?: boolean;
    };
    'mb-input': MbBaseAttrs & {
      label?: string;
      hint?: string;
      error?: string;
      type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number' | 'file';
      value?: string;
      name?: string;
      placeholder?: string;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      density?: 'default' | 'compact';
      'hide-label'?: boolean;
      min?: string | number;
      max?: string | number;
      step?: string | number;
      accept?: string;
      multiple?: boolean;
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
      density?: 'default' | 'compact';
      'hide-label'?: boolean;
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
      density?: 'default' | 'compact';
      'hide-label'?: boolean;
      options?: Array<{ value: string; label: string; disabled?: boolean }> | string;
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
    'mb-radio': MbBaseAttrs & {
      label?: string;
      value?: string;
      name?: string;
      checked?: boolean;
      disabled?: boolean;
    };
    'mb-radio-group': MbBaseAttrs & {
      label?: string;
      error?: string;
      value?: string;
      name?: string;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      options?: Array<{ value: string; label: string; disabled?: boolean }> | string;
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
    'mb-progress': MbBaseAttrs & {
      value?: number;
      max?: number;
      percent?: number;
      label?: string;
    };
    'mb-segmented-control': MbBaseAttrs & {
      label?: string;
    };
    'mb-empty-state': MbBaseAttrs & {
      heading?: string;
    };
    'mb-pagination': MbBaseAttrs & {
      'prev-url'?: string;
      'next-url'?: string;
      'prev-disabled'?: boolean;
      'next-disabled'?: boolean;
      status?: string;
      'prev-label'?: string;
      'next-label'?: string;
      label?: string;
    };
    'mb-toast': MbBaseAttrs & {
      open?: boolean;
      variant?: 'success' | 'danger' | 'info';
      'auto-dismiss'?: number;
      message?: string;
    };
  }
}

export {};
