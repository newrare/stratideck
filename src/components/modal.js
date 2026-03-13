import '../styles/modal.css';

/**
 * Reusable modal overlay — DOM-based, Overlord Violet theme.
 *
 * Appends directly to document.body so it covers the full Phaser canvas.
 * Animates in on open. Closes on ESC or backdrop click.
 *
 * @example
 * // Basic confirm / cancel (backward-compatible API)
 * new Modal(scene, {
 *   title: 'Reset progress?',
 *   body: 'This action <strong>cannot</strong> be undone.',
 *   confirmLabel: 'Reset',
 *   cancelLabel: 'Cancel',
 *   onConfirm: () => resetGame(),
 * });
 *
 * @example
 * // Rich content
 * new Modal(scene, {
 *   badge: '⚔ Rank Up',
 *   title: 'Sentinel Mk-IV',
 *   subtitle: 'Heavy Assault · Elite',
 *   stats: [{ val: 42, lbl: 'ATK' }, { val: 31, lbl: 'DEF' }, { val: 18, lbl: 'SPD' }],
 *   confirmLabel: 'Deploy',
 *   centered: true,
 * });
 */
export class Modal {
  /**
   * @param {Phaser.Scene} _scene - Scene context (kept for backward-compatible API).
   * @param {object}  options
   * @param {string}  options.title                        - Modal heading.
   * @param {string}  [options.subtitle]                   - Small subtitle below the heading.
   * @param {string}  [options.badge]                      - Badge chip text shown above the title.
   * @param {string}  [options.body]                       - Body HTML (developer-controlled strings only).
   * @param {string}  [options.rankStar]                   - Large rotating star emoji above title.
   * @param {string}  [options.iconRing]                   - Pulsing icon ring (emoji) above title.
   * @param {string}  [options.iconBig]                    - Large centered icon (emoji) above title.
   * @param {{icon:string, name:string, role:string}} [options.portrait] - Unit portrait block.
   * @param {Array<{val:string|number, lbl:string}>} [options.stats]    - Stat cells (1–3).
   * @param {string[]} [options.listItems]                 - Bullet list items (HTML strings).
   * @param {{text:string, cite:string}} [options.quote]   - Lore quote block.
   * @param {Array<{label:string, value:number}>} [options.progress]    - Progress bars (0–100).
   * @param {string}  [options.alert]                      - Danger alert bar HTML.
   * @param {boolean} [options.centered]                   - Center all text & footer buttons.
   * @param {string}  [options.confirmLabel]               - Confirm button label (default: 'OK').
   * @param {()=>void} [options.onConfirm]                 - Confirm callback.
   * @param {string}  [options.cancelLabel]                - Cancel button label. Omit to hide.
   * @param {()=>void} [options.onCancel]                  - Cancel callback.
   * @param {boolean} [options.closeOnBackdrop]            - Close on backdrop click (default: true).
   */
  constructor(_scene, options) {
    this._onKeyDown = this._onKeyDown.bind(this);

    // ── Overlay ──────────────────────────────────────────────
    this._overlay = document.createElement('div');
    this._overlay.className = 'm-overlay';

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'm-backdrop';
    if (options.closeOnBackdrop !== false) {
      backdrop.addEventListener('click', () => this.destroy());
    }

    // Shell (conic ring + box wrapper)
    const shell = document.createElement('div');
    shell.className = 'm-shell';

    const box = document.createElement('div');
    box.className = options.centered ? 'm-box m-centered' : 'm-box';

    // ── Content slots ─────────────────────────────────────────

    if (options.rankStar) {
      const el = document.createElement('span');
      el.className = 'm-rank-star';
      el.textContent = options.rankStar;
      box.appendChild(el);
    }

    if (options.iconRing) {
      const el = document.createElement('div');
      el.className = 'm-icon-ring';
      el.textContent = options.iconRing;
      box.appendChild(el);
    }

    if (options.iconBig) {
      const el = document.createElement('span');
      el.className = 'm-icon-big';
      el.textContent = options.iconBig;
      box.appendChild(el);
    }

    if (options.badge) {
      const el = document.createElement('span');
      el.className = 'm-badge';
      el.textContent = options.badge;
      box.appendChild(el);
    }

    if (options.portrait) {
      const row = document.createElement('div');
      row.className = 'm-portrait-row';

      const img = document.createElement('div');
      img.className = 'm-portrait';
      img.textContent = options.portrait.icon;

      const info = document.createElement('div');

      const name = document.createElement('div');
      name.className = 'm-portrait-name';
      name.textContent = options.portrait.name;

      const role = document.createElement('div');
      role.className = 'm-portrait-role';
      role.textContent = options.portrait.role;

      info.appendChild(name);
      info.appendChild(role);
      row.appendChild(img);
      row.appendChild(info);
      box.appendChild(row);
    }

    if (options.title) {
      const el = document.createElement('span');
      el.className = 'm-title';
      el.textContent = options.title;
      box.appendChild(el);
    }

    if (options.subtitle) {
      const el = document.createElement('span');
      el.className = 'm-subtitle';
      el.textContent = options.subtitle;
      box.appendChild(el);
    }

    if (options.stats?.length) {
      const grid = document.createElement('div');
      grid.className = 'm-stat-grid';
      grid.style.gridTemplateColumns = `repeat(${Math.min(options.stats.length, 3)}, 1fr)`;
      options.stats.forEach((s) => {
        const cell = document.createElement('div');
        cell.className = 'm-stat-cell';

        const val = document.createElement('div');
        val.className = 'm-stat-val';
        val.textContent = String(s.val);

        const lbl = document.createElement('div');
        lbl.className = 'm-stat-lbl';
        lbl.textContent = s.lbl;

        cell.appendChild(val);
        cell.appendChild(lbl);
        grid.appendChild(cell);
      });
      box.appendChild(grid);
    }

    if (options.alert) {
      const el = document.createElement('div');
      el.className = 'm-alert-bar';
      el.innerHTML = options.alert;
      box.appendChild(el);
    }

    if (options.quote) {
      const el = document.createElement('blockquote');
      el.className = 'm-quote';
      const cite = document.createElement('cite');
      cite.textContent = options.quote.cite;
      el.textContent = options.quote.text;
      el.appendChild(cite);
      box.appendChild(el);
    }

    if (options.body) {
      const el = document.createElement('p');
      el.className = 'm-body';
      el.innerHTML = options.body;
      box.appendChild(el);
    }

    if (options.listItems?.length) {
      const ul = document.createElement('ul');
      ul.className = 'm-list';
      options.listItems.forEach((item) => {
        const li = document.createElement('li');

        const dot = document.createElement('span');
        dot.className = 'm-list-dot';

        const text = document.createElement('span');
        text.innerHTML = item;

        li.appendChild(dot);
        li.appendChild(text);
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }

    if (options.progress?.length) {
      options.progress.forEach((p) => {
        const wrap = document.createElement('div');
        wrap.className = 'm-progress-wrap';

        const label = document.createElement('div');
        label.className = 'm-progress-label';

        const labelText = document.createElement('span');
        labelText.textContent = p.label;
        const labelVal = document.createElement('span');
        labelVal.textContent = `${p.value}%`;
        label.appendChild(labelText);
        label.appendChild(labelVal);

        const track = document.createElement('div');
        track.className = 'm-progress-track';

        const fill = document.createElement('div');
        fill.className = 'm-progress-fill';
        fill.style.width = `${p.value}%`;

        track.appendChild(fill);
        wrap.appendChild(label);
        wrap.appendChild(track);
        box.appendChild(wrap);
      });
    }

    // ── Footer buttons ────────────────────────────────────────
    const footer = document.createElement('div');
    footer.className = 'm-footer';

    if (options.cancelLabel) {
      const btn = document.createElement('button');
      btn.className = 'm-btn-ghost';
      btn.textContent = options.cancelLabel;
      btn.addEventListener('click', () => {
        this.destroy();
        options.onCancel?.();
      });
      footer.appendChild(btn);
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'm-btn-main';
    confirmBtn.textContent = options.confirmLabel ?? 'OK';
    confirmBtn.addEventListener('click', () => {
      this.destroy();
      options.onConfirm?.();
    });
    footer.appendChild(confirmBtn);

    box.appendChild(footer);
    shell.appendChild(box);
    this._overlay.appendChild(backdrop);
    this._overlay.appendChild(shell);
    document.body.appendChild(this._overlay);

    document.addEventListener('keydown', this._onKeyDown);

    // Trigger open animation on the next frame
    requestAnimationFrame(() => this._overlay?.classList.add('m-open'));
  }

  /** @private */
  _onKeyDown(e) {
    if (e.key === 'Escape') this.destroy();
  }

  /** Remove the modal from the DOM and clean up listeners. */
  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    this._overlay?.remove();
    this._overlay = null;
  }
}
