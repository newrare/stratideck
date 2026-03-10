import { describe, it, expect } from 'vitest';
import { StateManager } from '../../src/managers/state-manager.js';

describe('StateManager', () => {
  it('stores and retrieves values', () => {
    const sm = new StateManager();
    sm.set('score', 42);
    expect(sm.get('score')).toBe(42);
  });

  it('returns undefined for unknown keys', () => {
    const sm = new StateManager();
    expect(sm.get('unknown')).toBeUndefined();
  });

  it('notifies listeners on change', () => {
    const sm = new StateManager();
    let received = null;
    sm.on('health', (val) => {
      received = val;
    });
    sm.set('health', 100);
    expect(received).toBe(100);
  });

  it('unsubscribes correctly', () => {
    const sm = new StateManager();
    let count = 0;
    const unsub = sm.on('x', () => {
      count++;
    });
    sm.set('x', 1);
    unsub();
    sm.set('x', 2);
    expect(count).toBe(1);
  });

  it('clears listeners for a specific key', () => {
    const sm = new StateManager();
    let called = false;
    sm.on('key', () => {
      called = true;
    });
    sm.clear('key');
    sm.set('key', 'val');
    expect(called).toBe(false);
  });
});
