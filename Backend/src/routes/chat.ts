import { Router, Request, Response, RequestHandler } from 'express';
import { logger } from '../logger';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory } from '../model/ChatHistoryModel';
import { optionalAuthentication, requiresAuthentication } from './authenticator';
import { Session, SessionData } from 'express-session';
import chromaService from '../service/ChromaService';
import { Spiel } from '../model/SpielModel';
import { ChatPrompt } from '../model/ChatPromptModel';
import { Genre, IGenre } from '../model/GenreModel';
import { AIProviderFactory, ChatMessage as AIChatMessage, AIProvider } from '../service/AIService';

// Erweitere den Request-Typ, um die session-Eigenschaft zu unterstützen
interface CustomRequest extends Request {
  session: Session & Partial<SessionData> & {
    userId?: string;
  };
}

const chatRouter = Router();

// History-Array für Konversationsverlauf hinzufügen
interface ChatMessage {
  role: string;
  content: string;
}

// Test-Endpunkt hinzufügen
chatRouter.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Chat-API ist erreichbar' });
});

// Neue Endpunkte für Chatverlauf hinzufügen
chatRouter.get('/history/:sessionId', optionalAuthentication, (async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const chatHistory = await ChatHistory.findOne({
      sessionId,
      ...(userId ? { userId } : {}),
    });

    if (!chatHistory) {
      return res.status(404).json({ error: 'Chatverlauf nicht gefunden' });
    }

    res.json({ history: chatHistory.messages });
  } catch (error) {
    logger.error('Fehler beim Abrufen des Chatverlaufs:', error);
    res.status(500).json({
      message: 'Fehler beim Abrufen des Chatverlaufs',
      error: (error as Error).message,
    });
  }
}) as RequestHandler);

chatRouter.delete('/history/:sessionId', optionalAuthentication, (async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const result = await ChatHistory.findOneAndDelete({
      sessionId,
      ...(userId ? { userId } : {}),
    });

    if (!result) {
      return res.status(404).json({ error: 'Chatverlauf nicht gefunden' });
    }

    res.json({ message: 'Chatverlauf erfolgreich gelöscht' });
  } catch (error) {
    logger.error('Fehler beim Löschen des Chatverlaufs:', error);
    res.status(500).json({
      message: 'Fehler beim Löschen des Chatverlaufs',
      error: (error as Error).message,
    });
  }
}) as RequestHandler);

// Endpunkt zum Abrufen aller verfügbaren Chat-Sessions
chatRouter.get('/sessions', optionalAuthentication, (async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;

    const query = userId !== undefined ? { userId } : { userId: null };
    const chatSessions = await ChatHistory.find(query)
      .sort({ updatedAt: -1 })
      .select('sessionId messages updatedAt')
      .lean();

    // Erstelle eine Vorschau für jede Session
    const sessions = chatSessions.map((session) => {
      // Finde die letzte Nachricht für die Vorschau
      const lastMessage =
        session.messages.length > 0 ? session.messages[session.messages.length - 1].content : '';

      // Kürze die Vorschau auf 30 Zeichen
      const preview = lastMessage.length > 30 ? lastMessage.substring(0, 30) + '...' : lastMessage;

      return {
        sessionId: session.sessionId,
        preview,
        updatedAt: session.updatedAt,
        timestamp: session.updatedAt,
      };
    });

    res.json({ sessions });
  } catch (error) {
    logger.error('Fehler beim Abrufen der Chat-Sessions:', error);
    res.status(500).json({
      message: 'Fehler beim Abrufen der Chat-Sessions',
      error: (error as Error).message,
    });
  }
}) as RequestHandler);

// Am Anfang der Datei nach den Imports:
interface GameRecommendation {
  _id: string;
  name: string;
  description: string;
  background_image?: string;
  rating: number;
  genres: { name: string }[];
  price: number;
  developer?: string;
  platforms?: string[];
}

