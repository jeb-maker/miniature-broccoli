import { safeDefine } from '../lib/safe-define.js';
import { MbBadge } from './badge.js';

/**
 * @deprecated Prefer `mb-badge`. `mb-tag` is a compatibility alias of the same chip.
 * Defaults to `size="md"` (former tag sizing). Same `variant` / `href` API as badge.
 *
 * ```html
 * <!-- before -->
 * <mb-tag href="#filter">domain</mb-tag>
 * <!-- after -->
 * <mb-badge size="md" href="#filter">domain</mb-badge>
 * ```
 */
export class MbTag extends MbBadge {
  override connectedCallback(): void {
    if (!this.hasAttribute('size')) {
      this.size = 'md';
    }
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-tag': MbTag;
  }
}

safeDefine('mb-tag', MbTag);
