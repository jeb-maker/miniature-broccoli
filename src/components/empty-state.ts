import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbEmptyState extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      .panel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--mb-space-3);
        padding-block: var(--mb-space-6);
        padding-inline: var(--mb-space-5);
        border: 1px dashed var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
        background: var(--mb-color-surface);
      }

      .heading {
        margin: 0;
        font-family: var(--mb-font-display);
        font-size: var(--mb-font-size-lg);
        font-weight: 650;
        line-height: var(--mb-line-height-tight);
        color: var(--mb-color-fg);
      }

      .body {
        color: var(--mb-color-muted);
        font-size: var(--mb-font-size-md);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--mb-space-2);
      }

      .actions:not([data-has-content]) {
        display: none;
      }
    `,
  ];

  @property()
  heading = '';

  #onActionsSlot(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    const actions = this.renderRoot.querySelector('.actions');
    actions?.toggleAttribute('data-has-content', has);
  }

  override render() {
    return html`
      <div part="panel" class="panel">
        ${this.heading
          ? html`<h2 part="heading" class="heading">${this.heading}</h2>`
          : html`<slot name="heading"></slot>`}
        <div part="body" class="body">
          <slot></slot>
        </div>
        <div part="actions" class="actions">
          <slot name="actions" @slotchange=${this.#onActionsSlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-empty-state': MbEmptyState;
  }
}

safeDefine('mb-empty-state', MbEmptyState);
