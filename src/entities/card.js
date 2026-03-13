import { CARD_REGISTRY, getCardDataById } from '../configs/card-data.js';
import { getTypeById } from '../configs/card-types.js';
import { RANKS } from '../configs/card-ranks.js';

/**
 * Card entity — pure data class, no Phaser dependency.
 * Holds all computed properties derived from type and rank.
 */
export class Card {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.characterName
   * @param {string} params.personalityKey
   * @param {string} params.imageKey
   * @param {object} params.type - Type definition from card-types.js
   * @param {object} params.rank - Rank definition from card-ranks.js
   */
  constructor({ id, characterName, personalityKey, imageKey, type, rank }) {
    /** @type {number} */
    this.id = id;
    /** @type {string} */
    this.characterName = characterName;
    /** @type {string} */
    this.personalityKey = personalityKey;
    /** @type {string} */
    this.imageKey = imageKey;
    /** @type {string} */
    this.typeName = type.name;
    /** @type {number} */
    this.typeLevel = type.level;
    /** @type {string} */
    this.rankLabel = rank.label;
    /** @type {number} */
    this.dropRate = rank.dropRate;
    /** @type {Object<string, string>} CSS custom properties for DOM rendering */
    this.css = type.css;
    /** @type {Array<null>} */
    this.abilities = [null, null, null];
  }

  /**
   * i18n key for the type description.
   * @returns {string}
   */
  get descriptionKey() {
    return `card.type.${this.typeName.toLowerCase()}`;
  }

  /**
   * i18n key for the personality trait.
   * @returns {string}
   */
  get personalityI18nKey() {
    return `card.personality.${this.personalityKey}`;
  }

  /**
   * Create a Card from its registry ID.
   * @param {number} id - 1–90
   * @returns {Card}
   */
  static fromId(id) {
    const data = getCardDataById(id);
    if (!data) {
      throw new Error(`Card ID ${id} not found in registry.`);
    }

    const type = getTypeById(id);
    if (!type) {
      throw new Error(`No type found for card ID ${id}.`);
    }

    const rankIndex = id - type.startId;
    const rank = RANKS[rankIndex];

    return new Card({
      id: data.id,
      characterName: data.characterName,
      personalityKey: data.personalityKey,
      imageKey: data.imageKey,
      type,
      rank,
    });
  }

  /**
   * Drop a random card based on weighted rank drop rates,
   * then pick a random type for that rank.
   * @returns {Card}
   */
  static dropRandom() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    let selectedRankIndex = RANKS.length - 1;

    for (let i = 0; i < RANKS.length; i++) {
      cumulative += RANKS[i].dropRate;
      if (roll < cumulative) {
        selectedRankIndex = i;
        break;
      }
    }

    const typeIndex = Math.floor(Math.random() * 10);
    const type = getTypeById(typeIndex * 9 + 1);
    const cardId = type.startId + selectedRankIndex;

    return Card.fromId(cardId);
  }

  /**
   * Get all 90 cards as Card instances.
   * @returns {Card[]}
   */
  static getAll() {
    return CARD_REGISTRY.map((data) => Card.fromId(data.id));
  }
}
