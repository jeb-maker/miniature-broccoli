import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    --mb-table-template: repeat(var(--mb-table-col-count, 1), minmax(0, 1fr));
  }

  .root {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-3);
    inline-size: 100%;
    max-inline-size: 100%;
  }

  .caption {
    margin: 0;
    font-family: var(--mb-font-display);
    font-size: var(--mb-font-size-lg);
    font-weight: 600;
    line-height: var(--mb-line-height-tight);
  }

  .frame {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-3);
    inline-size: 100%;
    min-inline-size: 0;
  }

  .head {
    display: none;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-3);
    min-inline-size: 0;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-2);
    min-inline-size: 0;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--mb-space-3);
    inline-size: 100%;
    margin: 0;
    padding-block: var(--mb-space-2);
    padding-inline: var(--mb-space-3);
    min-block-size: var(--mb-control-height, 2.5rem);
    border: 1px solid var(--mb-color-border-strong);
    border-radius: var(--mb-radius-md);
    background: var(--mb-color-bg);
    transition:
      background-color var(--mb-transition),
      border-color var(--mb-transition);
    color: var(--mb-color-fg);
    font: inherit;
    font-family: var(--mb-font-display);
    font-weight: 600;
    text-align: start;
    cursor: pointer;
  }

  .section-head:hover {
    background-image: linear-gradient(var(--mb-color-hover), var(--mb-color-hover));
  }

  .section-head:active {
    background-image: linear-gradient(var(--mb-color-border), var(--mb-color-border));
  }

  .section-head:focus-visible {
    outline: var(--mb-focus-ring);
    outline-offset: var(--mb-focus-offset);
  }

  .section-label {
    min-inline-size: 0;
  }

  .section-meta {
    display: inline-flex;
    align-items: center;
    gap: var(--mb-space-2);
    color: var(--mb-color-muted);
    font-family: var(--mb-font-body);
    font-size: var(--mb-font-size-sm);
    font-weight: 600;
  }

  .section-chevron {
    display: inline-block;
    transition: transform var(--mb-transition);
  }

  .section[data-collapsed] .section-chevron {
    transform: rotate(-90deg);
  }

  .section-rows {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-3);
    min-inline-size: 0;
  }

  .section[data-collapsed] .section-rows {
    display: none;
  }

  .ungrouped:not([data-has-content]) {
    display: none;
  }

  .empty:not([data-has-content]) {
    display: none;
  }

  :host([data-mode='table']) .frame {
    gap: 0;
    border: 1px solid var(--mb-color-border-strong);
    border-radius: var(--mb-radius-lg);
    background: var(--mb-color-surface);
    overflow: clip;
  }

  /* Sticky headers need a non-clipping ancestor. */
  :host([sticky-header][data-mode='table']) .frame {
    overflow: visible;
  }

  :host([data-mode='table']) .head {
    display: block;
    background: var(--mb-color-bg);
    border-block-end: 1px solid var(--mb-color-border);
  }

  :host([sticky-header][data-mode='table']) .head {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
    background: var(--mb-color-bg);
  }

  :host([data-mode='table']) .body {
    gap: 0;
  }

  :host([data-mode='table']) .section {
    gap: 0;
  }

  :host([data-mode='table']) .section-head {
    border: none;
    border-radius: 0;
    border-block-end: 1px solid var(--mb-color-border);
    padding-inline: var(--mb-space-4);
  }

  :host([data-mode='table']) .section-rows {
    gap: 0;
  }

  :host([data-mode='table'][density='compact']) .root {
    gap: var(--mb-space-2);
  }

  :host([data-mode='table'][density='compact']) .section-head {
    padding-inline: var(--mb-space-3);
  }

  .section[data-drop-section] {
    outline: 2px solid var(--mb-color-accent);
    outline-offset: 2px;
    border-radius: var(--mb-radius-md);
  }
