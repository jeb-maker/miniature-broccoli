import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type BreadcrumbItem = { href?: string; label: string; current?: boolean };

function parseItemsAttribute(value: string | null): BreadcrumbItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is BreadcrumbItem =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as BreadcrumbItem).label === 'string',
      )
      .map((item) => ({
        label: item.label,
        href: item.href,
        current: Boolean(item.current),
      }));
  } catch {
    return [];
  }
}

/**
 * Ancestors-only breadcrumbs are fine: omit a current crumb when the page H1
 * already names the page (Revues pattern).
 *
 * Slotted mode: provide `<li>` children (links/spans inside).
 */
export class MbBreadcrumbs extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      nav ol {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--mb-space-1) var(--mb-space-2);
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: var(--mb-font-size-sm);
      }

      li,
      ::slotted(li) {
        display: inline-flex;
        align-items: center;
        gap: var(--mb-space-2);
        min-inline-size: 0;
        list-style: none;
      }

      li:not(:last-child)::after {
        content: '/';
        color: var(--mb-color-muted);
      }

      a {
        color: var(--mb-color-accent);
        text-decoration: none;
        overflow-wrap: anywhere;
      }

      a:hover {
        text-decoration: underline;
      }

      [aria-current='page'] {
        color: var(--mb-color-muted);
        font-weight: 600;
      }
    `,
  ];

  @property()
  label = 'Breadcrumb';

  @property({
    attribute: 'items',
    converter: {
      fromAttribute: parseItemsAttribute,
      toAttribute(value: BreadcrumbItem[]): string | null {
        return value?.length ? JSON.stringify(value) : null;
      },
    },
  })
  items: BreadcrumbItem[] = [];

  override render() {
    return html`
      <nav part="nav" aria-label=${this.label}>
        <ol part="list">
          ${this.items.length
            ? repeat(
                this.items,
                (item) => `${item.href ?? ''}:${item.label}`,
                (item) => html`
                  <li part="item">
                    ${item.current || !item.href
                      ? html`<span aria-current=${item.current ? 'page' : nothing}
                          >${item.label}</span
                        >`
                      : html`<a href=${item.href}>${item.label}</a>`}
                  </li>
                `,
              )
            : html`<slot></slot>`}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-breadcrumbs': MbBreadcrumbs;
  }
}

safeDefine('mb-breadcrumbs', MbBreadcrumbs);
