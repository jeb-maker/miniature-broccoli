export type { DsButton, ButtonVariant, ButtonSize, ButtonType } from './components/button.js';
export type { DsInput, InputType } from './components/input.js';
export type { DsTextarea } from './components/textarea.js';
export type { DsSelect, SelectOption } from './components/select.js';
export type { DsCheckbox } from './components/checkbox.js';
export type { DsBadge, BadgeVariant } from './components/badge.js';
export type { DsAlert, AlertVariant } from './components/alert.js';
export type { DsCard } from './components/card.js';
export type { DsModal } from './components/modal.js';

import type { DsAlert } from './components/alert.js';
import type { DsBadge } from './components/badge.js';
import type { DsButton } from './components/button.js';
import type { DsCard } from './components/card.js';
import type { DsCheckbox } from './components/checkbox.js';
import type { DsInput } from './components/input.js';
import type { DsModal } from './components/modal.js';
import type { DsSelect } from './components/select.js';
import type { DsTextarea } from './components/textarea.js';

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
    'ds-input': DsInput;
    'ds-textarea': DsTextarea;
    'ds-select': DsSelect;
    'ds-checkbox': DsCheckbox;
    'ds-badge': DsBadge;
    'ds-alert': DsAlert;
    'ds-card': DsCard;
    'ds-modal': DsModal;
  }
}

export {};
