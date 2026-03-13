import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEPTH } from '../../src/configs/constants.js';

// Stub CSS import — not processed in test environment
vi.mock('../../src/styles/button.css', () => ({}));

// ── Minimal DOM stub (node env has no document) ──────────────────────────────
function makeEl(tag) {
  const classes = new Set();
  const listeners = {};
  const el = {
    tagName: tag.toUpperCase(),
    textContent: '',
    disabled: false,
    style: { width: '' },
    get className() {
      return [...classes].join(' ');
    },
    set className(v) {
      classes.clear();
      v.split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c));
    },
    classList: {
      contains: (c) => classes.has(c),
    },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] ?? [];
      listeners[ev].push(cb);
    },
    dispatchEvent: (ev) => {
      (listeners[ev.type] ?? []).forEach((cb) => cb(ev));
    },
  };
  return el;
}

/** @returns {{ scene: object, mockDom: object }} */
function makeScene() {
  const mockDom = {
    setDepth: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
  return {
    mockDom,
    scene: { add: { dom: vi.fn().mockReturnValue(mockDom) } },
  };
}

describe('Button', () => {
  let Button;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('document', { createElement: (tag) => makeEl(tag) });
    ({ Button } = await import('../../src/components/button.js'));
  });

  it('creates a <button> element at the given position', () => {
    const { scene } = makeScene();
    new Button(scene, 100, 200, 'Play', vi.fn());

    expect(scene.add.dom).toHaveBeenCalledOnce();
    const [x, y, el] = scene.add.dom.mock.calls[0];
    expect(x).toBe(100);
    expect(y).toBe(200);
    expect(el.tagName).toBe('BUTTON');
    expect(el.textContent).toBe('Play');
  });

  it('applies default variant and size classes', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn());
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.classList.contains('btn')).toBe(true);
    expect(el.classList.contains('btn-default')).toBe(true);
    expect(el.classList.contains('btn-md')).toBe(true);
  });

  it('applies custom variant class', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn(), { variant: 'danger' });
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.classList.contains('btn-danger')).toBe(true);
    expect(el.classList.contains('btn-default')).toBe(false);
  });

  it('applies custom size class', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn(), { size: 'sm' });
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.classList.contains('btn-sm')).toBe(true);
    expect(el.classList.contains('btn-md')).toBe(false);
  });

  it('applies explicit pixel width via inline style', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn(), { width: 250 });
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.style.width).toBe('250px');
  });

  it('does not set width style when option is absent', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn());
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.style.width).toBe('');
  });

  it('starts disabled when options.disabled is true', () => {
    const { scene } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn(), { disabled: true });
    const el = scene.add.dom.mock.calls[0][2];

    expect(el.disabled).toBe(true);
  });

  it('calls onClick when the button is clicked', () => {
    const { scene } = makeScene();
    const onClick = vi.fn();
    new Button(scene, 0, 0, 'X', onClick);
    const el = scene.add.dom.mock.calls[0][2];

    el.dispatchEvent({ type: 'click' });

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when the button is disabled', () => {
    const { scene } = makeScene();
    const onClick = vi.fn();
    new Button(scene, 0, 0, 'X', onClick, { disabled: true });
    const el = scene.add.dom.mock.calls[0][2];

    el.dispatchEvent({ type: 'click' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets initial depth to DEPTH.UI on the domElement', () => {
    const { scene, mockDom } = makeScene();
    new Button(scene, 0, 0, 'X', vi.fn());

    expect(mockDom.setDepth).toHaveBeenCalledWith(DEPTH.UI);
  });

  it('setDepth() delegates to domElement.setDepth', () => {
    const { scene, mockDom } = makeScene();
    const btn = new Button(scene, 0, 0, 'X', vi.fn());
    mockDom.setDepth.mockClear();

    btn.setDepth(50);

    expect(mockDom.setDepth).toHaveBeenCalledWith(50);
  });

  it('setDepth() returns the button instance for chaining', () => {
    const { scene } = makeScene();
    const btn = new Button(scene, 0, 0, 'X', vi.fn());

    expect(btn.setDepth(10)).toBe(btn);
  });

  it('destroy() calls domElement.destroy and nullifies domElement', () => {
    const { scene, mockDom } = makeScene();
    const btn = new Button(scene, 0, 0, 'X', vi.fn());

    btn.destroy();

    expect(mockDom.destroy).toHaveBeenCalledOnce();
    expect(btn.domElement).toBeNull();
  });

  it('destroy() is safe to call twice without throwing', () => {
    const { scene } = makeScene();
    const btn = new Button(scene, 0, 0, 'X', vi.fn());
    btn.destroy();

    expect(() => btn.destroy()).not.toThrow();
  });
});
