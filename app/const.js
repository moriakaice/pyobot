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

const pokeDict = {
  "1": {
    "name": "Bulbasaur",
    "show_filter": true
  },
  "2": {
    "name": "Ivysaur",
    "show_filter": true
  },
  "3": {
    "name": "Venusaur",
    "show_filter": true
  },
  "4": {
    "name": "Charmander",
    "show_filter": true
  },
  "5": {
    "name": "Charmeleon",
    "show_filter": true
  },
  "6": {
    "name": "Charizard",
    "show_filter": true
  },
  "7": {
    "name": "Squirtle",
    "show_filter": true
  },
  "8": {
    "name": "Wartortle",
    "show_filter": true
  },
  "9": {
    "name": "Blastoise",
    "show_filter": true
  },
  "10": {
    "name": "Caterpie",
    "show_filter": true
  },
  "11": {
    "name": "Metapod",
    "show_filter": true
  },
  "12": {
    "name": "Butterfree",
    "show_filter": true
  },
  "13": {
    "name": "Weedle",
    "show_filter": false
  },
  "14": {
    "name": "Kakuna",
    "show_filter": true
  },
  "15": {
    "name": "Beedrill",
    "show_filter": true
  },
  "16": {
    "name": "Pidgey",
    "show_filter": false
  },
  "17": {
    "name": "Pidgeotto",
    "show_filter": true
  },
  "18": {
    "name": "Pidgeot",
    "show_filter": true
  },
  "19": {
    "name": "Rattata",
    "show_filter": false
  },
  "20": {
    "name": "Raticate",
    "show_filter": true
  },
  "21": {
    "name": "Spearow",
    "show_filter": false
  },
  "22": {
    "name": "Fearow",
    "show_filter": true
  },
  "23": {
    "name": "Ekans",
    "show_filter": true
  },
  "24": {
    "name": "Arbok",
    "show_filter": true
  },
  "25": {
    "name": "Pikachu",
    "show_filter": true
  },
  "26": {
    "name": "Raichu",
    "show_filter": true
  },
  "27": {
    "name": "Sandshrew",
    "show_filter": true
  },
  "28": {
    "name": "Sandslash",
    "show_filter": true
  },
  "29": {
    "name": "Nidoran♀",
    "show_filter": true
  },
  "30": {
    "name": "Nidorina",
    "show_filter": true
  },
  "31": {
    "name": "Nidoqueen",
    "show_filter": true
  },
  "32": {
    "name": "Nidoran♂",
    "show_filter": true
  },
  "33": {
    "name": "Nidorino",
    "show_filter": true
  },
  "34": {
    "name": "Nidoking",
    "show_filter": true
  },
  "35": {
    "name": "Clefairy",
    "show_filter": true
  },
  "36": {
    "name": "Clefable",
    "show_filter": true
  },
  "37": {
    "name": "Vulpix",
    "show_filter": true
  },
  "38": {
    "name": "Ninetales",
    "show_filter": true
  },
  "39": {
    "name": "Jigglypuff",
    "show_filter": true
  },
  "40": {
    "name": "Wigglytuff",
    "show_filter": true
  },
  "41": {
    "name": "Zubat",
    "show_filter": true
  },
  "42": {
    "name": "Golbat",
    "show_filter": true
  },
  "43": {
    "name": "Oddish",
    "show_filter": true
  },
  "44": {
    "name": "Gloom",
    "show_filter": true
  },
  "45": {
    "name": "Vileplume",
    "show_filter": true
  },
  "46": {
    "name": "Paras",
    "show_filter": false
  },
  "47": {
    "name": "Parasect",
    "show_filter": true
  },
  "48": {
    "name": "Venonat",
    "show_filter": false
  },
  "49": {
    "name": "Venomoth",
    "show_filter": true
  },
  "50": {
    "name": "Diglett",
    "show_filter": true
  },
  "51": {
    "name": "Dugtrio",
    "show_filter": true
  },
  "52": {
    "name": "Meowth",
    "show_filter": true
  },
  "53": {
    "name": "Persian",
    "show_filter": true
  },
  "54": {
    "name": "Psyduck",
    "show_filter": false
  },
  "55": {
    "name": "Golduck",
    "show_filter": true
  },
  "56": {
    "name": "Mankey",
    "show_filter": true
  },
  "57": {
    "name": "Primeape",
    "show_filter": true
  },
  "58": {
    "name": "Growlithe",
    "show_filter": true
  },
  "59": {
    "name": "Arcanine",
    "show_filter": true
  },
  "60": {
    "name": "Poliwag",
    "show_filter": true
  },
  "61": {
    "name": "Poliwhirl",
    "show_filter": true
  },
  "62": {
    "name": "Poliwrath",
    "show_filter": true
  },
  "63": {
    "name": "Abra",
    "show_filter": true
  },
  "64": {
    "name": "Kadabra",
    "show_filter": true
  },
  "65": {
    "name": "Alakazam",
    "show_filter": true
  },
  "66": {
    "name": "Machop",
    "show_filter": true
  },
  "67": {
    "name": "Machoke",
    "show_filter": true
  },
  "68": {
    "name": "Machamp",
    "show_filter": true
  },
  "69": {
    "name": "Bellsprout",
    "show_filter": true
  },
  "70": {
    "name": "Weepinbell",
    "show_filter": true
  },
  "71": {
    "name": "Victreebel",
    "show_filter": true
  },
  "72": {
    "name": "Tentacool",
    "show_filter": true
  },
  "73": {
    "name": "Tentacruel",
    "show_filter": true
  },
  "74": {
    "name": "Geodude",
    "show_filter": true
  },
  "75": {
    "name": "Graveler",
    "show_filter": true
  },
  "76": {
    "name": "Golem",
    "show_filter": true
  },
  "77": {
    "name": "Ponyta",
    "show_filter": true
  },
  "78": {
    "name": "Rapidash",
    "show_filter": true
  },
  "79": {
    "name": "Slowpoke",
    "show_filter": true
  },
  "80": {
    "name": "Slowbro",
    "show_filter": true
  },
  "81": {
    "name": "Magnemite",
    "show_filter": true
  },
  "82": {
    "name": "Magneton",
    "show_filter": true
  },
  "83": {
    "name": "Farfetch'd",
    "show_filter": true
  },
  "84": {
    "name": "Doduo",
    "show_filter": true
  },
  "85": {
    "name": "Dodrio",
    "show_filter": true
  },
  "86": {
    "name": "Seel",
    "show_filter": true
  },
  "87": {
    "name": "Dewgong",
    "show_filter": true
  },
  "88": {
    "name": "Grimer",
    "show_filter": true
  },
  "89": {
    "name": "Muk",
    "show_filter": true
  },
  "90": {
    "name": "Shellder",
    "show_filter": false
  },
  "91": {
    "name": "Cloyster",
    "show_filter": true
  },
  "92": {
    "name": "Gastly",
    "show_filter": true
  },
  "93": {
    "name": "Haunter",
    "show_filter": true
  },
  "94": {
    "name": "Gengar",
    "show_filter": true
  },
  "95": {
    "name": "Onix",
    "show_filter": true
  },
  "96": {
    "name": "Drowzee",
    "show_filter": true
  },
  "97": {
    "name": "Hypno",
    "show_filter": true
  },
  "98": {
    "name": "Krabby",
    "show_filter": false
  },
  "99": {
    "name": "Kingler",
    "show_filter": true
  },
  "100": {
    "name": "Voltorb",
    "show_filter": true
  },
  "101": {
    "name": "Electrode",
    "show_filter": true
  },
  "102": {
    "name": "Exeggcute",
    "show_filter": true
  },
  "103": {
    "name": "Exeggutor",
    "show_filter": true
  },
  "104": {
    "name": "Cubone",
    "show_filter": true
  },
  "105": {
    "name": "Marowak",
    "show_filter": true
  },
  "106": {
    "name": "Hitmonlee",
    "show_filter": true
  },
  "107": {
    "name": "Hitmonchan",
    "show_filter": true
  },
  "108": {
    "name": "Lickitung",
    "show_filter": true
  },
  "109": {
    "name": "Koffing",
    "show_filter": true
  },
  "110": {
    "name": "Weezing",
    "show_filter": true
  },
  "111": {
    "name": "Rhyhorn",
    "show_filter": true
  },
  "112": {
    "name": "Rhydon",
    "show_filter": true
  },
  "113": {
    "name": "Chansey",
    "show_filter": true
  },
  "114": {
    "name": "Tangela",
    "show_filter": true
  },
  "115": {
    "name": "Kangaskhan",
    "show_filter": true
  },
  "116": {
    "name": "Horsea",
    "show_filter": true
  },
  "117": {
    "name": "Seadra",
    "show_filter": true
  },
  "118": {
    "name": "Goldeen",
    "show_filter": false
  },
  "119": {
    "name": "Seaking",
    "show_filter": true
  },
  "120": {
    "name": "Staryu",
    "show_filter": false
  },
  "121": {
    "name": "Starmie",
    "show_filter": true
  },
  "122": {
    "name": "Mr. Mime",
    "show_filter": true
  },
  "123": {
    "name": "Scyther",
    "show_filter": true
  },
  "124": {
    "name": "Jynx",
    "show_filter": true
  },
  "125": {
    "name": "Electabuzz",
    "show_filter": true
  },
  "126": {
    "name": "Magmar",
    "show_filter": true
  },
  "127": {
    "name": "Pinsir",
    "show_filter": true
  },
  "128": {
    "name": "Tauros",
    "show_filter": true
  },
  "129": {
    "name": "Magikarp",
    "show_filter": true
  },
  "130": {
    "name": "Gyarados",
    "show_filter": true
  },
  "131": {
    "name": "Lapras",
    "show_filter": true
  },
  "132": {
    "name": "Ditto",
    "show_filter": true
  },
  "133": {
    "name": "Eevee",
    "show_filter": true
  },
  "134": {
    "name": "Vaporeon",
    "show_filter": true
  },
  "135": {
    "name": "Jolteon",
    "show_filter": true
  },
  "136": {
    "name": "Flareon",
    "show_filter": true
  },
  "137": {
    "name": "Porygon",
    "show_filter": true
  },
  "138": {
    "name": "Omanyte",
    "show_filter": true
  },
  "139": {
    "name": "Omastar",
    "show_filter": true
  },
  "140": {
    "name": "Kabuto",
    "show_filter": true
  },
  "141": {
    "name": "Kabutops",
    "show_filter": true
  },
  "142": {
    "name": "Aerodactyl",
    "show_filter": true
  },
  "143": {
    "name": "Snorlax",
    "show_filter": true
  },
  "144": {
    "name": "Articuno",
    "show_filter": true
  },
  "145": {
    "name": "Zapdos",
    "show_filter": true
  },
  "146": {
    "name": "Moltres",
    "show_filter": true
  },
  "147": {
    "name": "Dratini",
    "show_filter": true
  },
  "148": {
    "name": "Dragonair",
    "show_filter": true
  },
  "149": {
    "name": "Dragonite",
    "show_filter": true
  },
  "150": {
    "name": "Mewtwo",
    "show_filter": true
  },
  "151": {
    "name": "Mew",
    "show_filter": true
  },
  "152": {
    "name": "Chikorita",
    "show_filter": true
  },
  "153": {
    "name": "Bayleef",
    "show_filter": true
  },
  "154": {
    "name": "Meganium",
    "show_filter": true
  },
  "155": {
    "name": "Cyndaquil",
    "show_filter": true
  },
  "156": {
    "name": "Quilava",
    "show_filter": true
  },
  "157": {
    "name": "Typhlosion",
    "show_filter": true
  },
  "158": {
    "name": "Totodile",
    "show_filter": true
  },
  "159": {
    "name": "Croconaw",
    "show_filter": true
  },
  "160": {
    "name": "Feraligatr",
    "show_filter": true
  },
  "161": {
    "name": "Sentret",
    "show_filter": false
  },
  "162": {
    "name": "Furret",
    "show_filter": true
  },
  "163": {
    "name": "Hoothoot",
    "show_filter": false
  },
  "164": {
    "name": "Noctowl",
    "show_filter": true
  },
  "165": {
    "name": "Ledyba",
    "show_filter": false
  },
  "166": {
    "name": "Ledian",
    "show_filter": true
  },
  "167": {
    "name": "Spinarak",
    "show_filter": false
  },
  "168": {
    "name": "Ariados",
    "show_filter": true
  },
  "169": {
    "name": "Crobat",
    "show_filter": true
  },
  "170": {
    "name": "Chinchou",
    "show_filter": true
  },
  "171": {
    "name": "Lanturn",
    "show_filter": true
  },
  "172": {
    "name": "Pichu",
    "show_filter": true
  },
  "173": {
    "name": "Cleffa",
    "show_filter": true
  },
  "174": {
    "name": "Igglybuff",
    "show_filter": true
  },
  "175": {
    "name": "Togepi",
    "show_filter": true
  },
  "176": {
    "name": "Togetic",
    "show_filter": true
  },
  "177": {
    "name": "Natu",
    "show_filter": false
  },
  "178": {
    "name": "Xatu",
    "show_filter": true
  },
  "179": {
    "name": "Mareep",
    "show_filter": true
  },
  "180": {
    "name": "Flaaffy",
    "show_filter": true
  },
  "181": {
    "name": "Ampharos",
    "show_filter": true
  },
  "182": {
    "name": "Bellossom",
    "show_filter": true
  },
  "183": {
    "name": "Marill",
    "show_filter": false
  },
  "184": {
    "name": "Azumarill",
    "show_filter": true
  },
  "185": {
    "name": "Sudowoodo",
    "show_filter": true
  },
  "186": {
    "name": "Politoed",
    "show_filter": true
  },
  "187": {
    "name": "Hoppip",
    "show_filter": true
  },
  "188": {
    "name": "Skiploom",
    "show_filter": true
  },
  "189": {
    "name": "Jumpluff",
    "show_filter": true
  },
  "190": {
    "name": "Aipom",
    "show_filter": false
  },
  "191": {
    "name": "Sunkern",
    "show_filter": true
  },
  "192": {
    "name": "Sunflora",
    "show_filter": true
  },
  "193": {
    "name": "Yanma",
    "show_filter": true
  },
  "194": {
    "name": "Wooper",
    "show_filter": false
  },
  "195": {
    "name": "Quagsire",
    "show_filter": true
  },
  "196": {
    "name": "Espeon",
    "show_filter": true
  },
  "197": {
    "name": "Umbreon",
    "show_filter": true
  },
  "198": {
    "name": "Murkrow",
    "show_filter": false
  },
  "199": {
    "name": "Slowking",
    "show_filter": true
  },
  "200": {
    "name": "Misdreavus",
    "show_filter": true
  },
  "201": {
    "name": "Unown",
    "show_filter": true
  },
  "202": {
    "name": "Wobbuffet",
    "show_filter": true
  },
  "203": {
    "name": "Girafarig",
    "show_filter": true
  },
  "204": {
    "name": "Pineco",
    "show_filter": true
  },
  "205": {
    "name": "Forretress",
    "show_filter": true
  },
  "206": {
    "name": "Dunsparce",
    "show_filter": true
  },
  "207": {
    "name": "Gligar",
    "show_filter": true
  },
  "208": {
    "name": "Steelix",
    "show_filter": true
  },
  "209": {
    "name": "Snubbull",
    "show_filter": true
  },
  "210": {
    "name": "Granbull",
    "show_filter": true
  },
  "211": {
    "name": "Qwilfish",
    "show_filter": true
  },
  "212": {
    "name": "Scizor",
    "show_filter": true
  },
  "213": {
    "name": "Shuckle",
    "show_filter": true
  },
  "214": {
    "name": "Heracross",
    "show_filter": true
  },
  "215": {
    "name": "Sneasel",
    "show_filter": true
  },
  "216": {
    "name": "Teddiursa",
    "show_filter": true
  },
  "217": {
    "name": "Ursaring",
    "show_filter": true
  },
  "218": {
    "name": "Slugma",
    "show_filter": true
  },
  "219": {
    "name": "Magcargo",
    "show_filter": true
  },
  "220": {
    "name": "Swinub",
    "show_filter": false
  },
  "221": {
    "name": "Piloswine",
    "show_filter": true
  },
  "222": {
    "name": "Corsola",
    "show_filter": true
  },
  "223": {
    "name": "Remoraid",
    "show_filter": true
  },
  "224": {
    "name": "Octillery",
    "show_filter": true
  },
  "225": {
    "name": "Delibird",
    "show_filter": true
  },
  "226": {
    "name": "Mantine",
    "show_filter": true
  },
  "227": {
    "name": "Skarmory",
    "show_filter": true
  },
  "228": {
    "name": "Houndour",
    "show_filter": true
  },
  "229": {
    "name": "Houndoom",
    "show_filter": true
  },
  "230": {
    "name": "Kingdra",
    "show_filter": true
  },
  "231": {
    "name": "Phanpy",
    "show_filter": true
  },
  "232": {
    "name": "Donphan",
    "show_filter": true
  },
  "233": {
    "name": "Porygon2",
    "show_filter": true
  },
  "234": {
    "name": "Stantler",
    "show_filter": true
  },
  "235": {
    "name": "Smeargle",
    "show_filter": true
  },
  "236": {
    "name": "Tyrogue",
    "show_filter": true
  },
  "237": {
    "name": "Hitmontop",
    "show_filter": true
  },
  "238": {
    "name": "Smoochum",
    "show_filter": true
  },
  "239": {
    "name": "Elekid",
    "show_filter": true
  },
  "240": {
    "name": "Magby",
    "show_filter": true
  },
  "241": {
    "name": "Miltank",
    "show_filter": true
  },
  "242": {
    "name": "Blissey",
    "show_filter": true
  },
  "243": {
    "name": "Raikou",
    "show_filter": true
  },
  "244": {
    "name": "Entei",
    "show_filter": true
  },
  "245": {
    "name": "Suicune",
    "show_filter": true
  },
  "246": {
    "name": "Larvitar",
    "show_filter": true
  },
  "247": {
    "name": "Pupitar",
    "show_filter": true
  },
  "248": {
    "name": "Tyranitar",
    "show_filter": true
  },
  "249": {
    "name": "Lugia",
    "show_filter": true
  },
  "250": {
    "name": "Ho-Oh",
    "show_filter": true
  },
  "251": {
    "name": "Celebi",
    "show_filter": true
  }
}

module.exports = {
  pokeDict: pokeDict,
  movesDict: movesDict,
}
