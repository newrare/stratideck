/**
 * Static registry of all 90 cards.
 * Each entry: { id, characterName, personalityKey, imageKey }
 * Type and rank are derived from the ID at runtime.
 */
export const CARD_REGISTRY = [
  // Overlord (1–9): SSS → F
  { id: 1, characterName: 'Aurelion the Unbound', personalityKey: 'tyrannical', imageKey: 'card_001' },
  { id: 2, characterName: 'Mordechai Flamegold', personalityKey: 'obsessive', imageKey: 'card_002' },
  { id: 3, characterName: 'Theodorus Ashwright', personalityKey: 'megalomaniac', imageKey: 'card_003' },
  { id: 4, characterName: 'Balthazar Leadbane', personalityKey: 'calculating', imageKey: 'card_004' },
  { id: 5, characterName: 'Ignatius Cruciblex', personalityKey: 'paranoid', imageKey: 'card_005' },
  { id: 6, characterName: 'Cornelius Goldvein', personalityKey: 'arrogant', imageKey: 'card_006' },
  { id: 7, characterName: 'Reginald Phosphorn', personalityKey: 'eccentric', imageKey: 'card_007' },
  { id: 8, characterName: 'Bartleby Tincture', personalityKey: 'absent-minded', imageKey: 'card_008' },
  { id: 9, characterName: 'Percival Bubblesnort', personalityKey: 'bumbling', imageKey: 'card_009' },

  // Warlord (10–18): SSS → F
  { id: 10, characterName: 'Ragnar Soulforge', personalityKey: 'wrathful', imageKey: 'card_010' },
  { id: 11, characterName: 'Vulcanis Emberstrike', personalityKey: 'relentless', imageKey: 'card_011' },
  { id: 12, characterName: 'Draven Bloodmix', personalityKey: 'choleric', imageKey: 'card_012' },
  { id: 13, characterName: 'Gideon Pyrehand', personalityKey: 'fierce', imageKey: 'card_013' },
  { id: 14, characterName: 'Theron Infernix', personalityKey: 'impatient', imageKey: 'card_014' },
  { id: 15, characterName: 'Magnus Ironcauldron', personalityKey: 'stubborn', imageKey: 'card_015' },
  { id: 16, characterName: 'Brutus Slagsworth', personalityKey: 'hot-headed', imageKey: 'card_016' },
  { id: 17, characterName: 'Hector Charcoalton', personalityKey: 'grumpy', imageKey: 'card_017' },
  { id: 18, characterName: 'Barnaby Boombrew', personalityKey: 'clumsy', imageKey: 'card_018' },

  // Guardian (19–27): SSS → F
  { id: 19, characterName: 'Aldric Shieldmeld', personalityKey: 'stoic', imageKey: 'card_019' },
  { id: 20, characterName: 'Orenthal Bulwark', personalityKey: 'vigilant', imageKey: 'card_020' },
  { id: 21, characterName: 'Cedric Frostward', personalityKey: 'protective', imageKey: 'card_021' },
  { id: 22, characterName: 'Benedict Ironflask', personalityKey: 'loyal', imageKey: 'card_022' },
  { id: 23, characterName: 'Gareth Barrierstone', personalityKey: 'dutiful', imageKey: 'card_023' },
  { id: 24, characterName: 'Winston Rustguard', personalityKey: 'cautious', imageKey: 'card_024' },
  { id: 25, characterName: 'Herbert Shingleton', personalityKey: 'timid', imageKey: 'card_025' },
  { id: 26, characterName: 'Gilbert Patchwall', personalityKey: 'nervous', imageKey: 'card_026' },
  { id: 27, characterName: 'Norbert Wobbleshield', personalityKey: 'cowardly', imageKey: 'card_027' },

  // Veteran (28–36): SSS → F
  { id: 28, characterName: 'Alaric Mossblend', personalityKey: 'wise', imageKey: 'card_028' },
  { id: 29, characterName: 'Silas Rootbinder', personalityKey: 'serene', imageKey: 'card_029' },
  { id: 30, characterName: 'Erasmus Herbcroft', personalityKey: 'patient', imageKey: 'card_030' },
  { id: 31, characterName: 'Leopold Vineleaf', personalityKey: 'contemplative', imageKey: 'card_031' },
  { id: 32, characterName: 'Ambrose Thornmix', personalityKey: 'pragmatic', imageKey: 'card_032' },
  { id: 33, characterName: 'Humphrey Greenbeard', personalityKey: 'jovial', imageKey: 'card_033' },
  { id: 34, characterName: 'Archibald Mulchworth', personalityKey: 'pedantic', imageKey: 'card_034' },
  { id: 35, characterName: 'Reginald Compostius', personalityKey: 'boring', imageKey: 'card_035' },
  { id: 36, characterName: 'Dilbert Weedsworth', personalityKey: 'lazy', imageKey: 'card_036' },

  // Elite (37–45): SSS → F
  { id: 37, characterName: 'Solarius Brightforge', personalityKey: 'ambitious', imageKey: 'card_037' },
  { id: 38, characterName: 'Luxor Goldenspark', personalityKey: 'confident', imageKey: 'card_038' },
  { id: 39, characterName: 'Orion Sunblast', personalityKey: 'charismatic', imageKey: 'card_039' },
  { id: 40, characterName: 'Cassius Radiance', personalityKey: 'proud', imageKey: 'card_040' },
  { id: 41, characterName: 'Dorian Gleamstitch', personalityKey: 'competitive', imageKey: 'card_041' },
  { id: 42, characterName: 'Fabian Shimmercoat', personalityKey: 'vain', imageKey: 'card_042' },
  { id: 43, characterName: 'Nigel Twinkletoe', personalityKey: 'flashy', imageKey: 'card_043' },
  { id: 44, characterName: 'Rupert Glitterbottom', personalityKey: 'dramatic', imageKey: 'card_044' },
  { id: 45, characterName: 'Cuthbert Sparkleflop', personalityKey: 'naive', imageKey: 'card_045' },

  // Vanguard (46–54): SSS → F
  { id: 46, characterName: 'Blaze Cindershot', personalityKey: 'daring', imageKey: 'card_046' },
  { id: 47, characterName: 'Fenris Scorchpath', personalityKey: 'bold', imageKey: 'card_047' },
  { id: 48, characterName: 'Rowan Ashtrail', personalityKey: 'adventurous', imageKey: 'card_048' },
  { id: 49, characterName: 'Callum Hearthstone', personalityKey: 'optimistic', imageKey: 'card_049' },
  { id: 50, characterName: 'Duncan Emberpot', personalityKey: 'reckless', imageKey: 'card_050' },
  { id: 51, characterName: 'Fergus Toastwort', personalityKey: 'enthusiastic', imageKey: 'card_051' },
  { id: 52, characterName: 'Murray Sizzlepan', personalityKey: 'hasty', imageKey: 'card_052' },
  { id: 53, characterName: 'Chester Warmflask', personalityKey: 'gullible', imageKey: 'card_053' },
  { id: 54, characterName: 'Neville Lukewarmsby', personalityKey: 'indecisive', imageKey: 'card_054' },

  // Grunt (55–63): SSS → F
  { id: 55, characterName: 'Gorak Steelpound', personalityKey: 'disciplined', imageKey: 'card_055' },
  { id: 56, characterName: 'Brom Hammersmelt', personalityKey: 'tough', imageKey: 'card_056' },
  { id: 57, characterName: 'Tormund Greybeaker', personalityKey: 'gruff', imageKey: 'card_057' },
  { id: 58, characterName: 'Ogden Slatemill', personalityKey: 'obedient', imageKey: 'card_058' },
  { id: 59, characterName: 'Brawley Cobbleston', personalityKey: 'straightforward', imageKey: 'card_059' },
  { id: 60, characterName: 'Gruntle McPestle', personalityKey: 'simple', imageKey: 'card_060' },
  { id: 61, characterName: 'Thud Meatgrinder', personalityKey: 'dull', imageKey: 'card_061' },
  { id: 62, characterName: 'Lump Porridgebrain', personalityKey: 'dim', imageKey: 'card_062' },
  { id: 63, characterName: 'Spud Puddingfoot', personalityKey: 'clueless', imageKey: 'card_063' },

  // Breacher (64–72): SSS → F
  { id: 64, characterName: 'Sapphox Tunnelmole', personalityKey: 'cunning', imageKey: 'card_064' },
  { id: 65, characterName: 'Dredge Earthclaw', personalityKey: 'resourceful', imageKey: 'card_065' },
  { id: 66, characterName: 'Varro Mudbore', personalityKey: 'persistent', imageKey: 'card_066' },
  { id: 67, characterName: 'Mortimer Claymix', personalityKey: 'methodical', imageKey: 'card_067' },
  { id: 68, characterName: 'Jasper Ditchworth', personalityKey: 'reserved', imageKey: 'card_068' },
  { id: 69, characterName: 'Roscoe Sandblast', personalityKey: 'sneaky', imageKey: 'card_069' },
  { id: 70, characterName: 'Filbert Mudpuddle', personalityKey: 'mischievous', imageKey: 'card_070' },
  { id: 71, characterName: 'Barnacle Dirtsworth', personalityKey: 'scatterbrained', imageKey: 'card_071' },
  { id: 72, characterName: 'Worm Crumbleton', personalityKey: 'forgetful', imageKey: 'card_072' },

  // Runner (73–81): SSS → F
  { id: 73, characterName: 'Sylvix Windstep', personalityKey: 'agile', imageKey: 'card_073' },
  { id: 74, characterName: 'Zephyr Quickbrew', personalityKey: 'restless', imageKey: 'card_074' },
  { id: 75, characterName: 'Dash Alchemile', personalityKey: 'energetic', imageKey: 'card_075' },
  { id: 76, characterName: 'Fleet Potionfoot', personalityKey: 'playful', imageKey: 'card_076' },
  { id: 77, characterName: 'Skipper Greenleap', personalityKey: 'carefree', imageKey: 'card_077' },
  { id: 78, characterName: 'Twig Mossrunner', personalityKey: 'curious', imageKey: 'card_078' },
  { id: 79, characterName: 'Fidget Leafwhirl', personalityKey: 'hyperactive', imageKey: 'card_079' },
  { id: 80, characterName: 'Wobble Sproutspin', personalityKey: 'dizzy', imageKey: 'card_080' },
  { id: 81, characterName: 'Tumble Grasshopper', personalityKey: 'scatterbrained', imageKey: 'card_081' },

  // Assassin (82–90): SSS → F
  { id: 82, characterName: 'Nyx Shadowdistill', personalityKey: 'cold', imageKey: 'card_082' },
  { id: 83, characterName: 'Vesper Nightshade', personalityKey: 'mysterious', imageKey: 'card_083' },
  { id: 84, characterName: 'Raven Venomcraft', personalityKey: 'calculating', imageKey: 'card_084' },
  { id: 85, characterName: 'Shade Hemlocke', personalityKey: 'silent', imageKey: 'card_085' },
  { id: 86, characterName: 'Dagger Belladonna', personalityKey: 'ruthless', imageKey: 'card_086' },
  { id: 87, characterName: 'Slink Arsenic', personalityKey: 'sarcastic', imageKey: 'card_087' },
  { id: 88, characterName: 'Whisper Wolfsbane', personalityKey: 'brooding', imageKey: 'card_088' },
  { id: 89, characterName: 'Sneak Toadstool', personalityKey: 'jumpy', imageKey: 'card_089' },
  { id: 90, characterName: 'Puddle Inkblot', personalityKey: 'melodramatic', imageKey: 'card_090' },
];

/**
 * Get card data by ID.
 * @param {number} id
 * @returns {object|undefined}
 */
export function getCardDataById(id) {
  return CARD_REGISTRY.find((c) => c.id === id);
}
