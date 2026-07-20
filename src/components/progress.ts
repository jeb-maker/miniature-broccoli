import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbProgress extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      .wrap {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-1);
      }

      .label {
        font-size: var(--mb-font-size-sm);
        color: var(--mb-color-muted);
      }

      .track {
        inline-size: 100%;
        block-size: 0.5rem;
        border-radius: var(--mb-radius-sm);
        background: var(--mb-color-border);
        overflow: clip;
      }

      .bar {
        block-size: 100%;
        background: var(--mb-color-accent);
        border-radius: inherit;
        transition: inline-size var(--mb-transition);
      }
    `,
  ];

  /** Current progress value (with `max`). Ignored when `percent` is set. */
  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  max = 100;

  /** Convenience 0–100 percent. When set, overrides value/max for the bar. */
  @property({ type: Number })
  percent: number | null = null;

  @property()
  label = '';

  get #percent(): number {
    if (this.percent != null && !Number.isNaN(this.percent)) {
      return Math.min(100, Math.max(0, this.percent));
    }
    const max = this.max > 0 ? this.max : 100;
    return Math.min(100, Math.max(0, (this.value / max) * 100));
  }

  get #now(): number {
    if (this.percent != null && !Number.isNaN(this.percent)) {
      return this.#percent;
    }
    return this.value;
  }

  get #max(): number {
    if (this.percent != null && !Number.isNaN(this.percent)) {
      return 100;
    }
    return this.max > 0 ? this.max : 100;
  }

  override render() {
    const pct = this.#percent;
    return html`
      <div class="wrap">
        ${this.label
          ? html`<div part="label" class="label" id="label">${this.label}</div>`
          : nothing}
        <div
          part="track"
          class="track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuenow=${this.#now}
          aria-valuemax=${this.#max}
          aria-labelledby=${this.label ? 'label' : nothing}
          aria-label=${!this.label ? this.getAttribute('aria-label') || 'Progress' : nothing}
        >
          <div part="bar" class="bar" style="inline-size: ${pct}%"></div>
        </div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-progress': MbProgress;
  }
}

safeDefine('mb-progress', MbProgress);