`;

export const tableRowStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
  }

  .wrap {
    display: flex;
    align-items: stretch;
    gap: var(--mb-space-2);
    inline-size: 100%;
    min-inline-size: 0;
  }

  .handle,
  .spacer {
    flex: none;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    align-self: center;
  }

  .spacer {
    visibility: hidden;
  }

  .handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--mb-radius-sm);
    background: transparent;
    color: var(--mb-color-muted);
    font: inherit;
    line-height: 1;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .handle:hover {
    background: var(--mb-color-hover);
    color: var(--mb-color-fg);
  }

  .handle:focus-visible {
    outline: var(--mb-focus-ring);
    outline-offset: var(--mb-focus-offset);
  }

  .handle:active {
    cursor: grabbing;
  }

  :host(:not([data-reorderable]):not([data-reorder-spacer])) .handle,
  :host(:not([data-reorderable]):not([data-reorder-spacer])) .spacer {
    display: none;
  }

  :host([data-dragging]) {
    opacity: 0.45;
  }

  :host([data-drop='before']) {
    box-shadow: inset 0 2px 0 var(--mb-color-accent);
  }

  :host([data-drop='after']) {
    box-shadow: inset 0 -2px 0 var(--mb-color-accent);
  }

  .row {
    display: grid;
    grid-template-columns: var(--mb-table-template);
    align-items: center;
    gap: var(--mb-space-3);
    inline-size: 100%;
    min-inline-size: 0;
    flex: 1 1 auto;
  }

  :host([data-mode='table']) .wrap {
    padding-block: var(--mb-space-3);
    padding-inline: var(--mb-space-4);
    border-block-end: 1px solid var(--mb-color-border);
    background: var(--mb-color-surface);
  }

  :host([data-mode='table'][data-compact]) .wrap {
    padding-block: var(--mb-space-2);
    padding-inline: var(--mb-space-3);
  }

  :host([data-mode='table'][data-compact]) .row {
    gap: var(--mb-space-2);
  }

  :host([data-mode='table']:last-of-type) .wrap,
  :host([data-mode='table'][slot='head']) .wrap {
    border-block-end: none;
  }

  :host([slot='head']) .wrap,
  :host([head]) .wrap {
    font-size: var(--mb-font-size-sm);
    font-weight: 600;
    color: var(--mb-color-muted);
    background: transparent;
    padding-block: var(--mb-space-2);
  }

  :host([data-mode='cards']) .wrap {
    padding-block: var(--mb-space-4);
    padding-inline: var(--mb-space-4);
    background: var(--mb-color-surface);
    border: 1px solid var(--mb-color-border-strong);
    border-radius: var(--mb-radius-lg);
    box-shadow: var(--mb-shadow-sm);
  }

  :host([data-mode='cards']) .row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--mb-space-3);
  }

  :host([data-mode='cards'][data-compact]) .wrap {
    padding-block: var(--mb-space-3);
    padding-inline: var(--mb-space-3);
  }

  :host([data-mode='cards'][data-compact]) .row {
    gap: var(--mb-space-2);
  }

  :host([data-mode='cards'][slot='head']),
  :host([data-mode='cards'][head]) {
    display: none;
  }

  :host([data-mode='cards'][data-reorderable]) .handle {
    align-self: flex-start;
    margin-block-start: 0.15rem;
  }
`;

export const tableCellStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
  }

  .cell {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--mb-space-1);
    inline-size: 100%;
    min-inline-size: 0;
  }

  .label {
    display: none;
    font-size: var(--mb-font-size-sm);
    font-weight: 600;
    color: var(--mb-color-muted);
  }

  .value {
    inline-size: 100%;
    min-inline-size: 0;
    max-inline-size: 100%;
  }

  .sort {
    display: inline-flex;
    align-items: center;
    gap: var(--mb-space-1);
    max-inline-size: 100%;
    min-block-size: 1.5rem;
    margin: 0;
    padding-block: 0.125rem;
    padding-inline: 0.125rem;
    border: none;
    border-radius: var(--mb-radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: inherit;
    text-align: inherit;
    cursor: pointer;
  }

  .sort:hover {
    color: var(--mb-color-fg);
    background: var(--mb-color-hover);
  }

  .sort:focus-visible {
    outline: var(--mb-focus-ring);
    outline-offset: var(--mb-focus-offset);
  }

  .sort-indicator {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.05em;
    flex: none;
    color: var(--mb-color-fg);
    opacity: 0.55;
    font-size: 0.55em;
    line-height: 1;
  }

  .sort-caret {
    display: block;
  }

  .sort-indicator[data-direction='asc'],
  .sort-indicator[data-direction='desc'] {
    opacity: 1;
  }

  .sort-indicator[data-direction='asc'] .sort-caret-up,
  .sort-indicator[data-direction='desc'] .sort-caret-down {
    color: var(--mb-color-accent);
  }

  .sort-indicator[data-direction='asc'] .sort-caret-down,
  .sort-indicator[data-direction='desc'] .sort-caret-up {
    opacity: 0.28;
    color: var(--mb-color-muted);
  }

  .sort:hover .sort-indicator[data-direction='none'] {
    opacity: 0.8;
  }

  :host([align='center']) .cell {
    align-items: center;
    text-align: center;
  }

  :host([align='center']) .value {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--mb-space-2);
  }

  :host([align='end']) .cell {
    align-items: stretch;
    text-align: end;
  }

  :host([align='end']) .value {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--mb-space-2);
  }

  :host([data-mode='cards']) .label:not([hidden]) {
    display: block;
  }

  :host([data-mode='cards'][primary]) .value {
    font-family: var(--mb-font-display);
    font-weight: 600;
    font-size: var(--mb-font-size-md);
  }

  :host([data-mode='cards'][align='end']) .cell,
  :host([data-mode='cards'][align='center']) .cell {
    align-items: stretch;
    text-align: start;
  }

  :host([data-mode='cards'][align='end']) .value {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--mb-space-2);
  }

  /* Actions column: pin controls to the inline-end of the cell track. */
  :host([actions]) .cell {
    align-items: stretch;
    text-align: end;
  }

  :host([actions]) .value,
  :host([actions][data-mode='cards']) .value,
  :host([actions][data-mode='table']) .value {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--mb-space-2);
    inline-size: 100%;
  }
`;
