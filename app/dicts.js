const movesDict = {
  "1": "Thunder Shock",
  "2": "Quick Attack",
  "3": "Scratch",
  "4": "Ember",
  "5": "Vine Whip",
  "6": "Tackle",
  "7": "Razor Leaf",
  "8": "Take Down",
  "9": "Water Gun",
  "10": "Bite",
  "11": "Pound",
  "12": "Double Slap",
  "13": "Wrap",
  "14": "Hyper Beam",
  "15": "Lick",
  "16": "Dark Pulse",
  "17": "Smog",
  "18": "Sludge",
  "19": "Metal Claw",
  "20": "Vice Grip",
  "21": "Flame Wheel",
  "22": "Megahorn",
  "23": "Wing Attack",
  "24": "Flamethrower",
  "25": "Sucker Punch",
  "26": "Dig",
  "27": "Low Kick",
  "28": "Cross Chop",
  "29": "Psycho Cut",
  "30": "Psybeam",
  "31": "Earthquake",
  "32": "Stone Edge",
  "33": "Ice Punch",
  "34": "Heart Stamp",
  "35": "Discharge",
  "36": "Flash Cannon",
  "37": "Peck",
  "38": "Drill Peck",
  "39": "Ice Beam",
  "40": "Blizzard",
  "41": "Air Slash",
  "42": "Heat Wave",
  "43": "Twineedle",
  "44": "Poison Jab",
  "45": "Aerial Ace",
  "46": "Drill Run",
  "47": "Petal Blizzard",
  "48": "Mega Drain",
  "49": "Bug Buzz",
  "50": "Poison Fang",
  "51": "Night Slash",
  "52": "Slash",
  "53": "Bubble Beam",
  "54": "Submission",
  "55": "Karate Chop",
  "56": "Low Sweep",
  "57": "Aqua Jet",
  "58": "Aqua Tail",
  "59": "Seed Bomb",
  "60": "Psyshock",
  "61": "Rock Throw",
  "62": "Ancient Power",
  "63": "Rock Tomb",
  "64": "Rock Slide",
  "65": "Power Gem",
  "66": "Shadow Sneak",
  "67": "Shadow Punch",
  "68": "Shadow Claw",
  "69": "Ominous Wind",
  "70": "Shadow Ball",
  "71": "Bullet Punch",
  "72": "Magnet Bomb",
  "73": "Steel Wing",
  "74": "Iron Head",
  "75": "Parabolic Charge",
  "76": "Spark",
  "77": "Thunder Punch",
  "78": "Thunder",
  "79": "Thunderbolt",
  "80": "Twister",
  "81": "Dragon Breath",
  "82": "Dragon Pulse",
  "83": "Dragon Claw",
  "84": "Disarming Voice",
  "85": "Draining Kiss",
  "86": "Dazzling Gleam",
  "87": "Moonblast",
  "88": "Play Rough",
  "89": "Cross Poison",
  "90": "Sludge Bomb",
  "91": "Sludge Wave",
  "92": "Gunk Shot",
  "93": "Mud Shot",
  "94": "Bone Club",
  "95": "Bulldoze",
  "96": "Mud Bomb",
  "97": "Fury Cutter",
  "98": "Bug Bite",
  "99": "Signal Beam",
  "100": "X Scissor",
  "101": "Flame Charge",
  "102": "Flame Burst",
  "103": "Fire Blast",
  "104": "Brine",
  "105": "Water Pulse",
  "106": "Scald",
  "107": "Hydro Pump",
  "108": "Psychic",
  "109": "Psystrike",
  "110": "Ice Shard",
  "111": "Icy Wind",
  "112": "Frost Breath",
  "113": "Absorb",
  "114": "Giga Drain",
  "115": "Fire Punch",
  "116": "Solar Beam",
  "117": "Leaf Blade",
  "118": "Power Whip",
  "119": "Splash",
  "120": "Acid",
  "121": "Air Cutter",
  "122": "Hurricane",
  "123": "Brick Break",
  "124": "Cut",
  "125": "Swift",
  "126": "Horn Attack",
  "127": "Stomp",
  "128": "Headbutt",
  "129": "Hyper Fang",
  "130": "Slam",
  "131": "Body Slam",
  "132": "Rest",
  "133": "Struggle",
  "134": "Scald Blastoise",
  "135": "Hydro Pump Blastoise",
  "136": "Wrap Green",
  "137": "Wrap Pink",
  "200": "Fury Cutter",
  "201": "Bug Bite",
  "202": "Bite",
  "203": "Sucker Punch",
  "204": "Dragon Breath",
  "205": "Thunder Shock",
  "206": "Spark",
  "207": "Low Kick",
  "208": "Karate Chop",
  "209": "Ember",
  "210": "Wing Attack",
  "211": "Peck",
  "212": "Lick",
  "213": "Shadow Claw",
  "214": "Vine Whip",
  "215": "Razor Leaf",
  "216": "Mud Shot",
  "217": "Ice Shard",
  "218": "Frost Breath",
  "219": "Quick Attack",
  "220": "Scratch",
  "221": "Tackle",
  "222": "Pound",
  "223": "Cut",
  "224": "Poison Jab",
  "225": "Acid",
  "226": "Psycho Cut",
  "227": "Rock Throw",
  "228": "Metal Claw",
  "229": "Bullet Punch",
  "230": "Water Gun",
  "231": "Splash",
  "232": "Water Gun",
  "233": "Mud Slap",
  "234": "Zen Headbutt",
  "235": "Confusion",
  "236": "Poison Sting",
  "237": "Bubble",
  "238": "Feint Attack",
  "239": "Steel Wing",
  "240": "Fire Fang",
  "241": "Rock Smash",
  "242": "Transform",
  "243": "Counter",
  "244": "Powder Snow",
  "245": "Close Combat",
  "246": "Dynamic Punch",
  "247": "Focus Blast",
  "248": "Aurora Beam",
  "249": "Charge Beam",
  "250": "Volt Switch",
  "251": "Wild Charge",
  "252": "Zap Cannon",
  "253": "Dragon Tail",
  "254": "Avalanche",
  "255": "Air Slash",
  "256": "Brave Bird",
  "257": "Sky Attack",
  "258": "Sand Tomb",
  "259": "Rock Blast",
  "260": "Infestation",
  "261": "Struggle Bug",
  "262": "Silver Wind",
  "263": "Astonish",
  "264": "Hex",
  "265": "Night Shade",
  "266": "Iron Tail",
  "267": "Gyro Ball",
  "268": "Heavy Slam",
  "269": "Fire Spin",
  "270": "Overheat",
  "271": "Bullet Seed",
  "272": "Grass Knot",
  "273": "Energy Ball",
  "274": "Extrasensory",
  "275": "Futuresight",
  "276": "Mirror Coat",
  "277": "Outrage",
  "278": "Snarl",
  "279": "Crunch",
  "280": "Foul Play",
  "281": "Hidden Power"
}

