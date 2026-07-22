import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type AvatarSize = 'sm' | 'md';

export class MbAvatar extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: clip;
        border-radius: 50%;
        background: var(--mb-color-accent-soft);
        color: var(--mb-color-accent);
        font-weight: 700;
        line-height: 1;
        user-select: none;
      }

      :host([size='sm']) .avatar {
        inline-size: 1.75rem;
        block-size: 1.75rem;
        font-size: 0.7rem;
      }

      :host([size='md']) .avatar,
      :host(:not([size])) .avatar {
        inline-size: 2.25rem;
        block-size: 2.25rem;
        font-size: 0.8rem;
      }

      img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
      }
    `,
  ];

  @property({ reflect: true })
  src = '';

  @property()
  alt = '';

  /** Used for initials fallback when `src` is missing or fails to load. */
  @property()
  name = '';

  @property({ reflect: true })
  size: AvatarSize = 'md';

  @state()
  private _failed = false;

  get #initials(): string {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  #onError(): void {
    this._failed = true;
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('src')) {
      this._failed = false;
    }
  }

  override render() {
    const showImage = Boolean(this.src) && !this._failed;
    return html`
      <span part="base" class="avatar" role=${showImage ? nothing : 'img'} aria-label=${showImage ? nothing : this.alt || this.name || 'Avatar'}>
        ${showImage
          ? html`<img part="image" src=${this.src} alt=${this.alt} @error=${this.#onError} />`
          : html`<span part="initials">${this.#initials}</span>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-avatar': MbAvatar;
  }
}

safeDefine('mb-avatar', MbAvatar);
