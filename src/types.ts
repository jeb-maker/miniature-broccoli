/** Type-only barrel — no customElements.define side effects. */
export type { MbButton, ButtonVariant, ButtonSize, ButtonType } from './components/button.js';
export type { MbInput, InputType } from './components/input.js';
export type { MbTextarea } from './components/textarea.js';
export type { MbSelect, SelectOption } from './components/select.js';
export type { MbCheckbox } from './components/checkbox.js';
export type { MbRadio } from './components/radio.js';
export type { MbRadioGroup, RadioOption } from './components/radio-group.js';
export type { MbBadge, BadgeVariant } from './components/badge.js';
export type { MbAlert, AlertVariant } from './components/alert.js';
export type { MbCard } from './components/card.js';
export type { MbModal } from './components/modal.js';
export type { MbProgress } from './components/progress.js';
export type { MbSegmentedControl } from './components/segmented-control.js';
export type { MbEmptyState } from './components/empty-state.js';
export type { MbPagination } from './components/pagination.js';
export type { MbToast, ToastVariant } from './components/toast.js';

import type { MbAlert } from './components/alert.js';
import type { MbBadge } from './components/badge.js';
import type { MbButton } from './components/button.js';
import type { MbCard } from './components/card.js';
import type { MbCheckbox } from './components/checkbox.js';
import type { MbEmptyState } from './components/empty-state.js';
import type { MbInput } from './components/input.js';
import type { MbModal } from './components/modal.js';
import type { MbPagination } from './components/pagination.js';
import type { MbProgress } from './components/progress.js';
import type { MbRadio } from './components/radio.js';
import type { MbRadioGroup } from './components/radio-group.js';
import type { MbSegmentedControl } from './components/segmented-control.js';
import type { MbSelect } from './components/select.js';
import type { MbTextarea } from './components/textarea.js';
import type { MbToast } from './components/toast.js';

declare global {
  interface HTMLElementTagNameMap {
    'mb-button': MbButton;
    'mb-input': MbInput;
    'mb-textarea': MbTextarea;
    'mb-select': MbSelect;
    'mb-checkbox': MbCheckbox;
    'mb-radio': MbRadio;
    'mb-radio-group': MbRadioGroup;
    'mb-badge': MbBadge;
    'mb-alert': MbAlert;
    'mb-card': MbCard;
    'mb-modal': MbModal;
    'mb-progress': MbProgress;
    'mb-segmented-control': MbSegmentedControl;
    'mb-empty-state': MbEmptyState;
    'mb-pagination': MbPagination;
    'mb-toast': MbToast;
  }
}

export {};