// ✨ NEUER Endpunkt für verfügbare KI-Provider
chatRouter.get('/providers', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Lade verfügbare KI-Provider...');
    const availableProviders = await AIProviderFactory.getAvailableProviders();
    const currentProvider = process.env.AI_PROVIDER || 'llama3';
    
    console.log(`📋 Verfügbare Provider: ${availableProviders.join(', ')}`);
    
    res.json({
      available: availableProviders,
      current: currentProvider,
      providers: {
        llama3: { name: 'Llama 3.1', model: 'llama3.1:latest' },
        deepseek: { name: 'DeepSeek R1', model: 'deepseek-r1:latest' },
        gemma3: { name: 'Gemma 3', model: 'gemma3:latest' },
        'llama3.1': { name: 'Llama 3.1', model: 'llama3.1:latest' },
        'deepseek-r1': { name: 'DeepSeek R1', model: 'deepseek-r1:latest' }
      }
    });
  } catch (error) {
    logger.error('Fehler beim Abrufen der KI-Provider:', error);
    res.status(500).json({
      message: 'Fehler beim Abrufen der KI-Provider',
      error: (error as Error).message,
    });
  }
});

// ✨ NEUER Endpunkt zum Wechseln des KI-Providers (ohne Authentifizierung)
chatRouter.post('/provider', optionalAuthentication, (async (req: Request, res: Response) => {
  try {
    const { provider } = req.body;
    
    if (!provider) {
      res.status(400).json({ error: 'Kein Provider angegeben' });
      return;
    }

    console.log(`🔄 Versuche Provider-Wechsel zu: ${provider}`);

    // Teste, ob der Provider verfügbar ist
    try {
      const aiProvider = AIProviderFactory.createProvider(provider);
      const isAvailable = await aiProvider.isAvailable();
      
      if (!isAvailable) {
        console.log(`❌ Provider ${provider} ist nicht verfügbar`);
        res.status(400).json({ error: `Provider ${provider} ist nicht verfügbar` });
        return;
      }
      
      console.log(`✅ Provider ${provider} erfolgreich gewechselt`);
      res.json({ 
        message: `Provider auf ${provider} gesetzt`,
        provider: aiProvider.getName(),
        model: aiProvider.getModel()
      });
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Providers ${provider}:`, error);
      res.status(400).json({ error: `Unbekannter Provider: ${provider}` });
      return;
    }
  } catch (error) {
    logger.error('Fehler beim Wechseln des KI-Providers:', error);  
    res.status(500).json({
      message: 'Fehler beim Wechseln des KI-Providers',
      error: (error as Error).message,
    });
  }
}) as RequestHandler);

// ✨ ERWEITERTE Hauptendpunkt für Chat-Anfragen
chatRouter.post('/', optionalAuthentication, (async (req: CustomRequest, res: Response) => {
  try {
    const genreCount = await Genre.countDocuments();
    console.log(`📚 Verfügbare Genres in der Datenbase: ${genreCount}`);
    
    // ✨ NEU: Provider aus Request oder Fallback auf Umgebungsvariable
    const { message, language = 'de', sessionId: clientSessionId, provider: requestProvider } = req.body;
    const userId = req.userId;

    if (!message) {
      res.status(400).json({ error: 'Keine Nachricht angegeben' });
      return;
    }

    const sessionId = clientSessionId || uuidv4();
    let chatHistory = await ChatHistory.findOne({
      sessionId,
      ...(userId ? { userId } : { userId: null }),
    });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: userId || null,
        sessionId,
        messages: [],
      });
    }

    // Nachricht zum Verlauf hinzufügen
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // ✨ KI-Provider auswählen
    const selectedProvider = requestProvider || process.env.AI_PROVIDER || 'llama3';
    let aiProvider: AIProvider;
    
    try {
      aiProvider = AIProviderFactory.createProvider(selectedProvider);
      console.log(`🤖 Verwende KI-Provider: ${aiProvider.getName()} (${aiProvider.getModel()})`);
    } catch (error) {
      console.warn(`⚠️ Provider ${selectedProvider} nicht verfügbar, verwende Llama3 als Fallback`);
      aiProvider = AIProviderFactory.createProvider('llama3');
    }

    // 🔥 DYNAMISCHE INTERESSE-ERKENNUNG aus DB
    const interestMapping = await ChatPrompt.findOne({ type: 'interest_mapping' });
    
    let enhancedQuery = message;
    if (interestMapping?.mappings) {
      for (const mapping of interestMapping.mappings) {
        if (new RegExp(mapping.pattern, 'i').test(message)) {
          enhancedQuery = `${message} ${mapping.gamingTerms}`;
          console.log('🎯 Interesse erkannt, erweitere Suche:', enhancedQuery);
          break;
        }
      }
    }

    // 🔥 DYNAMISCHE ERKENNUNG aus DB laden
    const gameDetection = await ChatPrompt.findOne({ type: 'game_detection' });
    const politenessDetection = await ChatPrompt.findOne({ type: 'politeness_detection' });
    const casualConversation = await ChatPrompt.findOne({ type: 'casual_conversation' });
    
    const isGameRelated = gameDetection?.keywords?.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    ) || false;
    
    const isGreeting = message.toLowerCase().match(/^(hallo|hi|hey|guten tag|servus|moin)$/);
    
    const isPolite = politenessDetection?.patterns?.some(pattern => 
      new RegExp(pattern, 'i').test(message.trim())
    ) || false;

    const isCasualTalk = casualConversation?.keywords?.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    ) || false;

    // Sprachspezifische Anweisungen
    const languageInstructions = {
      de: 'Antworte immer auf Deutsch und sei freundlich und hilfsbereit.',
      en: 'Always respond in English and be friendly and helpful.',
      es: 'Responde siempre en español y sé amable y servicial.',
      fr: 'Réponds toujours en français et sois amical et serviable.',
      ru: 'Всегда отвечай на русском языке и будь дружелюбным и полезным.',
      tr: 'Her zaman Türkçe yanıt ver ve arkadaş canlısı ve yardımsever ol.'
    };

    const validLanguage = Object.keys(languageInstructions).includes(language) ? language : 'de';
    const instruction = languageInstructions[validLanguage as keyof typeof languageInstructions];

    let gameRecommendations: GameRecommendation[] = [];

    // 🔥 ULTRA-VERBESSERTE SPIELERKENNUNG - Erkennt alles!
    const isExplicitGameRequest = 
      // Direkte Suchbegriffe
      message.toLowerCase().match(/^(such|suche|finde?|zeig|zeige|will|möchte|hätte|gib|gibt|hast|habt)/i) ||
      message.toLowerCase().match(/(spiel|game|titel).*(empfehlen|empfehlung|vorschlag|zeigen|suchen|finden)/i) ||
      message.toLowerCase().includes('was gibt es für spiele') ||
      message.toLowerCase().includes('welche spiele') ||
      // Genre-Anfragen
      message.toLowerCase().match(/^(such|suche|finde?).*(action|adventure|rpg|strategy|puzzle|horror|racing|sport)/i) ||
      message.toLowerCase().match(/(action|adventure|rpg|strategy|puzzle|horror|racing|sport).*(spiel|game)/i) ||
      message.toLowerCase().match(/^(action|adventure|rpg|strategy|puzzle|horror|racing|sport)(\s+spiele?)?$/i) ||
      // "Zeig mir..." Muster
      message.toLowerCase().match(/^(zeig|zeige)\s+(mir|uns)?\s*(action|adventure|rpg|strategy|puzzle|horror|racing|sport|spiel)/i) ||
      // 🔥 NEUE SPEZIFISCHE SPIELNAMEN
      message.toLowerCase().match(/(mario|luigi|peach|bowser|nintendo|super mario|mario kart|mario party)/i) ||
      message.toLowerCase().match(/(zelda|link|hyrule|legend of zelda|breath|tears)/i) ||
      message.toLowerCase().match(/(pokemon|pikachu|pokémon|ash|trainer)/i) ||
      message.toLowerCase().match(/(sonic|sega|rings|hedgehog)/i) ||
      message.toLowerCase().match(/(minecraft|steve|creeper|enderman|nether|diamond)/i) ||
      message.toLowerCase().match(/(fortnite|battle royale|epic games)/i) ||
      message.toLowerCase().match(/(fifa|fußball|football|uefa)/i) ||
      message.toLowerCase().match(/(call of duty|cod|warfare|warzone)/i) ||
      message.toLowerCase().match(/(gta|grand theft auto|rockstar|vice city|san andreas)/i) ||
      message.toLowerCase().match(/(witcher|geralt|rivia|wild hunt)/i) ||
      message.toLowerCase().match(/(cyberpunk|night city)/i) ||
      message.toLowerCase().match(/(god of war|kratos|sparta)/i) ||
      message.toLowerCase().match(/(halo|master chief|cortana)/i) ||
      // 🔥 NEUE AKTIVITÄTEN UND INTERESSEN
      message.toLowerCase().match(/(schwimmen|swimming|pool|wasser|tauchen|meer|ozean|fisch)/i) ||
      message.toLowerCase().match(/(fliegen|flugzeug|pilot|himmel|luftfahrt|aircraft)/i) ||
      message.toLowerCase().match(/(fahren|auto|motorrad|rennwagen|formel|drift)/i) ||
      message.toLowerCase().match(/(kochen|cooking|restaurant|chef|küche|rezept|backen)/i) ||
      message.toLowerCase().match(/(bauen|konstruieren|architektur|häuser|städte|lego)/i) ||
      message.toLowerCase().match(/(musik|instrument|gitarre|klavier|drums|band|konzert)/i) ||
      message.toLowerCase().match(/(tanzen|dancing|rhythmus|choreografie)/i) ||
      message.toLowerCase().match(/(angeln|fishing|rute|köder|see)/i) ||
      message.toLowerCase().match(/(klettern|climbing|berg|mountain)/i) ||
      message.toLowerCase().match(/(boxen|kämpfen|martial arts|karate|judo|mma)/i) ||
      message.toLowerCase().match(/(golf|tennis|basketball|volleyball|badminton)/i) ||
      message.toLowerCase().match(/(skifahren|snowboard|winter|schnee)/i) ||
      message.toLowerCase().match(/(surfen|surfing|wellen|board|beach)/i) ||
      // 🔥 TIPPFEHLER-ERKENNUNG
      message.toLowerCase().match(/(maripo|schwiumm|puzzel|räzel)/i) ||
      // 🔥 "SUCH" + ALLES = SPIELANFRAGE
      message.toLowerCase().match(/^such\s+/i) ||
      // ✨ ERWEITERTE Spielerkennung für Wikinger
      message.toLowerCase().match(/(wikinger|viking|nordisch|thor|odin|valhalla|ragnarök)/i) ||
      message.toLowerCase().match(/(mittelalter|ritter|schwert|burg|schlacht)/i);

    console.log(`🔍 Nachricht: "${message}"`);
    console.log(`🎯 Explizite Spielanfrage erkannt: ${isExplicitGameRequest}`);
    console.log(`🎮 Game-Related: ${isGameRelated}`);
    console.log(`👋 Greeting: ${isGreeting}`);
    console.log(`🗣️ Casual Talk: ${isCasualTalk}`);
    console.log(`🙏 Polite: ${isPolite}`);

    const shouldSkipGameSearch = 
      isGreeting || 
      isCasualTalk || 
      isPolite || 
      !isExplicitGameRequest;

    console.log(`⏭️ Skip Game Search: ${shouldSkipGameSearch}`);

    let response = '';
    
    // ✨ ERWEITERTE KI-Antwort-Generierung mit kürzeren Anweisungen
    if (shouldSkipGameSearch) {
      // Normale Konversation ohne Spielempfehlungen
      const systemPrompt = `Du bist ein freundlicher Assistent! ${instruction}

WICHTIGE REGELN:
- Antworte MAXIMAL 1 Satz
- KEINE Spielempfehlungen
- Kurz und präzise
- Bei Fragen nach Identität: "Ich bin ein KI-Assistent"`;

      const messages: AIChatMessage[] = [
        { role: 'user', content: message }
      ];

      try {
        const aiResponse = await aiProvider.generateResponse(messages, systemPrompt);
        response = aiResponse.content;
        
        console.log(`✅ ${aiProvider.getName()} Antwort erhalten`);
      } catch (error) {
        console.error(`❌ Fehler mit ${aiProvider.getName()}:`, error);
        throw new Error(`KI-Provider ${aiProvider.getName()} Fehler: ${(error as Error).message}`);
      }

      chatHistory.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      await chatHistory.save();
    } else {
      // Spielempfehlungen mit KI-Provider
      console.log('🎯 Starte Spielsuche für:', enhancedQuery);
      
      // 1. IMMER zuerst Vektor-Suche mit erweiterter Query
      const maxPrice = extractPrice(message);
      const similarIds = await chromaService.querySimilar(enhancedQuery, 5, maxPrice);
      
      if (similarIds.length > 0) {
        const vektorSpiele = await Spiel.find({ 
          _id: { $in: similarIds },
          ...(maxPrice ? { price: { $lte: maxPrice } } : {})
        })
          .select('name description background_image rating genres price developer platforms')
          .lean();

        gameRecommendations = similarIds
          .map(id => vektorSpiele.find(s => s._id.toString() === id))
          .filter(Boolean)
          .map((s: any): GameRecommendation => ({
            _id: s._id.toString(),
            name: s.name,
            description: s.description,
            background_image: s.background_image,
            rating: s.rating,
            genres: s.genres,
            price: s.price,
            developer: s.developer,
            platforms: s.platforms
          }));
          
        console.log('✅ Vektor-Suche Treffer:', gameRecommendations.map(g => g.name));
      }
      
      // 2. Nur als Ergänzung: Genre-Suche für mehr Vielfalt
      if (gameRecommendations.length < 3) {
        const genres = await extractGenres(message);
        if (genres.length > 0) {
          // Vereinfachte Genre-Suche ohne $regex
          const genreSpiele = await Spiel.find({
            genres: {
              $all: genres.map(genre => ({
                $elemMatch: { 
                  name: { $in: genres }
                }
              }))
            },
            _id: { $nin: similarIds },
            ...(maxPrice ? { price: { $lte: maxPrice } } : {})
          })
          .sort({ rating: -1 })
          .limit(2)
          .select('name description background_image rating genres price developer platforms')
          .lean();
          
          const mappedGenreSpiele = genreSpiele.map((s: any): GameRecommendation => ({
            _id: s._id.toString(),
            name: s.name,
            description: s.description,
            background_image: s.background_image,
            rating: s.rating,
            genres: s.genres,
            price: s.price,
            developer: s.developer,
            platforms: s.platforms
          }));

          // Verbesserte Genre-Filterung
          const filteredGenreSpiele = mappedGenreSpiele.filter(spiel => 
            genres.every(gesuchtesGenre => 
              spiel.genres.some(spielGenre => 
                spielGenre.name.toLowerCase() === gesuchtesGenre.toLowerCase()
              )
            )
          );

          gameRecommendations = [...gameRecommendations, ...filteredGenreSpiele];
          console.log('✅ Ergänzt durch Genre-Suche:', filteredGenreSpiele.map(g => g.name));
        }
      }

      // ✨ ERWEITERTE Antwort mit mehr Spielen aber ohne Bewertungen/Genres
      if (gameRecommendations.length > 0) {
        // Zeige 4-5 Spiele
        const topGames = gameRecommendations.slice(0, 5);
        const gameList = topGames.map(g => `${g.name} für ${g.price}€`);
        
        // Längere Antwort (3-4 Sätze) ohne Bewertungen und Genres
        response = `Hier sind ${topGames.length} perfekte Spiele für dich: ${gameList.join(', ')}. `;
        response += `Alle sind verfügbar und in unserem Shop erhältlich. `;
        response += `Welches spricht dich am meisten an? `;
        if (topGames.length >= 4) {
          response += `Brauchst du mehr Infos zu einem bestimmten Spiel?`;
        }
        
        console.log('✅ Erweiterte Spielantwort ohne Bewertungen:', response);
      } else {
        // Nur bei keinen Spielen KI verwenden
        const systemPrompt = `Du bist ein Gaming-Berater! ${instruction}
        
        REGEL: Maximal 1 Satz. Sage dass keine passenden Spiele gefunden wurden.`;
        
        const messages: AIChatMessage[] = [{ role: 'user', content: message }];
        
        try {
          const aiResponse = await aiProvider.generateResponse(messages, systemPrompt);
          response = aiResponse.content;
        } catch (error) {
          response = "Entschuldigung, ich habe keine passenden Spiele gefunden.";
        }
      }

      chatHistory.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      await chatHistory.save();
    }

    res.json({
      response: response,
      sessionId: chatHistory.sessionId,
      games: gameRecommendations.length > 0 ? gameRecommendations : undefined,
      provider: {
        name: aiProvider.getName(),
        model: aiProvider.getModel()
      }
    });
  } catch (error) {
    logger.error('Fehler bei der Verarbeitung der Chat-Anfrage:', error);
    res.status(500).json({
      message: 'Fehler bei der Verarbeitung der Chat-Anfrage',
      error: (error as Error).message,
    });
  }
}) as RequestHandler);

// Verbesserte extractGenres Funktion
async function extractGenres(message: string): Promise<string[]> {
  const allGenres = await Genre.find().lean();
  const normalizedMessage = message.toLowerCase();
  
  const foundGenres: string[] = [];
  
  for (const genre of allGenres) {
    const searchTerms = [
      genre.name.toLowerCase(),
      genre.germanName.toLowerCase(),
      ...genre.aliases
    ];
    
    if (searchTerms.some(term => 
      new RegExp(`\\b${term}\\b`, 'i').test(normalizedMessage)
    )) {
      foundGenres.push(genre.name);
      console.log(`🎮 Genre gefunden: ${genre.name} (via ${genre.germanName})`);
    }
  }
  
  return [...new Set(foundGenres)];
}

function extractPrice(message: string): number | undefined {
  const priceMatch = message.match(/(\d+)\s*(dollar|euro|€|\$)/i);
  return priceMatch ? parseInt(priceMatch[1]) : undefined;
}

// 🔧 TEMPORÄRER DEBUG-Endpunkt (kann später entfernt werden)
chatRouter.get('/debug-ollama', async (req: Request, res: Response) => {
  try {
    const apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    console.log(`🔍 Teste Ollama-Verbindung zu: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API nicht erreichbar: ${response.status}`);
    }
    
    const data = await response.json();
    const models = data.models?.map((m: any) => ({
      name: m.name,
      size: m.size,
      modified: m.modified_at
    })) || [];
    
    console.log(`📋 Verfügbare Modelle:`, models);
    
    res.json({
      success: true,
      apiUrl,
      models,
      totalModels: models.length
    });
  } catch (error) {
    console.error('❌ Ollama-Debug-Test fehlgeschlagen:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// ✨ NEUE ERWEITERTE SPIELSUCHE mit ML-Algorithmen
const enhancedGameSearch = async (query: string, userContext: any) => {
  const searchResults = [];
  
  // 1. Semantic Vector Search (Priorität 1)
  const vectorResults = await chromaService.querySimilar(query, 10);
  if (vectorResults.length > 0) {
    const vectorGames = await Spiel.find({ _id: { $in: vectorResults } });
    searchResults.push(...vectorGames.map(game => ({
      ...game.toObject(),
      score: calculateRelevanceScore(game, query, 'vector'),
      source: 'semantic_search'
    })));
  }
  
  // 2. Fuzzy Text Matching (Priorität 2)
  const fuzzyResults = await Spiel.aggregate([
    {
      $search: {
        text: {
          query: query,
          path: ['name', 'description', 'tags'],
          fuzzy: { maxEdits: 2, prefixLength: 1 }
        }
      }
    },
    { $limit: 5 }
  ]);
  
  // 3. Genre-basierte Suche mit Gewichtung
  const extractedGenres = await extractGenresAdvanced(query);
  if (extractedGenres.length > 0) {
    const genreResults = await Spiel.find({
      'genres.name': { $in: extractedGenres }
    }).limit(5);
    
    searchResults.push(...genreResults.map(game => ({
      ...game.toObject(),
      score: calculateRelevanceScore(game, query, 'genre'),
      source: 'genre_match'
    })));
  }
  
  // 4. Personalisierte Empfehlungen
  if (userContext.userId) {
    const personalizedResults = await getPersonalizedRecommendations(
      userContext.userId, 
      query
    );
    searchResults.push(...personalizedResults);
  }
  
  // 5. Kombiniere und ranke Ergebnisse
  const uniqueResults = deduplicateResults(searchResults);
  const rankedResults = rankResultsByMLScore(uniqueResults, userContext);
  
  return rankedResults.slice(0, 3);
};

// ✨ MACHINE LEARNING SCORING
const calculateRelevanceScore = (game: any, query: string, source: string) => {
  let score = 0;
  
  // Basis-Score nach Quelle
  const sourceWeights = {
    'vector': 1.0,
    'fuzzy': 0.8,
    'genre': 0.6,
    'personalized': 1.2
  } as const;
  
  score = sourceWeights[source as keyof typeof sourceWeights] || 0.5;
  
  // Qualitäts-Boost
  score *= (game.rating / 10) * 0.5 + 0.5;
  
  // Verfügbarkeits-Boost
  if (game.availability > 0) score *= 1.2;
  
  // Preis-Wert-Verhältnis
  const valueScore = Math.max(0, (10 - game.price / 10)) / 10;
  score *= (valueScore * 0.3 + 0.7);
  
  return score;
};

// ✨ ERWEITERTE GENRE-EXTRAKTION mit NLP
const extractGenresAdvanced = async (query: string) => {
  const genres = [];
  const normalizedQuery = query.toLowerCase();
  
  // Direkte Genre-Matches
  const directGenres = await Genre.find({
    $or: [
      { name: { $regex: normalizedQuery, $options: 'i' } },
      { germanName: { $regex: normalizedQuery, $options: 'i' } },
      { aliases: { $elemMatch: { $regex: normalizedQuery, $options: 'i' } } }
    ]
  });
  
  genres.push(...directGenres.map(g => g.name));
  
  // Semantische Genre-Erkennung
  const semanticMappings = {
    'kämpfen|fight|combat|battle': ['Action', 'Fighting'],
    'magie|magic|fantasy|wizard': ['RPG', 'Fantasy'],
    'bauen|build|construct|create': ['Simulation', 'Strategy'],
    'rennen|racing|speed|car': ['Racing', 'Sports'],
    'rätsel|puzzle|brain|logic': ['Puzzle'],
    'horror|scary|fear|zombie': ['Horror'],
    'sport|football|soccer|tennis': ['Sports']
  };
  
  for (const [pattern, genreList] of Object.entries(semanticMappings)) {
    if (new RegExp(pattern, 'i').test(normalizedQuery)) {
      genres.push(...genreList);
    }
  }
  
  return [...new Set(genres)];
};

// Fehlende Funktionen hinzufügen (nach extractGenresAdvanced)
const getPersonalizedRecommendations = async (userId: string, query: string) => {
  // Einfache Implementierung - kann später erweitert werden
  const userGames = await Spiel.find({ rating: { $gte: 7 } })
    .limit(2)
    .lean();
  
  return userGames.map(game => ({
    ...game,
    score: 0.9,
    source: 'personalized'
  }));
};

const deduplicateResults = (results: any[]) => {
  const unique = new Map();
  results.forEach(result => {
    const key = result._id?.toString() || result.name;
    if (!unique.has(key) || unique.get(key).score < result.score) {
      unique.set(key, result);
    }
  });
  return Array.from(unique.values());
};

const rankResultsByMLScore = (results: any[], userContext: any) => {
  return results.sort((a, b) => (b.score || 0) - (a.score || 0));
};

export { chatRouter };
