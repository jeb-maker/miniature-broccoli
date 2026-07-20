/**
 * JSX intrinsic element typings for React 19+ custom element usage.
 * React ≤18: prefer string attributes; property binding is not first-class.
 *
 * Reference via package export `./jsx` or triple-slash:
 * /// <reference types="@miniature-broccoli/mb/jsx" />
 */

type MbHTMLAttributes = Record<string, unknown>;

declare namespace JSX {
  interface IntrinsicElements {
    'mb-button': MbHTMLAttributes;
    'mb-input': MbHTMLAttributes;
    'mb-textarea': MbHTMLAttributes;
    'mb-select': MbHTMLAttributes;
    'mb-checkbox': MbHTMLAttributes;
    'mb-badge': MbHTMLAttributes;
    'mb-alert': MbHTMLAttributes;
    'mb-card': MbHTMLAttributes;
    'mb-modal': MbHTMLAttributes;
  }
}

export {};