const baseStatsDict = {
  "1": [
    118,
    118,
    90
  ],
  "2": [
    151,
    151,
    120
  ],
  "3": [
    198,
    198,
    160
  ],
  "4": [
    116,
    96,
    78
  ],
  "5": [
    158,
    129,
    116
  ],
  "6": [
    223,
    176,
    156
  ],
  "7": [
    94,
    122,
    88
  ],
  "8": [
    126,
    155,
    118
  ],
  "9": [
    171,
    210,
    158
  ],
  "10": [
    55,
    62,
    90
  ],
  "11": [
    45,
    94,
    100
  ],
  "12": [
    167,
    151,
    120
  ],
  "13": [
    63,
    55,
    80
  ],
  "14": [
    46,
    86,
    90
  ],
  "15": [
    169,
    150,
    130
  ],
  "16": [
    85,
    76,
    80
  ],
  "17": [
    117,
    108,
    126
  ],
  "18": [
    166,
    157,
    166
  ],
  "19": [
    103,
    70,
    60
  ],
  "20": [
    161,
    144,
    110
  ],
  "21": [
    112,
    61,
    80
  ],
  "22": [
    182,
    135,
    130
  ],
  "23": [
    110,
    102,
    70
  ],
  "24": [
    167,
    158,
    120
  ],
  "25": [
    112,
    101,
    70
  ],
  "26": [
    193,
    165,
    120
  ],
  "27": [
    126,
    145,
    100
  ],
  "28": [
    182,
    202,
    150
  ],
  "29": [
    86,
    94,
    110
  ],
  "30": [
    117,
    126,
    140
  ],
  "31": [
    180,
    174,
    180
  ],
  "32": [
    105,
    76,
    92
  ],
  "33": [
    137,
    112,
    122
  ],
  "34": [
    204,
    157,
    162
  ],
  "35": [
    107,
    116,
    140
  ],
  "36": [
    178,
    171,
    190
  ],
  "37": [
    96,
    122,
    76
  ],
  "38": [
    169,
    204,
    146
  ],
  "39": [
    80,
    44,
    230
  ],
  "40": [
    156,
    93,
    280
  ],
  "41": [
    83,
    76,
    80
  ],
  "42": [
    161,
    153,
    150
  ],
  "43": [
    131,
    116,
    90
  ],
  "44": [
    153,
    139,
    120
  ],
  "45": [
    202,
    170,
    150
  ],
  "46": [
    121,
    99,
    70
  ],
  "47": [
    165,
    146,
    120
  ],
  "48": [
    100,
    102,
    120
  ],
  "49": [
    179,
    150,
    140
  ],
  "50": [
    109,
    88,
    20
  ],
  "51": [
    167,
    147,
    70
  ],
  "52": [
    92,
    81,
    80
  ],
  "53": [
    150,
    139,
    130
  ],
  "54": [
    122,
    96,
    100
  ],
  "55": [
    191,
    163,
    160
  ],
  "56": [
    148,
    87,
    80
  ],
  "57": [
    207,
    144,
    130
  ],
  "58": [
    136,
    96,
    110
  ],
  "59": [
    227,
    166,
    180
  ],
  "60": [
    101,
    82,
    80
  ],
  "61": [
    130,
    130,
    130
  ],
  "62": [
    182,
    187,
    180
  ],
  "63": [
    195,
    103,
    50
  ],
  "64": [
    232,
    138,
    80
  ],
  "65": [
    271,
    194,
    110
  ],
  "66": [
    137,
    88,
    140
  ],
  "67": [
    177,
    130,
    160
  ],
  "68": [
    234,
    162,
    180
  ],
  "69": [
    139,
    64,
    100
  ],
  "70": [
    172,
    95,
    130
  ],
  "71": [
    207,
    138,
    160
  ],
  "72": [
    97,
    182,
    80
  ],
  "73": [
    166,
    237,
    160
  ],
  "74": [
    132,
    163,
    80
  ],
  "75": [
    164,
    196,
    110
  ],
  "76": [
    211,
    229,
    160
  ],
  "77": [
    170,
    132,
    100
  ],
  "78": [
    207,
    167,
    130
  ],
  "79": [
    109,
    109,
    180
  ],
  "80": [
    177,
    194,
    190
  ],
  "81": [
    165,
    128,
    50
  ],
  "82": [
    223,
    182,
    100
  ],
  "83": [
    124,
    118,
    104
  ],
  "84": [
    158,
    88,
    70
  ],
  "85": [
    218,
    145,
    120
  ],
  "86": [
    85,
    128,
    130
  ],
  "87": [
    139,
    184,
    180
  ],
  "88": [
    135,
    90,
    160
  ],
  "89": [
    190,
    184,
    210
  ],
  "90": [
    116,
    168,
    60
  ],
  "91": [
    186,
    323,
    100
  ],
  "92": [
    186,
    70,
    60
  ],
  "93": [
    223,
    112,
    90
  ],
  "94": [
    261,
    156,
    120
  ],
  "95": [
    85,
    288,
    70
  ],
  "96": [
    89,
    158,
    120
  ],
  "97": [
    144,
    215,
    170
  ],
  "98": [
    181,
    156,
    60
  ],
  "99": [
    240,
    214,
    110
  ],
  "100": [
    109,
    114,
    80
  ],
  "101": [
    173,
    179,
    120
  ],
  "102": [
    107,
    140,
    120
  ],
  "103": [
    233,
    158,
    190
  ],
  "104": [
    90,
    165,
    100
  ],
  "105": [
    144,
    200,
    120
  ],
  "106": [
    224,
    211,
    100
  ],
  "107": [
    193,
    212,
    100
  ],
  "108": [
    108,
    137,
    180
  ],
  "109": [
    119,
    164,
    80
  ],
  "110": [
    174,
    221,
    130
  ],
  "111": [
    140,
    157,
    160
  ],
  "112": [
    222,
    206,
    210
  ],
  "113": [
    60,
    176,
    500
  ],
  "114": [
    183,
    205,
    130
  ],
  "115": [
    181,
    165,
    210
  ],
  "116": [
    129,
    125,
    60
  ],
  "117": [
    187,
    182,
    110
  ],
  "118": [
    123,
    115,
    90
  ],
  "119": [
    175,
    154,
    160
  ],
  "120": [
    137,
    112,
    60
  ],
  "121": [
    210,
    184,
    120
  ],
  "122": [
    192,
    233,
    80
  ],
  "123": [
    218,
    170,
    140
  ],
  "124": [
    223,
    182,
    130
  ],
  "125": [
    198,
    173,
    130
  ],
  "126": [
    206,
    169,
    130
  ],
  "127": [
    238,
    197,
    130
  ],
  "128": [
    198,
    197,
    150
  ],
  "129": [
    29,
    102,
    40
  ],
  "130": [
    237,
    197,
    190
  ],
  "131": [
    165,
    180,
    260
  ],
  "132": [
    91,
    91,
    96
  ],
  "133": [
    104,
    121,
    110
  ],
  "134": [
    205,
    177,
    260
  ],
  "135": [
    232,
    201,
    130
  ],
  "136": [
    246,
    204,
    130
  ],
  "137": [
    153,
    139,
    130
  ],
  "138": [
    155,
    174,
    70
  ],
  "139": [
    207,
    227,
    140
  ],
  "140": [
    148,
    162,
    60
  ],
  "141": [
    220,
    203,
    120
  ],
  "142": [
    221,
    164,
    160
  ],
  "143": [
    190,
    190,
    320
  ],
  "144": [
    192,
    249,
    180
  ],
  "145": [
    253,
    188,
    180
  ],
  "146": [
    251,
    184,
    180
  ],
  "147": [
    119,
    94,
    82
  ],
  "148": [
    163,
    138,
    122
  ],
  "149": [
    263,
    201,
    182
  ],
  "150": [
    330,
    200,
    212
  ],
  "151": [
    210,
    210,
    200
  ],
  "152": [
    92,
    122,
    90
  ],
  "153": [
    122,
    155,
    120
  ],
  "154": [
    168,
    202,
    160
  ],
  "155": [
    116,
    96,
    78
  ],
  "156": [
    158,
    129,
    116
  ],
  "157": [
    223,
    176,
    156
  ],
  "158": [
    117,
    116,
    100
  ],
  "159": [
    150,
    151,
    130
  ],
  "160": [
    205,
    197,
    170
  ],
  "161": [
    79,
    77,
    70
  ],
  "162": [
    148,
    130,
    170
  ],
  "163": [
    67,
    101,
    120
  ],
  "164": [
    145,
    179,
    200
  ],
  "165": [
    72,
    142,
    80
  ],
  "166": [
    107,
    209,
    110
  ],
  "167": [
    105,
    73,
    80
  ],
  "168": [
    161,
    128,
    140
  ],
  "169": [
    194,
    178,
    170
  ],
  "170": [
    106,
    106,
    150
  ],
  "171": [
    146,
    146,
    250
  ],
  "172": [
    77,
    63,
    40
  ],
  "173": [
    75,
    91,
    100
  ],
  "174": [
    69,
    34,
    180
  ],
  "175": [
    67,
    116,
    70
  ],
  "176": [
    139,
    191,
    110
  ],
  "177": [
    134,
    89,
    80
  ],
  "178": [
    192,
    146,
    130
  ],
  "179": [
    114,
    82,
    110
  ],
  "180": [
    145,
    112,
    140
  ],
  "181": [
    211,
    172,
    180
  ],
  "182": [
    169,
    189,
    150
  ],
  "183": [
    37,
    93,
    140
  ],
  "184": [
    112,
    152,
    200
  ],
  "185": [
    167,
    198,
    140
  ],
  "186": [
    174,
    192,
    180
  ],
  "187": [
    67,
    101,
    70
  ],
  "188": [
    91,
    127,
    110
  ],
  "189": [
    118,
    197,
    150
  ],
  "190": [
    136,
    112,
    110
  ],
  "191": [
    55,
    55,
    60
  ],
  "192": [
    185,
    148,
    150
  ],
  "193": [
    154,
    94,
    130
  ],
  "194": [
    75,
    75,
    110
  ],
  "195": [
    152,
    152,
    190
  ],
  "196": [
    261,
    194,
    130
  ],
  "197": [
    126,
    250,
    190
  ],
  "198": [
    175,
    87,
    120
  ],
  "199": [
    177,
    194,
    190
  ],
  "200": [
    167,
    167,
    120
  ],
  "201": [
    136,
    91,
    96
  ],
  "202": [
    60,
    106,
    380
  ],
  "203": [
    182,
    133,
    140
  ],
  "204": [
    108,
    146,
    100
  ],
  "205": [
    161,
    242,
    150
  ],
  "206": [
    131,
    131,
    200
  ],
  "207": [
    143,
    204,
    130
  ],
  "208": [
    148,
    333,
    150
  ],
  "209": [
    137,
    89,
    120
  ],
  "210": [
    212,
    137,
    180
  ],
  "211": [
    184,
    148,
    130
  ],
  "212": [
    236,
    191,
    140
  ],
  "213": [
    17,
    396,
    40
  ],
  "214": [
    234,
    189,
    160
  ],
  "215": [
    189,
    157,
    110
  ],
  "216": [
    142,
    93,
    120
  ],
  "217": [
    236,
    144,
    180
  ],
  "218": [
    118,
    71,
    80
  ],
  "219": [
    139,
    209,
    100
  ],
  "220": [
    90,
    74,
    100
  ],
  "221": [
    181,
    147,
    200
  ],
  "222": [
    118,
    156,
    110
  ],
  "223": [
    127,
    69,
    70
  ],
  "224": [
    197,
    141,
    150
  ],
  "225": [
    128,
    90,
    90
  ],
  "226": [
    148,
    260,
    130
  ],
  "227": [
    148,
    260,
    130
  ],
  "228": [
    152,
    93,
    90
  ],
  "229": [
    224,
    159,
    150
  ],
  "230": [
    194,
    194,
    150
  ],
  "231": [
    107,
    107,
    180
  ],
  "232": [
    214,
    214,
    180
  ],
  "233": [
    198,
    183,
    170
  ],
  "234": [
    192,
    132,
    146
  ],
  "235": [
    40,
    88,
    110
  ],
  "236": [
    64,
    64,
    70
  ],
  "237": [
    173,
    214,
    100
  ],
  "238": [
    153,
    116,
    90
  ],
  "239": [
    135,
    110,
    90
  ],
  "240": [
    151,
    108,
    90
  ],
  "241": [
    157,
    211,
    190
  ],
  "242": [
    129,
    229,
    510
  ],
  "243": [
    241,
    210,
    180
  ],
  "244": [
    235,
    176,
    230
  ],
  "245": [
    180,
    235,
    200
  ],
  "246": [
    115,
    93,
    100
  ],
  "247": [
    155,
    133,
    140
  ],
  "248": [
    251,
    212,
    200
  ],
  "249": [
    193,
    323,
    212
  ],
  "250": [
    263,
    301,
    212
  ],
  "251": [
    210,
    210,
    200
  ]
}

