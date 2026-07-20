/**
 * JSX intrinsic element typings for React 19+ custom element usage.
 * React ≤18: prefer string attributes; property binding is not first-class.
 *
 * Reference via package export `./jsx` or triple-slash:
 * /// <reference types="@miniature-broccoli/ds/jsx" />
 */

type DsHTMLAttributes = Record<string, unknown>;

declare namespace JSX {
  interface IntrinsicElements {
    'ds-button': DsHTMLAttributes;
    'ds-input': DsHTMLAttributes;
    'ds-textarea': DsHTMLAttributes;
    'ds-select': DsHTMLAttributes;
    'ds-checkbox': DsHTMLAttributes;
    'ds-badge': DsHTMLAttributes;
    'ds-alert': DsHTMLAttributes;
    'ds-card': DsHTMLAttributes;
    'ds-modal': DsHTMLAttributes;
  }
}

export {};
