export {};  // Macht die Datei zu einem Modul
import dotenv from "dotenv";
dotenv.config();
import { ChatPrompt } from '../src/model/ChatPromptModel';
import { Genre } from '../src/model/GenreModel';
import mongoose from 'mongoose';

async function setupPrompts() {
  const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GameCompass';

  // MongoDB verbinden
  await mongoose.connect(URI);

  // Lösche alte Prompts
  await ChatPrompt.deleteMany({});

  // 🔥 ERWEITERTE Genres mit mehr Aliases und Übersetzungen
  const genres = [
    { 
      name: 'Action', 
      germanName: 'Action', 
      aliases: [
        'action', 'kampf', 'shooter', 'kämpfen', 'schießen', 'ballern', 
        'fight', 'combat', 'fighting', 'action-packed', 'aktionspiel'
      ]
    },
    { 
      name: 'Adventure', 
      germanName: 'Abenteuer', 
      aliases: [
        'adventure', 'abenteuer', 'erkunden', 'entdecken', 'reisen', 
        'quest', 'journey', 'exploration', 'erkundung', 'abenteurer',
        'abenteuerspiel', 'adventuregame', 'erforschung'
      ]
    },
    { 
      name: 'RPG', 
      germanName: 'Rollenspiel', 
      aliases: [
        'rpg', 'rollenspiel', 'role-playing', 'charakter', 'level', 
        'magie', 'zauber', 'fantasy', 'magic', 'wizard', 'roleplay',
        'charakterentwicklung', 'roleplaying', 'rollenspielen'
      ]
    },
    { 
      name: 'Strategy', 
      germanName: 'Strategie', 
      aliases: [
        'strategy', 'strategie', 'taktik', 'planen', 'aufbauen', 
        'verwalten', 'tactical', 'build', 'strategisch', 'taktisch',
        'strategiespiel', 'taktikspiel', 'aufbaustrategie'
      ]
    },
    { 
      name: 'Sports', 
      germanName: 'Sport', 
      aliases: [
        'sports', 'sport', 'fußball', 'basketball', 'tennis', 'golf', 
        'football', 'soccer', 'sportlich', 'sportspiel', 'sportsim',
        'sportwettkampf', 'sportmanager', 'mannschaft'
      ]
    },
    { 
      name: 'Racing', 
      germanName: 'Rennen', 
      aliases: [
        'racing', 'rennen', 'auto', 'fahren', 'geschwindigkeit', 'cars', 
        'speed', 'driving', 'rennspiel', 'autorennspiel', 'rennfahren',
        'rennwagen', 'motorsport', 'rennstrecke', 'racer'
      ]
    },
    { 
      name: 'Simulation', 
      germanName: 'Simulation', 
      aliases: [
        'simulation', 'sim', 'aufbau', 'leben', 'realität', 'simulator', 
        'life', 'farming', 'simulieren', 'simulationsspiel', 'lebenssim',
        'wirtschaft', 'management', 'beruf', 'karriere'
      ]
    },
    { 
      name: 'Horror', 
      germanName: 'Horror', 
      aliases: [
        'horror', 'grusel', 'scary', 'angst', 'gruselig', 'zombie', 
        'fear', 'creepy', 'horrorspiel', 'survival horror', 'schocker',
        'gruselspiel', 'überleben', 'horror-game'
      ]
    },
    { 
      name: 'Puzzle', 
      germanName: 'Puzzle', 
      aliases: [
        'puzzle', 'rätsel', 'denken', 'logik', 'knobeln', 'puzzel', 
        'räzel', 'brain', 'logic', 'denkspiel', 'geduldspiel',
        'knobelspiel', 'gehirnjogging', 'rätselspaß', 'puzzlespiel',
        'gedächtnis', 'kopfnuss'
      ]
    },
    { 
      name: 'Platformer', 
      germanName: 'Plattformer', 
      aliases: [
        'platformer', 'plattform', 'jump and run', 'hüpfen', 'springen',
        'platform', 'jumping', 'sidescroller', 'plattformspiel',
        'geschicklichkeit', 'jump n run', 'jumpnrun'
      ]
    },
    { 
      name: 'Fighting', 
      germanName: 'Kampfspiel', 
      aliases: [
        'fighting', 'kampfspiel', 'fighter', 'martial arts', 'kampfsport',
        'duell', 'versus', 'prügelspiel', 'beat em up', 'kampf',
        'zweikampf', 'tournament'
      ]
    }
  ];

  await Genre.deleteMany({});
  await Genre.insertMany(genres);

  // 🔥 HAUPTREGELN - Mehr Spiele, längere Antworten, aber einfach
  await ChatPrompt.create({
    type: 'rules',
    question: 'GameCompass Verkaufsberater',
    rules: [
      'Du bist ein professioneller Gaming-Verkaufsberater für GameCompass',
      'Nutze IMMER die Vektor-Suche für ALLE Spielanfragen - egal wie formuliert',
      'Antworte ausführlich mit 3-4 Sätzen',
      'Empfiehl 4-5 Spiele pro Anfrage für beste Auswahl',
      'Format: NUR "Spielname für Preis€" - KEINE Bewertungen oder Genres',
      'NIEMALS Sterne (⭐), Bewertungen (8.2) oder Genres erwähnen',
      'Stelle IMMER konkrete Fragen nach: Genre, Budget, Plattform',
      'Empfiehl NUR Spiele aus unserem Shop-Sortiment',
      'Bei Tippfehlern wie "puzzel" oder "magie spiele" - finde trotzdem Spiele',
      'Nutze Gaming-Fachbegriffe professionell',
      'Sei enthusiastisch aber nicht aufdringlich',
      'Frage nach Multiplayer/Singleplayer Präferenz',
      'Erwähne Preise und Angebote wenn relevant',
      'Bei unklaren Anfragen: Nachfragen statt raten',
      'Verwende passende Emojis für jeden Kontext',
      'Fokussiere auf Verkauf und Kundenzufriedenheit',
      'Kenne die aktuellen Gaming-Trends',
      'Korrigiere Tippfehler NICHT - finde einfach passende Spiele durch Vektor-Suche',
      'Gib mehrere Optionen für bessere Auswahl',
      'Erkläre kurz warum die Spiele passen',
      'Frage nach weiteren Wünschen'
    ],
    examples: [
      { 
        user: 'Hallo', 
        assistant: 'Hey! 🎮 Willkommen bei GameCompass! Ich helfe dir gerne bei der Spielesuche. Welches Genre interessiert dich? Action ⚔️, RPG 🗡️, Abenteuer 🗺️ oder etwas anderes? Und wie hoch ist dein Budget? 💰' 
      },
      { 
        user: 'Ich suche ein Spiel',
        assistant: 'Perfekt! 🎯 Ich zeige dir gerne unsere besten Titel! Magst du eher actionreiche Spiele ⚔️, strategische Herausforderungen 🧠, entspannende Abenteuer 🗺️ oder packende Geschichten 📖? Spielst du lieber allein 👤 oder mit Freunden 👥? So finde ich die perfekten Spiele für dich!'
      },
      { 
        user: 'ich mag abenteuer spiele',
        assistant: 'Großartig! 🗺️ Hier sind top Abenteuer-Spiele für dich! Welche Plattform und Budget hast du? 💰🎮'
      },
      { 
        user: 'puzzel spiele',
        assistant: 'Cool! 🧩 Hier sind fantastische Puzzle-Spiele! Für PC 💻 oder Konsole 🎮? Welches Budget? 💰'
      },
      { 
        user: 'magie spiele',
        assistant: 'Magisch! ✨ Hier sind Fantasy-Spiele mit Magie-Elementen! RPG 🗡️ oder Action-Adventure ⚔️? Budget ca.? 💰'
      },
      { 
        user: 'Etwas Günstiges',
        assistant: 'Bis zu welchem Preis? 20€ 💵, 40€ 💸 oder 60€ 💳? Und welches Genre interessiert dich am meisten? 🤔'
      },
      { 
        user: 'Ich mag Action',
        assistant: 'Cool! 🔥 Shooter wie Call of Duty 🔫 oder eher Kampfspiele 🥊? Und wie viel möchtest du ausgeben? 💰'
      },
      { 
        user: 'Für PS5',
        assistant: 'Super! 🎮 Welches Genre für PS5? Action ⚔️, Sport ⚽ oder RPG 🗡️? Und soll es ein neues Release 🆕 oder ein bewährter Klassiker 👑 sein?'
      },
      {
        user: 'Multiplayer Spiele',
        assistant: 'Awesome! 🚀 Hier sind Online-Hits! Shooter 🔫, Koop-Adventures 🤝 oder Competitive Games 🏆? Mit wie vielen Freunden? 👥'
      },
      {
        user: 'Etwas Entspannendes',
        assistant: 'Verstehe! 😌 Hier sind entspannende Titel! Simulation 🚜, Puzzle 🧩 oder gemütliche Adventures 🌸? Budget ca.? 💰'
      },
      {
        user: 'horror spiele',
        assistant: 'Gruselig! 👻 Hier sind top Horror-Titel! Survival Horror 🔦 oder Jump Scares 😱? Welche Plattform? 🎮'
      },
      {
        user: 'auto rennen',
        assistant: 'Speed! 🏎️ Hier sind coole Rennspiele! Simulation wie Gran Turismo 🏁 oder Arcade wie Mario Kart 🍄? Budget? 💰'
      },
      {
        user: 'strategie aufbau',
        assistant: 'Taktisch! 🧠 Hier sind Strategie-Hits! City Builder 🏗️ oder Kriegsführung ⚔️? PC bevorzugt? 💻'
      },
      {
        user: 'kämpfen und action',
        assistant: 'Kampfbereit! ⚔️ Hier sind Action-Kracher! Fighting Games 🥊 oder Action-RPG 🗡️? Welche Plattform? 🎮'
      },
      {
        user: 'bauen und sammeln',
        assistant: 'Kreativ! 🏗️ Hier sind Aufbau-Spiele! Minecraft-Style 🧱 oder City Builder 🏙️? Budget und Plattform? 💰🎮'
      },
      {
        user: 'Für Kinder',
        assistant: 'Welches Alter? 👶 Und mögt ihr Jump&Run 🦘, Rennspiele 🏎️ oder kreative Spiele wie Minecraft 🧱?'
      },
      {
        user: 'Ich bin Anfänger',
        assistant: 'Perfekt! 🌟 Einfache Spiele wie Mario 🍄 oder lieber was Herausforderndes 💪? Welche Plattform hast du? 🎮'
      },
      {
        user: 'Beste Grafik',
        assistant: 'Top! ✨ Suchst du Showcase-Titel wie Cyberpunk 🌆 oder eher Gameplay-fokussiert 🎯? Budget und Plattform? 💰🎮'
      },
      {
        user: 'Lange Spielzeit',
        assistant: 'Verstehe! ⏰ Open-World RPGs 🌍, MMOs 🌐 oder Story-Adventures 📖? Und wie viel Zeit hast du pro Woche? ⌚'
      },
      {
        user: 'Kurze Sessions',
        assistant: 'Smart! ⚡ Arcade-Games 🕹️, Puzzle 🧩 oder Quick-Matches ⏱️? Welche Plattform und welches Genre? 🎮'
      },
      {
        user: 'Couch Coop',
        assistant: 'Genial! 🛋️ Für wie viele Spieler? 👥 Party-Games 🎉, Koop-Adventures 🤝 oder Kampfspiele 🥊?'
      },
      {
        user: 'Retro Games',
        assistant: 'Nice! 👾 Klassische Pixel-Art 🎨, Remasters ✨ oder Indie-Retro 🎮? Welche Ära magst du am liebsten? 📅'
      },
      {
        user: 'Schwierige Spiele',
        assistant: 'Hardcore! 💀 Dark Souls-Style ⚔️, Precision-Platformer 🎯 oder Strategie 🧠? Welche Plattform? 🎮'
      },
      {
        user: 'Story-fokussiert',
        assistant: 'Perfekt! 📚 Cinematic Adventures 🎬, RPGs 🗡️ oder Interactive Fiction 📖? Und wie lang darf die Story sein? ⏰'
      },
      {
        user: 'Competitive Gaming',
        assistant: 'Pro! 🏆 MOBA ⚔️, FPS 🔫 oder Fighting Games 🥊? Suchst du was Etabliertes 👑 oder Neues 🆕?'
      },
      {
        user: 'Indie Games',
        assistant: 'Cool! 🎨 Pixel-Art 👾, Experimental 🧪 oder Story-driven Indies 📖? Welches Genre bevorzugst du? 🤔'
      },
      {
        user: 'VR Spiele',
        assistant: 'Awesome! 🥽 Welches VR-Headset? Action ⚔️, Simulation 🌍 oder entspannte Experiences 😌?'
      },
      {
        user: 'Spiele für Paare',
        assistant: 'Sweet! 💕 Koop-Adventures 🤝, Puzzle-Games 🧩 oder kompetitive Titel 🏆? Welche Plattform? 🎮'
      },
      {
        user: 'Sport Spiele',
        assistant: 'Sportlich! ⚽ FIFA/PES 🏟️, Basketball 🏀 oder eher Extreme Sports 🏂? Welche Sportart? 🤔'
      },
      {
        user: 'Rennspiele',
        assistant: 'Speed! 🏎️ Simulation wie Gran Turismo 🏁 oder Arcade wie Mario Kart 🍄? Welche Plattform? 🎮'
      },
      {
        user: 'Strategie Spiele',
        assistant: 'Taktisch! 🧠 Real-Time Strategy ⚡, Turn-Based 🎯 oder City Builder 🏗️? PC oder Konsole? 💻🎮'
      },
      {
        user: 'Puzzle Spiele',
        assistant: 'Knifflig! 🧩 Logic Puzzles 🤔, Match-3 💎 oder Physics-Based 🔬? Für welche Plattform? 📱🎮'
      },
      { 
        user: 'Zeig mir Action Spiele', 
        assistant: 'Hier sind die besten Action-Games: DOOM Eternal für 19€, GTA V für 29€, Spider-Man Remastered für 45€, Call of Duty MW2 für 59€, Cyberpunk 2077 für 39€. Alle sind sofort verfügbar und bieten packende Action. Welches interessiert dich am meisten? Brauchst du Infos zu einem bestimmten Titel? 🎮⚔️' 
      },
      { 
        user: 'Was gibt es unter 20 Euro',
        assistant: 'Diese Spiele sind unter 20€: Portal 2 (15€), Stardew Valley (14€), Terraria (10€). 💰'
      },
      { 
        user: 'Suche Abenteuer',
        assistant: 'Top Adventure-Hits: Uncharted 4 (39€), Tomb Raider (29€), God of War (49€). 🗺️'
      }
    ]
  });

  // 🔥 NEUE VEKTOR-SUCHE SPEZIAL-REGELN
  await ChatPrompt.create({
    type: 'vector_search',
    question: 'Vektor-Suche Anweisungen',
    rules: [
      'Nutze Vektor-Suche für JEDE Spielanfrage - auch bei Tippfehlern',
      'Suche semantisch ähnliche Spiele, nicht nur exakte Matches',
      'Kombiniere Vektor-Ergebnisse mit Genre-Filter als Ergänzung',
      'Priorisiere IMMER Vektor-Ergebnisse über reine Genre-Matches',
      'Suche auch bei unklaren Begriffen wie "magie", "kämpfen", "bauen"',
      'Verwende Preis-Filter wenn Budget erwähnt wird',
      'Ignoriere Rechtschreibfehler - finde trotzdem passende Spiele'
    ],
    examples: [
      {
        user: 'puzzel spiele',
        assistant: 'Vektor-Suche findet Puzzle-Games trotz Tippfehler'
      },
      {
        user: 'magie und zauber',
        assistant: 'Vektor-Suche findet Fantasy RPGs mit Magie-Elementen'
      },
      {
        user: 'kämpfen und action',
        assistant: 'Vektor-Suche findet Action-Spiele mit Kampf-Fokus'
      },
      {
        user: 'bauen und sammeln',
        assistant: 'Vektor-Suche findet Aufbau- und Sammelspiele'
      }
    ]
  });

  // 🔥 NEUE SPIELANFRAGE-ERKENNUNG mit spezifischen Spielnamen und Aktivitäten
  await ChatPrompt.create({
    type: 'game_detection',
    question: 'Spielanfrage Erkennung',
    keywords: [
      // Genres
      'action', 'adventure', 'rpg', 'strategy', 'puzzle', 'horror', 'racing', 'sport', 'simulation',
      'shooter', 'platformer', 'fighting', 'mmo', 'indie', 'arcade',
      // Deutsche Begriffe
      'spiel', 'game', 'zocken', 'spielen', 'genre', 'abenteuer', 'strategie', 'rätsel', 'rennen',
      'kämpfen', 'bauen', 'sammeln', 'magie', 'zauber', 'fantasy', 'sci-fi', 'krieg', 'auto',
      // Plattformen
      'pc', 'playstation', 'xbox', 'nintendo', 'switch', 'ps5', 'ps4',
      // Gaming-Begriffe
      'multiplayer', 'singleplayer', 'coop', 'online', 'offline', 'level', 'boss', 'quest',
      'open world', 'story', 'grafik', 'gameplay', 'dlc', 'season pass',
      
      // 🔥 NEUE SPEZIFISCHE SPIELNAMEN UND CHARAKTERE
      'mario', 'luigi', 'peach', 'bowser', 'nintendo', 'super mario', 'mario kart', 'mario party',
      'zelda', 'link', 'hyrule', 'legend of zelda', 'breath of wild', 'tears of kingdom',
      'pokemon', 'pikachu', 'pokémon', 'ash', 'trainer', 'pokemon go',
      'sonic', 'sega', 'rings', 'sonic hedgehog',
      'minecraft', 'steve', 'creeper', 'enderman', 'nether', 'diamond',
      'fortnite', 'battle royale', 'epic games', 'v-bucks',
      'fifa', 'fußball', 'football', 'uefa', 'weltmeisterschaft',
      'call of duty', 'cod', 'warfare', 'modern warfare', 'warzone',
      'grand theft auto', 'gta', 'rockstar', 'vice city', 'san andreas',
      'assassins creed', 'ubisoft', 'assassin', 'animus',
      'witcher', 'geralt', 'rivia', 'witcher 3', 'wild hunt',
      'cyberpunk', 'night city', 'keanu reeves',
      'god of war', 'kratos', 'sparta', 'olymp',
      'halo', 'master chief', 'cortana', 'xbox',
      'valorant', 'riot games', 'agent', 'spike',
      'league of legends', 'lol', 'champion', 'summoner',
      'overwatch', 'blizzard', 'hero', 'tracer',
      'apex legends', 'respawn', 'legend', 'battle royale',
      
      // 🔥 NEUE AKTIVITÄTEN UND HOBBYS
      'schwimmen', 'swimming', 'pool', 'wasser', 'tauchen', 'meer', 'ozean', 'fisch',
      'fliegen', 'flugzeug', 'pilot', 'himmel', 'luftfahrt', 'aircraft',
      'fahren', 'auto', 'motorrad', 'rennwagen', 'formel 1', 'drift',
      'kochen', 'cooking', 'restaurant', 'chef', 'küche', 'rezept', 'backen',
      'bauen', 'konstruieren', 'architektur', 'häuser', 'städte', 'lego',
      'musik', 'instrument', 'gitarre', 'klavier', 'drums', 'band', 'konzert',
      'tanzen', 'dancing', 'rhythmus', 'choreografie', 'ballet',
      'zeichnen', 'malen', 'kunst', 'design', 'kreativ', 'artistic',
      'gärtnern', 'pflanzen', 'blumen', 'farming', 'landwirtschaft',
      'angeln', 'fishing', 'rute', 'köder', 'see', 'river',
      'klettern', 'climbing', 'berg', 'mountain', 'extreme sport',
      'boxen', 'kämpfen', 'martial arts', 'karate', 'judo', 'mma',
      'golf', 'tennis', 'basketball', 'volleyball', 'badminton',
      'skifahren', 'snowboard', 'winter', 'schnee', 'alps',
      'surfen', 'surfing', 'wellen', 'board', 'beach',
      
      // 🔥 NEUE INTERESSEN UND THEMEN
      'weltraum', 'space', 'rakete', 'planet', 'alien', 'astronaut',
      'piraten', 'pirate', 'schiff', 'schatz', 'insel', 'karibik',
      'cowboys', 'western', 'wildwest', 'pferd', 'revolver',
      'ninjas', 'samurai', 'japan', 'katana', 'martial arts',
      'ritter', 'mittelalter', 'burg', 'schwert', 'rüstung',
      'zombies', 'untote', 'apokalypse', 'survival', 'virus',
      'drachen', 'dragon', 'fantasy', 'magie', 'elfen', 'zwerge',
      'roboter', 'mech', 'cyborg', 'ki', 'artificial intelligence',
      'detektiv', 'krimi', 'mystery', 'sherlock', 'ermittlung',
      'krieg', 'military', 'soldat', 'panzer', 'armee',
      'liebe', 'romance', 'dating', 'beziehung', 'heart',
      'schule', 'university', 'student', 'lernen', 'bildung',
      
      // Tippfehler und Varianten
      'puzzel', 'räzel', 'magie spiele', 'auto spiele', 'maripo', 'schwiumm'
    ],
    rules: [
      'Erkenne ALLE Spielnamen, Charaktere und Aktivitäten als Gaming-Wünsche',
      'Bei spezifischen Namen wie "mario" → Suche Mario-Spiele',
      'Bei Aktivitäten wie "schwimmen" → Suche Schwimm-/Wasser-Spiele',
      'Bei "such mario" oder "such mir mario spiele" → Direkte Mario-Suche',
      'Ignoriere Tippfehler: "maripo" = "mario", "schwiumm" = "schwimmen"',
      'Frage IMMER nach: Simulation oder Action-Variante?',
      'Prüfe ob Nachricht Gaming-Keywords ODER Interessen enthält',
      'Bei Match: Starte sofort Vektor-Suche mit Gaming-Kontext',
      'Bei keinem Match: Normale Unterhaltung',
      'Behandle "such [BEGRIFF]" immer als Spielanfrage'
    ],
    examples: [
      {
        user: 'such mario',
        assistant: 'Mario-Power! 🍄 Hier sind die besten Mario-Spiele!'
      },
      {
        user: 'such mir mario spiele',
        assistant: 'Super! 🍄 Hier sind top Mario-Titel!'
      },
      {
        user: 'such schwimm spiele',
        assistant: 'Splash! 🏊‍♂️ Hier sind coole Schwimm- und Wasser-Spiele!'
      },
      {
        user: 'maripo spiele',
        assistant: 'Mario-Time! 🍄 (Meintest du Mario?) Hier sind die Hits!'
      },
      {
        user: 'ich mag schwimmen',
        assistant: 'Cool! 🌊 Suchst du Unterwasser-Abenteuer oder Schwimm-Simulationen? 🐠'
      },
      {
        user: 'pokemon games',
        assistant: 'Gotta catch em all! ⚡ Hier sind Pokemon-Spiele!'
      },
      {
        user: 'such zelda',
        assistant: 'Hyrule ruft! ⚔️ Hier sind die besten Zelda-Abenteuer!'
      }
    ]
  });

  // 🔥 NEUE HÖFLICHKEITS-ERKENNUNG
  await ChatPrompt.create({
    type: 'politeness_detection',
    question: 'Höflichkeitsfloskeln Erkennung',
    patterns: [
      '^(danke|dankeschön|vielen dank|thx|thanks)$',
      '^(tschüss|auf wiedersehen|bis dann|ciao|bye)$',
      '^(ok|okay|alles klar|verstanden|gut)$',
      '^(ja|nein|vielleicht|hmm|aha)$',
      '^(super|toll|cool|nice|perfekt)$',
      '^(sorry|entschuldigung|ups)$'
    ],
    rules: [
      'Bei Höflichkeitsfloskeln: KEINE Spielsuche',
      'Antworte höflich und kurz',
      'Biete weitere Hilfe an'
    ],
    examples: [
      {
        user: 'Danke dir',
        assistant: 'Gerne! 😊 Falls du noch Fragen zu Spielen hast, frag einfach! 🎮'
      },
      {
        user: 'Tschüss',
        assistant: 'Bis bald! 👋 Viel Spaß beim Zocken! 🎮✨'
      },
      {
        user: 'Ok verstanden',
        assistant: 'Super! 👍 Brauchst du noch weitere Empfehlungen? 🤔'
      },
      {
        user: 'Das ist cool',
        assistant: 'Freut mich! 😄 Soll ich dir ähnliche Spiele zeigen? 🎯'
      },
      {
        user: 'Super',
        assistant: 'Toll! ✨ Kann ich dir noch bei anderen Spielen helfen? 🎮'
      },
      {
        user: 'Alles klar',
        assistant: 'Perfekt! �� Noch Fragen zu anderen Games? 🤔'
      }
    ]
  });

  // Initialer Begrüßungs-Prompt
  await ChatPrompt.create({
    type: 'initial',
    question: 'Hey! 🎮 Ich bin dein Gaming-Berater bei GameCompass! 🌟 Welches Spiel suchst du? Erzähl mir dein Genre und Budget! 💰',
    responseType: 'simple',
    nextPrompt: 'genre'
  });

  // Erweiterte Follow-up Prompts
  await ChatPrompt.create({
    type: 'budget_check',
    question: 'Wie viel möchtest du ausgeben? 💰',
    options: ['Unter 20€ 💵', '20-40€ 💸', '40-60€ 💳', 'Über 60€ 💎', 'Egal, Hauptsache gut ✨'],
    responseType: 'simple'
  });

  await ChatPrompt.create({
    type: 'platform_check', 
    question: 'Auf welcher Plattform spielst du? 🎮',
    options: ['PC 💻', 'PlayStation 5 🎮', 'PlayStation 4 🎮', 'Xbox Series X/S 🎮', 'Xbox One 🎮', 'Nintendo Switch 🎮', 'Mobile 📱'],
    responseType: 'simple'
  });

  await ChatPrompt.create({
    type: 'multiplayer_check',
    question: 'Spielst du lieber allein oder mit anderen? 👥',
    options: ['Singleplayer 👤', 'Multiplayer Online 🌐', 'Couch Coop 🛋️', 'Beides 🤝', 'Kommt drauf an 🤔'],
    responseType: 'simple'
  });

  await ChatPrompt.create({
    type: 'experience_check',
    question: 'Wie erfahren bist du im Gaming? 🎯',
    options: ['Anfänger 🌟', 'Gelegenheitsspieler 😊', 'Erfahren 💪', 'Hardcore Gamer 🔥'],
    responseType: 'simple'
  });

  await ChatPrompt.create({
    type: 'time_check',
    question: 'Wie viel Zeit hast du zum Spielen? ⏰',
    options: ['Wenig (1-2h) ⚡', 'Normal (3-5h) ⏱️', 'Viel (6h+) ⏰', 'Wochenende-Gamer 📅'],
    responseType: 'simple'
  });

  await ChatPrompt.create({
    type: 'mood_check',
    question: 'Worauf hast du Lust? 🎯',
    options: ['Action & Adrenalin ⚔️', 'Entspannung 😌', 'Herausforderung 💪', 'Story erleben 📖', 'Mit Freunden spielen 👥'],
    responseType: 'simple'
  });

  // Spezielle Verkaufs-Prompts
  await ChatPrompt.create({
    type: 'sales_closing',
    question: 'Verkaufsabschluss',
    rules: [
      'Fasse die Empfehlung kurz zusammen',
      'Erwähne den Preis und eventuelle Angebote',
      'Frage nach dem Kauf oder weiteren Fragen',
      'Sei hilfsbereit aber nicht aufdringlich',
      'Nutze passende Emojis für den Abschluss'
    ],
    examples: [
      {
        user: 'Das klingt gut',
        assistant: 'Perfekt! 🎯 Das Spiel kostet 39€ 💰 und ist gerade im Angebot! 🔥 Soll ich es für dich in den Warenkorb legen? 🛒'
      },
      {
        user: 'Ich nehme es',
        assistant: 'Excellent! ✨ Gleich im Warenkorb! 🛒 Brauchst du noch Controller 🎮 oder andere Spiele? 🤔'
      }
    ]
  });

  await ChatPrompt.create({
    type: 'upselling',
    question: 'Zusatzverkauf',
    rules: [
      'Schlage passende DLCs oder Season Passes vor',
      'Erwähne ähnliche Spiele als Bundle',
      'Weise auf Zubehör hin wenn relevant',
      'Bleibe dezent und kundenorientiert',
      'Verwende motivierende Emojis'
    ],
    examples: [
      {
        user: 'Ich kaufe das Spiel',
        assistant: 'Super Wahl! 🌟 Übrigens gibt es auch den Season Pass mit 3 DLCs für nur 15€ extra! 🎁 Interesse? 🤔'
      },
      {
        user: 'Noch mehr Spiele?',
        assistant: 'Klar! 🚀 Ähnliche Titel im Bundle sparen 20%! 💸 Oder brauchst du einen neuen Controller? 🎮'
      }
    ]
  });

  // 🔥 NEUE INTERESSE-MAPPING für Gaming-Kontext
  await ChatPrompt.create({
    type: 'interest_mapping',
    question: 'Allgemeine Interessen zu Gaming-Begriffen',
    mappings: [
      {
        pattern: 'tauchen|diving|unterwasser|ozean|meer',
        gamingTerms: 'underwater exploration diving submarine ocean'
      },
      {
        pattern: 'kochen|cooking|küche|restaurant|chef',
        gamingTerms: 'cooking simulation restaurant management chef'
      },
      {
        pattern: 'fliegen|flugzeug|pilot|aviation',
        gamingTerms: 'flight simulator aviation pilot aircraft'
      },
      {
        pattern: 'fahren|auto|motorrad|racing',
        gamingTerms: 'racing driving cars motorcycle simulation'
      },
      {
        pattern: 'bauen|konstruieren|architektur',
        gamingTerms: 'building construction city builder sandbox'
      },
      {
        pattern: 'musik|instrument|band|rhythmus',
        gamingTerms: 'rhythm games music production DJ simulation'
      },
      {
        pattern: 'sport|fußball|basketball|tennis',
        gamingTerms: 'sports games football basketball tennis FIFA'
      },
      {
        pattern: 'weltraum|space|rakete|alien',
        gamingTerms: 'space exploration sci-fi alien planets'
      },
      {
        pattern: 'piraten|schiff|seefahrt',
        gamingTerms: 'pirates naval combat sea adventure treasure'
      },
      {
        pattern: 'landwirtschaft|farming|traktor',
        gamingTerms: 'farming simulation agriculture tractor harvest'
      }
    ]
  });

  // 🔥 NEUE NORMALE UNTERHALTUNG + GAMING ÜBERLEITUNG
  await ChatPrompt.create({
    type: 'casual_conversation',
    question: 'Normale Unterhaltung mit Gaming-Überleitung',
    keywords: [
      'wie geht', 'wie gehts', 'was machst du', 'was ist los', 'alles gut',
      'wie läuft', 'was gibt es neues', 'erzähl mal', 'was machst du so',
      'langweilig', 'langeweile', 'was soll ich machen', 'mir ist langweilig',
      'wetter', 'heute', 'morgen', 'wochenende', 'freizeit', 'zeit',
      'müde', 'stress', 'entspannen', 'chillen', 'pause'
    ],
    rules: [
      'Antworte natürlich auf die Frage',
      'Leite IMMER zu Gaming über',
      'Sei freundlich und persönlich',
      'Nutze die Situation für Spielempfehlungen',
      'Frage nach Gaming-Vorlieben'
    ],
    examples: [
      {
        user: 'Wie geht es dir?',
        assistant: 'Mir geht es super, danke! 😊 Ich helfe gerade Gamern bei der Spielesuche! 🎮 Und dir? Suchst du vielleicht ein neues Spiel zum Entspannen? 🤔'
      },
      {
        user: 'Was machst du so?',
        assistant: 'Ich berate Leute bei Spielen! 🎯 Macht total Spaß! 😄 Was machst du denn gerne? Zockst du auch? Welches Genre magst du? 🎮'
      },
      {
        user: 'Mir ist langweilig',
        assistant: 'Oh nein! 😅 Da kann ich helfen! 🚀 Ein gutes Spiel vertreibt jede Langeweile! 🎮 Magst du Action ⚔️, Puzzle 🧩 oder entspannte Sims? 🤔'
      },
      {
        user: 'Alles gut bei dir?',
        assistant: 'Ja, läuft! 👍 Helfe gerade bei Gaming-Empfehlungen! 🎮 Bei dir auch alles okay? Brauchst du Ablenkung? Welche Spiele zockst du gerne? 🤔'
      },
      {
        user: 'Ich bin müde',
        assistant: 'Verstehe! 😴 Entspannende Spiele können helfen! 😌 Magst du ruhige Sims 🌸, gemütliche Puzzle 🧩 oder lieber was Actionreiches zum Wachwerden? ⚡'
      },
      {
        user: 'Stress auf der Arbeit',
        assistant: 'Oh man! 😓 Gaming ist perfekt zum Entspannen! 🎮 Suchst du was Ruhiges zum Abschalten 😌 oder Action zum Dampf ablassen? ⚔️'
      },
      {
        user: 'Was soll ich heute machen?',
        assistant: 'Hmm! 🤔 Wie wäre es mit einem neuen Spiel? 🎮 Hast du Lust auf Abenteuer 🗺️, Kreativität 🏗️ oder Wettkampf? 🏆 Welche Plattform hast du? 💻🎮'
      },
      {
        user: 'Wochenende steht an',
        assistant: 'Nice! 🎉 Perfekt für Gaming-Sessions! 🎮 Planst du lange Zocken? Dann brauchst du ein gutes RPG 🗡️ oder Open-World Game 🌍! Budget? 💰'
      }
    ]
  });

  // 🔥 NEUE ALGORITHMUS-BASIERTE SUCHE
  await ChatPrompt.create({
    type: 'search_algorithm',
    question: 'Intelligente Spielsuche-Algorithmen',
    algorithms: [
      {
        name: 'semantic_vector_search',
        priority: 1,
        description: 'Semantische Ähnlichkeitssuche mit Embeddings',
        parameters: {
          similarity_threshold: 0.7,
          max_results: 10,
          boost_factors: {
            title_match: 2.0,
            genre_match: 1.5,
            description_match: 1.0,
            developer_match: 1.2
          }
        }
      },
      {
        name: 'fuzzy_text_matching',
        priority: 2,
        description: 'Fehlertolerante Textsuche für Tippfehler',
        parameters: {
          edit_distance: 2,
          phonetic_matching: true,
          synonym_expansion: true
        }
      },
      {
        name: 'collaborative_filtering',
        priority: 3,
        description: 'Empfehlungen basierend auf ähnlichen Nutzern',
        parameters: {
          min_common_games: 3,
          similarity_metric: 'cosine',
          recommendation_weight: 0.3
        }
      },
      {
        name: 'content_based_filtering',
        priority: 4,
        description: 'Empfehlungen basierend auf Spieleigenschaften',
        parameters: {
          feature_weights: {
            genre: 0.4,
            rating: 0.2,
            price_range: 0.1,
            release_year: 0.1,
            platforms: 0.1,
            tags: 0.1
          }
        }
      }
    ],
    rules: [
      'Nutze IMMER mehrere Algorithmen parallel für bessere Ergebnisse',
      'Kombiniere Vektor-Suche mit Fuzzy-Matching für Tippfehler',
      'Gewichte Ergebnisse nach Relevanz und Verfügbarkeit',
      'Priorisiere verfügbare Spiele über ausverkaufte',
      'Berücksichtige Nutzer-Präferenzen und Kaufhistorie',
      'Verwende Machine Learning für personalisierte Empfehlungen'
    ]
  });

  // 🔥 ERWEITERTE QUERY-PROCESSING MIT NLP
  await ChatPrompt.create({
    type: 'nlp_processing',
    question: 'Natural Language Processing für Spielanfragen',
    techniques: [
      {
        name: 'intent_classification',
        description: 'Erkennung der Nutzerabsicht',
        categories: [
          'game_search', 'price_inquiry', 'genre_preference', 
          'platform_specific', 'multiplayer_request', 'story_focused',
          'graphics_quality', 'difficulty_level', 'time_investment'
        ]
      },
      {
        name: 'entity_extraction',
        description: 'Extraktion von Gaming-Entitäten',
        entities: [
          'game_names', 'genres', 'platforms', 'developers', 'publishers',
          'price_ranges', 'release_dates', 'ratings', 'features'
        ]
      },
      {
        name: 'sentiment_analysis',
        description: 'Analyse der Nutzer-Stimmung',
        sentiments: ['positive', 'negative', 'neutral', 'excited', 'frustrated']
      },
      {
        name: 'context_understanding',
        description: 'Verstehen des Gesprächskontexts',
        context_types: [
          'first_time_buyer', 'returning_customer', 'gift_purchase',
          'budget_conscious', 'premium_seeker', 'casual_gamer', 'hardcore_gamer'
        ]
      }
    ],
    rules: [
      'Analysiere JEDE Anfrage mit NLP-Techniken',
      'Extrahiere Gaming-Entitäten automatisch',
      'Erkenne versteckte Präferenzen in der Sprache',
      'Berücksichtige Kontext aus vorherigen Nachrichten',
      'Passe Antworten an Nutzer-Sentiment an'
    ]
  });

  // 🔥 INTELLIGENTE DATENBANK-QUERIES
  await ChatPrompt.create({
    type: 'database_optimization',
    question: 'Optimierte Datenbank-Abfragen für Spielsuche',
    query_strategies: [
      {
        name: 'multi_stage_search',
        description: 'Mehrstufige Suche mit Fallback-Strategien',
        stages: [
          {
            stage: 1,
            method: 'exact_match',
            fields: ['name', 'aliases'],
            boost: 3.0
          },
          {
            stage: 2,
            method: 'fuzzy_search',
            fields: ['name', 'description', 'tags'],
            boost: 2.0
          },
          {
            stage: 3,
            method: 'semantic_search',
            fields: ['description', 'features'],
            boost: 1.5
          },
          {
            stage: 4,
            method: 'genre_expansion',
            fields: ['genres', 'categories'],
            boost: 1.0
          }
        ]
      },
      {
        name: 'dynamic_filtering',
        description: 'Intelligente Filter basierend auf Kontext',
        filters: [
          {
            name: 'availability_filter',
            condition: 'in_stock = true',
            priority: 'high'
          },
          {
            name: 'price_filter',
            condition: 'price <= user_budget',
            priority: 'high'
          },
          {
            name: 'platform_filter',
            condition: 'platforms CONTAINS user_platform',
            priority: 'medium'
          },
          {
            name: 'rating_filter',
            condition: 'rating >= 7.0',
            priority: 'medium'
          },
          {
            name: 'release_date_filter',
            condition: 'release_date >= "2020-01-01"',
            priority: 'low'
          }
        ]
      }
    ],
    indexing_strategies: [
      'CREATE INDEX ON games(name, genres, rating)',
      'CREATE FULLTEXT INDEX ON games(description, tags)',
      'CREATE INDEX ON games(price, availability)',
      'CREATE VECTOR INDEX ON games(embedding) USING HNSW'
    ]
  });

  // 🔥 MACHINE LEARNING EMPFEHLUNGEN
  await ChatPrompt.create({
    type: 'ml_recommendations',
    question: 'Machine Learning für Spielempfehlungen',
    models: [
      {
        name: 'neural_collaborative_filtering',
        description: 'Deep Learning für User-Item Interaktionen',
        architecture: {
          embedding_dim: 128,
          hidden_layers: [256, 128, 64],
          dropout: 0.2,
          activation: 'relu'
        },
        features: [
          'user_id', 'game_id', 'rating', 'playtime', 'purchase_date',
          'genre_preferences', 'platform_usage', 'price_sensitivity'
        ]
      },
      {
        name: 'content_similarity_model',
        description: 'Spiel-zu-Spiel Ähnlichkeitsmodell',
        features: [
          'genre_vector', 'tag_vector', 'developer_embedding',
          'rating_score', 'price_tier', 'complexity_level'
        ],
        similarity_metrics: ['cosine', 'euclidean', 'jaccard']
      },
      {
        name: 'trending_games_predictor',
        description: 'Vorhersage von Trend-Spielen',
        features: [
          'search_volume', 'social_mentions', 'review_sentiment',
          'sales_velocity', 'streamer_activity', 'seasonal_patterns'
        ]
      }
    ],
    training_data: [
      'user_game_interactions', 'ratings_reviews', 'purchase_history',
      'browsing_behavior', 'search_queries', 'demographic_data'
    ]
  });

  // 🔥 REAL-TIME PERSONALISIERUNG
  await ChatPrompt.create({
    type: 'personalization_engine',
    question: 'Echtzeit-Personalisierung für jeden Nutzer',
    personalization_factors: [
      {
        name: 'gaming_profile',
        weight: 0.3,
        factors: [
          'favorite_genres', 'playtime_preferences', 'difficulty_level',
          'multiplayer_vs_singleplayer', 'story_importance', 'graphics_priority'
        ]
      },
      {
        name: 'behavioral_patterns',
        weight: 0.25,
        factors: [
          'browsing_history', 'search_patterns', 'time_spent_categories',
          'cart_abandonment', 'wishlist_items', 'review_activity'
        ]
      },
      {
        name: 'contextual_factors',
        weight: 0.2,
        factors: [
          'time_of_day', 'day_of_week', 'season', 'upcoming_releases',
          'current_trends', 'friend_activity', 'social_influence'
        ]
      },
      {
        name: 'economic_factors',
        weight: 0.15,
        factors: [
          'price_sensitivity', 'discount_responsiveness', 'premium_willingness',
          'bundle_preferences', 'dlc_purchase_history'
        ]
      },
      {
        name: 'technical_preferences',
        weight: 0.1,
        factors: [
          'platform_preference', 'hardware_capabilities', 'vr_compatibility',
          'controller_preference', 'graphics_settings'
        ]
      }
    ]
  });

  // 🔥 ADVANCED SEARCH OPERATORS
  await ChatPrompt.create({
    type: 'advanced_search_operators',
    question: 'Erweiterte Suchoperatoren für komplexe Anfragen',
    operators: [
      {
        operator: 'SIMILAR_TO',
        syntax: 'SIMILAR_TO("game_name", threshold=0.8)',
        description: 'Findet ähnliche Spiele basierend auf Features'
      },
      {
        operator: 'GENRE_BLEND',
        syntax: 'GENRE_BLEND(["Action", "RPG"], weights=[0.7, 0.3])',
        description: 'Mischt Genres mit gewichteten Präferenzen'
      },
      {
        operator: 'PRICE_RANGE_SMART',
        syntax: 'PRICE_RANGE_SMART(budget=50, flexibility=0.2)',
        description: 'Intelligente Preissuche mit Flexibilität'
      },
      {
        operator: 'TRENDING_BOOST',
        syntax: 'TRENDING_BOOST(factor=1.5, timeframe="30d")',
        description: 'Verstärkt aktuell beliebte Spiele'
      },
      {
        operator: 'COMPATIBILITY_CHECK',
        syntax: 'COMPATIBILITY_CHECK(platform, hardware_specs)',
        description: 'Prüft Kompatibilität mit User-Hardware'
      }
    ],
    complex_queries: [
      {
        description: 'Nutzer sucht "action rpg unter 40 euro"',
        query: `
          GENRE_BLEND(["Action", "RPG"], weights=[0.6, 0.4])
          AND PRICE_RANGE_SMART(budget=40, flexibility=0.1)
          AND AVAILABILITY_CHECK()
          ORDER BY (rating * 0.4 + popularity * 0.3 + value_score * 0.3) DESC
        `
      },
      {
        description: 'Nutzer sucht "spiele wie witcher 3"',
        query: `
          SIMILAR_TO("The Witcher 3", threshold=0.75)
          AND GENRE_MATCH(["RPG", "Open World"])
          AND TRENDING_BOOST(factor=1.2)
          ORDER BY similarity_score DESC
        `
      }
    ]
  });

  // 🔥 QUALITY SCORING ALGORITHM
  await ChatPrompt.create({
    type: 'quality_scoring',
    question: 'Intelligenter Qualitäts-Score für Spielempfehlungen',
    scoring_components: [
      {
        name: 'relevance_score',
        weight: 0.35,
        calculation: 'semantic_similarity * query_match * genre_alignment'
      },
      {
        name: 'quality_score',
        weight: 0.25,
        calculation: '(critic_rating * 0.6 + user_rating * 0.4) * review_count_factor'
      },
      {
        name: 'popularity_score',
        weight: 0.15,
        calculation: 'sales_rank * search_volume * social_mentions'
      },
      {
        name: 'value_score',
        weight: 0.15,
        calculation: 'content_hours / price * discount_factor'
      },
      {
        name: 'freshness_score',
        weight: 0.1,
        calculation: 'release_recency * update_frequency * community_activity'
      }
    ],
    final_formula: `
      FINAL_SCORE = (
        relevance_score * 0.35 +
        quality_score * 0.25 +
        popularity_score * 0.15 +
        value_score * 0.15 +
        freshness_score * 0.1
      ) * personalization_multiplier * availability_bonus
    `
  });

  // 🔥 A/B TESTING FÜR EMPFEHLUNGEN
  await ChatPrompt.create({
    type: 'ab_testing',
    question: 'A/B Testing für Empfehlungsalgorithmen',
    experiments: [
      {
        name: 'recommendation_algorithm_test',
        variants: [
          {
            name: 'control',
            algorithm: 'collaborative_filtering',
            traffic_split: 0.5
          },
          {
            name: 'treatment',
            algorithm: 'hybrid_ml_model',
            traffic_split: 0.5
          }
        ],
        metrics: [
          'click_through_rate', 'conversion_rate', 'user_satisfaction',
          'revenue_per_user', 'recommendation_diversity'
        ]
      },
      {
        name: 'search_ranking_test',
        variants: [
          {
            name: 'rating_focused',
            ranking_weights: { rating: 0.5, popularity: 0.3, price: 0.2 }
          },
          {
            name: 'popularity_focused',
            ranking_weights: { popularity: 0.5, rating: 0.3, price: 0.2 }
          }
        ]
      }
    ]
  });

  // 🔥 PERFORMANCE MONITORING
  await ChatPrompt.create({
    type: 'performance_monitoring',
    question: 'Performance-Überwachung der Suchalgorithmen',
    kpis: [
      {
        name: 'search_latency',
        target: '<200ms',
        alert_threshold: '>500ms'
      },
      {
        name: 'recommendation_accuracy',
        target: '>85%',
        alert_threshold: '<80%'
      },
      {
        name: 'user_satisfaction',
        target: '>4.5/5',
        alert_threshold: '<4.0/5'
      },
      {
        name: 'conversion_rate',
        target: '>15%',
        alert_threshold: '<10%'
      }
    ],
    monitoring_queries: [
      'SELECT AVG(response_time) FROM search_logs WHERE timestamp > NOW() - INTERVAL 1 HOUR',
      'SELECT COUNT(*) / COUNT(DISTINCT user_id) as avg_searches_per_user FROM search_logs',
      'SELECT algorithm, AVG(user_rating) FROM recommendation_feedback GROUP BY algorithm'
    ]
  });

  console.log('🚀 ERWEITERTE ALGORITHMUS-PROMPTS erstellt!');
  console.log('🤖 Machine Learning + NLP + Datenbank-Optimierung');
  console.log('📊 A/B Testing + Performance Monitoring');
  console.log('🎯 Personalisierung + Echtzeit-Empfehlungen');
  await mongoose.disconnect();
}

setupPrompts().catch(console.error); 