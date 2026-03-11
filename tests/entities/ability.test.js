import { describe, it, expect } from 'vitest';
import { Ability } from '../../src/entities/ability.js';
import { ABILITY_REGISTRY } from '../../src/configs/ability-data.js';

describe('Ability', () => {
  describe('Ability.fromId', () => {
    it('creates an ability from id 1 (bomb_immunity)', () => {
      const ability = Ability.fromId(1);
      expect(ability.id).toBe(1);
      expect(ability.key).toBe('bomb_immunity');
      expect(ability.title).toBe('Bomb Immunity');
      expect(ability.totalUses).toBe(5);
      expect(ability.usesPerBattle).toBe(1);
      expect(ability.price).toBe(200);
    });

    it('creates an ability from id 4 (battle_heal)', () => {
      const ability = Ability.fromId(4);
      expect(ability.id).toBe(4);
      expect(ability.key).toBe('battle_heal');
      expect(ability.title).toBe('Battle Heal');
      expect(ability.totalUses).toBe(6);
      expect(ability.usesPerBattle).toBe(2);
      expect(ability.price).toBe(250);
    });

    it('throws for invalid id', () => {
      expect(() => Ability.fromId(0)).toThrow('Ability ID 0 not found');
      expect(() => Ability.fromId(99)).toThrow('Ability ID 99 not found');
    });
  });

  describe('Ability properties', () => {
    it('has owned set to false by default', () => {
      const ability = Ability.fromId(1);
      expect(ability.owned).toBe(false);
    });

    it('has a descriptionKey matching the registry', () => {
      const ability = Ability.fromId(2);
      expect(ability.descriptionKey).toBe('ability.reveal_enemy.description');
    });

    it('has a valid imageKey', () => {
      const ability = Ability.fromId(1);
      expect(ability.imageKey).toBe('ability_001');
    });

    it('owned can be toggled', () => {
      const ability = Ability.fromId(1);
      expect(ability.owned).toBe(false);
      ability.owned = true;
      expect(ability.owned).toBe(true);
    });
  });

  describe('Ability.getAll', () => {
    it('returns all 4 abilities', () => {
      const all = Ability.getAll();
      expect(all).toHaveLength(4);
    });

    it('all abilities are Ability instances', () => {
      const all = Ability.getAll();
      all.forEach((ability) => {
        expect(ability).toBeInstanceOf(Ability);
      });
    });

    it('all IDs are present and unique', () => {
      const all = Ability.getAll();
      const ids = all.map((a) => a.id);
      expect(new Set(ids).size).toBe(4);
      for (let i = 1; i <= 4; i++) {
        expect(ids).toContain(i);
      }
    });

    it('all keys are unique', () => {
      const all = Ability.getAll();
      const keys = all.map((a) => a.key);
      expect(new Set(keys).size).toBe(4);
    });
  });

  describe('consistency', () => {
    it('every registry entry can be instantiated', () => {
      ABILITY_REGISTRY.forEach((data) => {
        const ability = Ability.fromId(data.id);
        expect(ability.key).toBe(data.key);
        expect(ability.title).toBe(data.title);
        expect(ability.imageKey).toBe(data.imageKey);
        expect(ability.descriptionKey).toBe(data.descriptionKey);
        expect(ability.totalUses).toBe(data.totalUses);
        expect(ability.usesPerBattle).toBe(data.usesPerBattle);
        expect(ability.price).toBe(data.price);
      });
    });
  });
});
