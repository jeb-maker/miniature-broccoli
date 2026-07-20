/** Type-only barrel — no customElements.define side effects. */
export type { MbButton, ButtonVariant, ButtonSize, ButtonType } from './components/button.js';
export type { MbInput, InputType } from './components/input.js';
export type { MbTextarea } from './components/textarea.js';
export type { MbSelect, SelectOption } from './components/select.js';
export type { MbCheckbox } from './components/checkbox.js';
export type { MbBadge, BadgeVariant } from './components/badge.js';
export type { MbAlert, AlertVariant } from './components/alert.js';
export type { MbCard } from './components/card.js';
export type { MbModal } from './components/modal.js';

import type { MbAlert } from './components/alert.js';
import type { MbBadge } from './components/badge.js';
import type { MbButton } from './components/button.js';
import type { MbCard } from './components/card.js';
import type { MbCheckbox } from './components/checkbox.js';
import type { MbInput } from './components/input.js';
import type { MbModal } from './components/modal.js';
import type { MbSelect } from './components/select.js';
import type { MbTextarea } from './components/textarea.js';

declare global {
  interface HTMLElementTagNameMap {
    'mb-button': MbButton;
    'mb-input': MbInput;
    'mb-textarea': MbTextarea;
    'mb-select': MbSelect;
    'mb-checkbox': MbCheckbox;
    'mb-badge': MbBadge;
    'mb-alert': MbAlert;
    'mb-card': MbCard;
    'mb-modal': MbModal;
  }
}

export {};
