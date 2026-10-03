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
      pattern?: string;
      maxlength?: number;
      minlength?: number;
      autocomplete?: string;
      readonly?: boolean;
      'missing-message'?: string;
      'invalid-message'?: string;
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
      maxlength?: number;
      minlength?: number;
      autocomplete?: string;
      readonly?: boolean;
      'missing-message'?: string;
      'invalid-message'?: string;
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
      placeholder?: string;
      options?: Array<{ value: string; label: string; disabled?: boolean }> | string;
      'missing-message'?: string;
      'invalid-message'?: string;
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
      'missing-message'?: string;
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
      'missing-message'?: string;
      'invalid-message'?: string;
    };
    'mb-badge': MbBaseAttrs & {
      variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
      href?: string;
      size?: 'sm' | 'md';
    };
    'mb-alert': MbBaseAttrs & {
      variant?: 'info' | 'success' | 'warning' | 'danger';
    };
    'mb-card': MbBaseAttrs;
    'mb-modal': MbBaseAttrs & {
      open?: boolean;
      heading?: string;
      'close-label'?: string;
    };
    'mb-progress': MbBaseAttrs & {
      value?: number;
      max?: number;
      percent?: number;
      label?: string;
      'fallback-label'?: string;
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
      'dismiss-label'?: string;
    };
    /** @deprecated Prefer `mb-badge` (same chip; tag defaults to size md). */
    'mb-tag': MbBaseAttrs & {
      variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
      href?: string;
      size?: 'sm' | 'md';
    };
    'mb-breadcrumbs': MbBaseAttrs & {
      label?: string;
      items?: Array<{ href?: string; label: string; current?: boolean }> | string;
    };
    'mb-nav': MbBaseAttrs & {
      label?: string;
      open?: boolean;
    };
    'mb-nav-toggle': MbBaseAttrs & {
      expanded?: boolean;
      for?: string;
      'label-open'?: string;
      'label-close'?: string;
    };
    'mb-avatar': MbBaseAttrs & {
      src?: string;
      alt?: string;
      name?: string;
      size?: 'sm' | 'md';
      'fallback-label'?: string;
    };
    'mb-spinner': MbBaseAttrs & {
      size?: 'sm' | 'md';
      label?: string;
    };
    'mb-toolbar': MbBaseAttrs;
    'mb-table': MbBaseAttrs & {
      label?: string;
      columns?: string;
      density?: 'default' | 'compact';
      layout?: 'auto' | 'table' | 'cards';
      sections?:
        | Array<{
            id: string;
            label: string;
            collapsed?: boolean;
            meta?: string;
            count?: boolean;
          }>
        | string;
      'sort-key'?: string;
      'sort-direction'?: 'asc' | 'desc';
      reorderable?: boolean;
      'reorder-label'?: string;
      'sort-label'?: string;
      'hide-count'?: boolean;
      'sticky-header'?: boolean;
    };
    'mb-table-row': MbBaseAttrs & {
      head?: boolean;
      section?: string;
      'sort-value'?: string;
    };
    'mb-table-cell': MbBaseAttrs & {
      label?: string;
      align?: 'start' | 'center' | 'end';
      primary?: boolean;
      'hide-label'?: boolean;
      actions?: boolean;
      'sort-key'?: string;
      sortable?: boolean;
      'sort-value'?: string;
    };
  }
}

export {};
