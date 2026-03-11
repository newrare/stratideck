/**
 * Static registry of all abilities.
 * Each entry: { id, imageKey, key, title, descriptionKey, totalUses, usesPerBattle, price }
 */
export const ABILITY_REGISTRY = [
  {
    id: 1,
    imageKey: 'ability_001',
    key: 'bomb_immunity',
    title: 'Bomb Immunity',
    descriptionKey: 'ability.bomb_immunity.description',
    totalUses: 5,
    usesPerBattle: 1,
    price: 200,
  },
  {
    id: 2,
    imageKey: 'ability_002',
    key: 'reveal_enemy',
    title: 'Reveal Enemy',
    descriptionKey: 'ability.reveal_enemy.description',
    totalUses: 3,
    usesPerBattle: 1,
    price: 350,
  },
  {
    id: 3,
    imageKey: 'ability_003',
    key: 'return_to_deck',
    title: 'Return to Deck',
    descriptionKey: 'ability.return_to_deck.description',
    totalUses: 4,
    usesPerBattle: 1,
    price: 300,
  },
  {
    id: 4,
    imageKey: 'ability_004',
    key: 'battle_heal',
    title: 'Battle Heal',
    descriptionKey: 'ability.battle_heal.description',
    totalUses: 6,
    usesPerBattle: 2,
    price: 250,
  },
];

/**
 * Retrieve ability data by its numeric ID.
 * @param {number} id
 * @returns {object|undefined}
 */
export function getAbilityDataById(id) {
  return ABILITY_REGISTRY.find((a) => a.id === id);
}

/**
 * Retrieve ability data by its unique key.
 * @param {string} key
 * @returns {object|undefined}
 */
export function getAbilityDataByKey(key) {
  return ABILITY_REGISTRY.find((a) => a.key === key);
}
