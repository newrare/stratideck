/**
 * Card type definitions.
 * Each type has a name, ID range, and 9 color nuances (index 0 = SSS, 8 = F).
 * Colors go from most intense/dark (SSS) to lightest (F).
 */
export const CARD_TYPES = [
  {
    name: 'Overlord',
    startId: 1,
    endId: 9,
    colors: [
      0x4b0082, 0x5c109e, 0x6d20ba, 0x7e30d6, 0x9040f2,
      0xa260f4, 0xb480f6, 0xc6a0f8, 0xd8c0fa,
    ],
  },
  {
    name: 'Warlord',
    startId: 10,
    endId: 18,
    colors: [
      0x8b0000, 0xa01010, 0xb52020, 0xca3030, 0xdc4040,
      0xe05555, 0xe87070, 0xf09090, 0xf5b0b0,
    ],
  },
  {
    name: 'Guardian',
    startId: 19,
    endId: 27,
    colors: [
      0x003366, 0x0a4a80, 0x14609a, 0x1e78b4, 0x2890ce,
      0x45a0d8, 0x68b4e2, 0x90c8ec, 0xb8dcf6,
    ],
  },
  {
    name: 'Veteran',
    startId: 28,
    endId: 36,
    colors: [
      0x006400, 0x107810, 0x208c20, 0x30a030, 0x40b440,
      0x58c458, 0x74d474, 0x94e494, 0xb4f4b4,
    ],
  },
  {
    name: 'Elite',
    startId: 37,
    endId: 45,
    colors: [
      0xb8860b, 0xc89820, 0xd4a830, 0xe0b840, 0xecc850,
      0xf0d468, 0xf4e080, 0xf8ec98, 0xfcf4b8,
    ],
  },
  {
    name: 'Vanguard',
    startId: 46,
    endId: 54,
    colors: [
      0xcc5500, 0xd86810, 0xe47a20, 0xee8c30, 0xf49e40,
      0xf6ae58, 0xf8be74, 0xface94, 0xfcdeb8,
    ],
  },
  {
    name: 'Grunt',
    startId: 55,
    endId: 63,
    colors: [
      0x3a3a3a, 0x505050, 0x666666, 0x7c7c7c, 0x929292,
      0xa6a6a6, 0xbababa, 0xd0d0d0, 0xe4e4e4,
    ],
  },
  {
    name: 'Breacher',
    startId: 64,
    endId: 72,
    colors: [
      0x4a2800, 0x5c3810, 0x6e4820, 0x805830, 0x926840,
      0xa47c58, 0xb69474, 0xc8ac94, 0xdac4b8,
    ],
  },
  {
    name: 'Runner',
    startId: 73,
    endId: 81,
    colors: [
      0x2e8b57, 0x3e9b66, 0x4eab76, 0x5ebb86, 0x6ecb96,
      0x82d5a6, 0x98dfb8, 0xb0e9cc, 0xc8f3e0,
    ],
  },
  {
    name: 'Assassin',
    startId: 82,
    endId: 90,
    colors: [
      0x0a0a0a, 0x1a1a1a, 0x2a2a2a, 0x3a3a3a, 0x4a4a4a,
      0x5a5a5a, 0x6a6a6a, 0x7a7a7a, 0x8a8a8a,
    ],
  },
];

/**
 * Get the type definition for a given card ID.
 * @param {number} id - Card ID (1–90).
 * @returns {object|undefined}
 */
export function getTypeById(id) {
  return CARD_TYPES.find((t) => id >= t.startId && id <= t.endId);
}

/**
 * Get the type definition by name.
 * @param {string} name - e.g. 'Overlord'
 * @returns {object|undefined}
 */
export function getTypeByName(name) {
  return CARD_TYPES.find((t) => t.name === name);
}