const pokeDict = {
  "1": "Bulbasaur",
  "2": "Ivysaur",
  "3": "Venusaur",
  "4": "Charmander",
  "5": "Charmeleon",
  "6": "Charizard",
  "7": "Squirtle",
  "8": "Wartortle",
  "9": "Blastoise",
  "10": "Caterpie",
  "11": "Metapod",
  "12": "Butterfree",
  "13": "Weedle",
  "14": "Kakuna",
  "15": "Beedrill",
  "16": "Pidgey",
  "17": "Pidgeotto",
  "18": "Pidgeot",
  "19": "Rattata",
  "20": "Raticate",
  "21": "Spearow",
  "22": "Fearow",
  "23": "Ekans",
  "24": "Arbok",
  "25": "Pikachu",
  "26": "Raichu",
  "27": "Sandshrew",
  "28": "Sandslash",
  "29": "Nidoran♀",
  "30": "Nidorina",
  "31": "Nidoqueen",
  "32": "Nidoran♂",
  "33": "Nidorino",
  "34": "Nidoking",
  "35": "Clefairy",
  "36": "Clefable",
  "37": "Vulpix",
  "38": "Ninetales",
  "39": "Jigglypuff",
  "40": "Wigglytuff",
  "41": "Zubat",
  "42": "Golbat",
  "43": "Oddish",
  "44": "Gloom",
  "45": "Vileplume",
  "46": "Paras",
  "47": "Parasect",
  "48": "Venonat",
  "49": "Venomoth",
  "50": "Diglett",
  "51": "Dugtrio",
  "52": "Meowth",
  "53": "Persian",
  "54": "Psyduck",
  "55": "Golduck",
  "56": "Mankey",
  "57": "Primeape",
  "58": "Growlithe",
  "59": "Arcanine",
  "60": "Poliwag",
  "61": "Poliwhirl",
  "62": "Poliwrath",
  "63": "Abra",
  "64": "Kadabra",
  "65": "Alakazam",
  "66": "Machop",
  "67": "Machoke",
  "68": "Machamp",
  "69": "Bellsprout",
  "70": "Weepinbell",
  "71": "Victreebel",
  "72": "Tentacool",
  "73": "Tentacruel",
  "74": "Geodude",
  "75": "Graveler",
  "76": "Golem",
  "77": "Ponyta",
  "78": "Rapidash",
  "79": "Slowpoke",
  "80": "Slowbro",
  "81": "Magnemite",
  "82": "Magneton",
  "83": "Farfetch'd",
  "84": "Doduo",
  "85": "Dodrio",
  "86": "Seel",
  "87": "Dewgong",
  "88": "Grimer",
  "89": "Muk",
  "90": "Shellder",
  "91": "Cloyster",
  "92": "Gastly",
  "93": "Haunter",
  "94": "Gengar",
  "95": "Onix",
  "96": "Drowzee",
  "97": "Hypno",
  "98": "Krabby",
  "99": "Kingler",
  "100": "Voltorb",
  "101": "Electrode",
  "102": "Exeggcute",
  "103": "Exeggutor",
  "104": "Cubone",
  "105": "Marowak",
  "106": "Hitmonlee",
  "107": "Hitmonchan",
  "108": "Lickitung",
  "109": "Koffing",
  "110": "Weezing",
  "111": "Rhyhorn",
  "112": "Rhydon",
  "113": "Chansey",
  "114": "Tangela",
  "115": "Kangaskhan",
  "116": "Horsea",
  "117": "Seadra",
  "118": "Goldeen",
  "119": "Seaking",
  "120": "Staryu",
  "121": "Starmie",
  "122": "Mr. Mime",
  "123": "Scyther",
  "124": "Jynx",
  "125": "Electabuzz",
  "126": "Magmar",
  "127": "Pinsir",
  "128": "Tauros",
  "129": "Magikarp",
  "130": "Gyarados",
  "131": "Lapras",
  "132": "Ditto",
  "133": "Eevee",
  "134": "Vaporeon",
  "135": "Jolteon",
  "136": "Flareon",
  "137": "Porygon",
  "138": "Omanyte",
  "139": "Omastar",
  "140": "Kabuto",
  "141": "Kabutops",
  "142": "Aerodactyl",
  "143": "Snorlax",
  "144": "Articuno",
  "145": "Zapdos",
  "146": "Moltres",
  "147": "Dratini",
  "148": "Dragonair",
  "149": "Dragonite",
  "150": "Mewtwo",
  "151": "Mew",
  "152": "Chikorita",
  "153": "Bayleef",
  "154": "Meganium",
  "155": "Cyndaquil",
  "156": "Quilava",
  "157": "Typhlosion",
  "158": "Totodile",
  "159": "Croconaw",
  "160": "Feraligatr",
  "161": "Sentret",
  "162": "Furret",
  "163": "Hoothoot",
  "164": "Noctowl",
  "165": "Ledyba",
  "166": "Ledian",
  "167": "Spinarak",
  "168": "Ariados",
  "169": "Crobat",
  "170": "Chinchou",
  "171": "Lanturn",
  "172": "Pichu",
  "173": "Cleffa",
  "174": "Igglybuff",
  "175": "Togepi",
  "176": "Togetic",
  "177": "Natu",
  "178": "Xatu",
  "179": "Mareep",
  "180": "Flaaffy",
  "181": "Ampharos",
  "182": "Bellossom",
  "183": "Marill",
  "184": "Azumarill",
  "185": "Sudowoodo",
  "186": "Politoed",
  "187": "Hoppip",
  "188": "Skiploom",
  "189": "Jumpluff",
  "190": "Aipom",
  "191": "Sunkern",
  "192": "Sunflora",
  "193": "Yanma",
  "194": "Wooper",
  "195": "Quagsire",
  "196": "Espeon",
  "197": "Umbreon",
  "198": "Murkrow",
  "199": "Slowking",
  "200": "Misdreavus",
  "201": "Unown",
  "202": "Wobbuffet",
  "203": "Girafarig",
  "204": "Pineco",
  "205": "Forretress",
  "206": "Dunsparce",
  "207": "Gligar",
  "208": "Steelix",
  "209": "Snubbull",
  "210": "Granbull",
  "211": "Qwilfish",
  "212": "Scizor",
  "213": "Shuckle",
  "214": "Heracross",
  "215": "Sneasel",
  "216": "Teddiursa",
  "217": "Ursaring",
  "218": "Slugma",
  "219": "Magcargo",
  "220": "Swinub",
  "221": "Piloswine",
  "222": "Corsola",
  "223": "Remoraid",
  "224": "Octillery",
  "225": "Delibird",
  "226": "Mantine",
  "227": "Skarmory",
  "228": "Houndour",
  "229": "Houndoom",
  "230": "Kingdra",
  "231": "Phanpy",
  "232": "Donphan",
  "233": "Porygon2",
  "234": "Stantler",
  "235": "Smeargle",
  "236": "Tyrogue",
  "237": "Hitmontop",
  "238": "Smoochum",
  "239": "Elekid",
  "240": "Magby",
  "241": "Miltank",
  "242": "Blissey",
  "243": "Raikou",
  "244": "Entei",
  "245": "Suicune",
  "246": "Larvitar",
  "247": "Pupitar",
  "248": "Tyranitar",
  "249": "Lugia",
  "250": "Ho-Oh",
  "251": "Celebi"
}

