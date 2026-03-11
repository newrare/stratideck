import { describe, it, expect } from 'vitest';
import { ABILITY_REGISTRY, getAbilityDataById, getAbilityDataByKey } from '../../src/configs/ability-data.js';

describe('ability-data', () => {
  it('contains exactly 4 abilities', () => {
    expect(ABILITY_REGISTRY).toHaveLength(4);
  });

  it('all IDs are unique', () => {
    const ids = ABILITY_REGISTRY.map((a) => a.id);
    expect(new Set(ids).size).toBe(4);
  });

  it('all keys are unique', () => {
    const keys = ABILITY_REGISTRY.map((a) => a.key);
    expect(new Set(keys).size).toBe(4);
  });

  it('IDs span 1 to 4', () => {
    const ids = ABILITY_REGISTRY.map((a) => a.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(4);
  });

  it('every ability has required fields', () => {
    ABILITY_REGISTRY.forEach((ability) => {
      expect(ability.id).toBeTypeOf('number');
      expect(ability.imageKey).toBeTypeOf('string');
      expect(ability.imageKey.length).toBeGreaterThan(0);
      expect(ability.key).toBeTypeOf('string');
      expect(ability.key.length).toBeGreaterThan(0);
      expect(ability.title).toBeTypeOf('string');
      expect(ability.title.length).toBeGreaterThan(0);
      expect(ability.descriptionKey).toBeTypeOf('string');
      expect(ability.descriptionKey.length).toBeGreaterThan(0);
      expect(ability.totalUses).toBeTypeOf('number');
      expect(ability.totalUses).toBeGreaterThan(0);
      expect(ability.usesPerBattle).toBeTypeOf('number');
      expect(ability.usesPerBattle).toBeGreaterThan(0);
      expect(ability.price).toBeTypeOf('number');
      expect(ability.price).toBeGreaterThan(0);
    });
  });

  describe('getAbilityDataById', () => {
    it('returns ability data for id 1', () => {
      const ability = getAbilityDataById(1);
      expect(ability).toBeDefined();
      expect(ability.key).toBe('bomb_immunity');
    });

    it('returns ability data for id 4', () => {
      const ability = getAbilityDataById(4);
      expect(ability).toBeDefined();
      expect(ability.key).toBe('battle_heal');
    });

    it('returns undefined for non-existent id', () => {
      expect(getAbilityDataById(0)).toBeUndefined();
      expect(getAbilityDataById(99)).toBeUndefined();
    });
  });

  describe('getAbilityDataByKey', () => {
    it('returns ability data for key bomb_immunity', () => {
      const ability = getAbilityDataByKey('bomb_immunity');
      expect(ability).toBeDefined();
      expect(ability.id).toBe(1);
    });

    it('returns undefined for non-existent key', () => {
      expect(getAbilityDataByKey('nonexistent')).toBeUndefined();
    });
  });
});
