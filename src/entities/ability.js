import { ABILITY_REGISTRY, getAbilityDataById } from '../configs/ability-data.js';

/**
 * Ability entity — pure data class, no Phaser dependency.
 * Holds all properties for a single ability.
 */
export class Ability {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.imageKey
   * @param {string} params.key
   * @param {string} params.title
   * @param {string} params.descriptionKey
   * @param {number} params.totalUses
   * @param {number} params.usesPerBattle
   * @param {number} params.price
   */
  constructor({ id, imageKey, key, title, descriptionKey, totalUses, usesPerBattle, price }) {
    /** @type {number} */
    this.id = id;
    /** @type {string} */
    this.imageKey = imageKey;
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.title = title;
    /** @type {string} */
    this.descriptionKey = descriptionKey;
    /** @type {number} */
    this.totalUses = totalUses;
    /** @type {number} */
    this.usesPerBattle = usesPerBattle;
    /** @type {number} */
    this.price = price;
    /** @type {boolean} */
    this.owned = false;
  }

  /**
   * Create an Ability from its registry ID.
   * @param {number} id
   * @returns {Ability}
   */
  static fromId(id) {
    const data = getAbilityDataById(id);
    if (!data) {
      throw new Error(`Ability ID ${id} not found in registry.`);
    }
    return new Ability(data);
  }

  /**
   * Get all abilities as Ability instances.
   * @returns {Ability[]}
   */
  static getAll() {
    return ABILITY_REGISTRY.map((data) => new Ability(data));
  }
}