const pokeReverseDict = {
  "bulbasaur": "1",
  "ivysaur": "2",
  "venusaur": "3",
  "charmander": "4",
  "charmeleon": "5",
  "charizard": "6",
  "squirtle": "7",
  "wartortle": "8",
  "blastoise": "9",
  "caterpie": "10",
  "metapod": "11",
  "butterfree": "12",
  "weedle": "13",
  "kakuna": "14",
  "beedrill": "15",
  "pidgey": "16",
  "pidgeotto": "17",
  "pidgeot": "18",
  "rattata": "19",
  "raticate": "20",
  "spearow": "21",
  "fearow": "22",
  "ekans": "23",
  "arbok": "24",
  "pikachu": "25",
  "raichu": "26",
  "sandshrew": "27",
  "sandslash": "28",
  "nidoran♀": "29",
  "nidorina": "30",
  "nidoqueen": "31",
  "nidoran♂": "32",
  "nidorino": "33",
  "nidoking": "34",
  "clefairy": "35",
  "clefable": "36",
  "vulpix": "37",
  "ninetales": "38",
  "jigglypuff": "39",
  "wigglytuff": "40",
  "zubat": "41",
  "golbat": "42",
  "oddish": "43",
  "gloom": "44",
  "vileplume": "45",
  "paras": "46",
  "parasect": "47",
  "venonat": "48",
  "venomoth": "49",
  "diglett": "50",
  "dugtrio": "51",
  "meowth": "52",
  "persian": "53",
  "psyduck": "54",
  "golduck": "55",
  "mankey": "56",
  "primeape": "57",
  "growlithe": "58",
  "arcanine": "59",
  "poliwag": "60",
  "poliwhirl": "61",
  "poliwrath": "62",
  "abra": "63",
  "kadabra": "64",
  "alakazam": "65",
  "machop": "66",
  "machoke": "67",
  "machamp": "68",
  "bellsprout": "69",
  "weepinbell": "70",
  "victreebel": "71",
  "tentacool": "72",
  "tentacruel": "73",
  "geodude": "74",
  "graveler": "75",
  "golem": "76",
  "ponyta": "77",
  "rapidash": "78",
  "slowpoke": "79",
  "slowbro": "80",
  "magnemite": "81",
  "magneton": "82",
  "farfetch'd": "83",
  "doduo": "84",
  "dodrio": "85",
  "seel": "86",
  "dewgong": "87",
  "grimer": "88",
  "muk": "89",
  "shellder": "90",
  "cloyster": "91",
  "gastly": "92",
  "haunter": "93",
  "gengar": "94",
  "onix": "95",
  "drowzee": "96",
  "hypno": "97",
  "krabby": "98",
  "kingler": "99",
  "voltorb": "100",
  "electrode": "101",
  "exeggcute": "102",
  "exeggutor": "103",
  "cubone": "104",
  "marowak": "105",
  "hitmonlee": "106",
  "hitmonchan": "107",
  "lickitung": "108",
  "koffing": "109",
  "weezing": "110",
  "rhyhorn": "111",
  "rhydon": "112",
  "chansey": "113",
  "tangela": "114",
  "kangaskhan": "115",
  "horsea": "116",
  "seadra": "117",
  "goldeen": "118",
  "seaking": "119",
  "staryu": "120",
  "starmie": "121",
  "mr. mime": "122",
  "scyther": "123",
  "jynx": "124",
  "electabuzz": "125",
  "magmar": "126",
  "pinsir": "127",
  "tauros": "128",
  "magikarp": "129",
  "gyarados": "130",
  "lapras": "131",
  "ditto": "132",
  "eevee": "133",
  "vaporeon": "134",
  "jolteon": "135",
  "flareon": "136",
  "porygon": "137",
  "omanyte": "138",
  "omastar": "139",
  "kabuto": "140",
  "kabutops": "141",
  "aerodactyl": "142",
  "snorlax": "143",
  "articuno": "144",
  "zapdos": "145",
  "moltres": "146",
  "dratini": "147",
  "dragonair": "148",
  "dragonite": "149",
  "mewtwo": "150",
  "mew": "151",
  "chikorita": "152",
  "bayleef": "153",
  "meganium": "154",
  "cyndaquil": "155",
  "quilava": "156",
  "typhlosion": "157",
  "totodile": "158",
  "croconaw": "159",
  "feraligatr": "160",
  "sentret": "161",
  "furret": "162",
  "hoothoot": "163",
  "noctowl": "164",
  "ledyba": "165",
  "ledian": "166",
  "spinarak": "167",
  "ariados": "168",
  "crobat": "169",
  "chinchou": "170",
  "lanturn": "171",
  "pichu": "172",
  "cleffa": "173",
  "igglybuff": "174",
  "togepi": "175",
  "togetic": "176",
  "natu": "177",
  "xatu": "178",
  "mareep": "179",
  "flaaffy": "180",
  "ampharos": "181",
  "bellossom": "182",
  "marill": "183",
  "azumarill": "184",
  "sudowoodo": "185",
  "politoed": "186",
  "hoppip": "187",
  "skiploom": "188",
  "jumpluff": "189",
  "aipom": "190",
  "sunkern": "191",
  "sunflora": "192",
  "yanma": "193",
  "wooper": "194",
  "quagsire": "195",
  "espeon": "196",
  "umbreon": "197",
  "murkrow": "198",
  "slowking": "199",
  "misdreavus": "200",
  "unown": "201",
  "wobbuffet": "202",
  "girafarig": "203",
  "pineco": "204",
  "forretress": "205",
  "dunsparce": "206",
  "gligar": "207",
  "steelix": "208",
  "snubbull": "209",
  "granbull": "210",
  "qwilfish": "211",
  "scizor": "212",
  "shuckle": "213",
  "heracross": "214",
  "sneasel": "215",
  "teddiursa": "216",
  "ursaring": "217",
  "slugma": "218",
  "magcargo": "219",
  "swinub": "220",
  "piloswine": "221",
  "corsola": "222",
  "remoraid": "223",
  "octillery": "224",
  "delibird": "225",
  "mantine": "226",
  "skarmory": "227",
  "houndour": "228",
  "houndoom": "229",
  "kingdra": "230",
  "phanpy": "231",
  "donphan": "232",
  "porygon2": "233",
  "stantler": "234",
  "smeargle": "235",
  "tyrogue": "236",
  "hitmontop": "237",
  "smoochum": "238",
  "elekid": "239",
  "magby": "240",
  "miltank": "241",
  "blissey": "242",
  "raikou": "243",
  "entei": "244",
  "suicune": "245",
  "larvitar": "246",
  "pupitar": "247",
  "tyranitar": "248",
  "lugia": "249",
  "ho-oh": "250",
  "celebi": "251"
}

module.exports = {
  pokeDict: pokeDict,
  pokeReverseDict: pokeReverseDict,
  movesDict: movesDict,
  baseStatsDict: baseStatsDict,
}
