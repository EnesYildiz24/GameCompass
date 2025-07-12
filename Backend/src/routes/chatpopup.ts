import { Router, Request, Response, RequestHandler } from 'express';
import { ChatPrompt } from '../model/ChatPromptModel';
import { ChatHistory } from '../model/ChatHistoryModel';
import { Spiel } from '../model/SpielModel';
import { logger } from '../logger';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionData } from 'express-session';
import chromaService from '../service/ChromaService';
import { Genre } from '../model/GenreModel';

interface CustomRequest extends Request {
  session: Session & Partial<SessionData> & {
    userId?: string;
  };
}

interface GameRecommendation {
  name: string;
  description: string;
  background_image: string;
  rating: number;
  genres: { id: number; name: string }[];
  price: number;
}

const chatPopupRouter = Router();

// Initialer Prompt Setup
const setupInitialPrompt = async () => {
  try {
    // Prüfe ob bereits existiert
    const existingPrompt = await ChatPrompt.findOne({ type: 'initial' });
    if (!existingPrompt) {
      await ChatPrompt.create({
        type: 'initial',
        question: 'Hallo! Ich bin dein Gaming-Berater. Erzähl mir von deinen Spielevorlieben!',
        responseType: 'simple',
        nextPrompt: 'genre'
      });
      logger.info('Initialer ChatPrompt erstellt');
    }
  } catch (error) {
    logger.error('Fehler beim Erstellen des initialen Prompts:', error);
  }
};

// Führe Setup beim Start aus
setupInitialPrompt();

// Route für initialen Prompt
chatPopupRouter.get('/prompt/initial', (async (_req: Request, res: Response) => {
  try {
    const initialPrompt = await ChatPrompt.findOne({ type: 'initial' });
    if (!initialPrompt) {
      return res.status(404).json({ error: 'Initialer Prompt nicht gefunden' });
    }
    res.json(initialPrompt);
  } catch (error) {
    logger.error('Fehler beim Laden des initialen Prompts:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
}) as RequestHandler);

// Hauptroute für Chat-Interaktionen
chatPopupRouter.post('/interact', (async (req: CustomRequest, res: Response) => {
  try {
    const { message, currentPrompt, sessionId: clientSessionId } = req.body;
    const userId = req.session?.userId;
    
    // 🔥 OLLAMA KONFIGURATION aus .env
    const OLLAMA_API_URL = `${process.env.OLLAMA_HOST}/api/generate` || 'http://localhost:11434/api/generate';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:latest';
    
    const sessionId = clientSessionId || uuidv4();
    let chatHistory = await ChatHistory.findOne({ sessionId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: userId || null,
        sessionId,
        messages: []
      });
    }
    
    chatHistory.messages.push({ 
      role: 'user', 
      content: message,
      timestamp: new Date()
    });

    // Konversationsverlauf für Ollama aufbereiten
    const conversationHistory = chatHistory.messages
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    let gameRecommendations: GameRecommendation[] = [];
    
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
    
    // 🔥 NEUE CASUAL CONVERSATION ERKENNUNG
    const isCasualTalk = casualConversation?.keywords?.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    ) || false;

    // Spezielle Behandlung für verschiedene Nachrichtentypen
    if (isGreeting) {
      res.json({
        aiResponse: "Hallo! 🎮 Erzähl mir von deinen Spielevorlieben! Welches Genre, Budget oder Plattform? 💰",
        games: undefined,
        nextPrompt: currentPrompt?.nextPrompt ? 
          await ChatPrompt.findOne({ type: currentPrompt.nextPrompt }) : null,
        sessionId
      });
      return;
    }
    
    // 🔥 NEUE CASUAL CONVERSATION BEHANDLUNG
    if (isCasualTalk && !isGameRelated) {
      console.log('💬 Casual Conversation erkannt, leite zu Gaming über:', message);
      
      // Nutze Ollama für natürliche Antwort mit Gaming-Überleitung
      const casualPrompt = `Du bist ein freundlicher Gaming-Berater. 
      
Antwortregeln:
${casualConversation?.rules?.join('\n') || ''}

Beispiele:
${casualConversation?.examples?.map(ex => `User: "${ex.user}"\nAssistant: "${ex.assistant}"`).join('\n\n') || ''}

User: ${message}
Assistant:`;

      const ollamaResponse = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: casualPrompt,
          stream: false
        })
      });

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json();
        
        // Zur Historie hinzufügen
        chatHistory.messages.push({
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        });
        await chatHistory.save();

        res.json({
          aiResponse: data.response,
          games: undefined,
          nextPrompt: null,
          sessionId
        });
        return;
      }
    }

    // Nur bei echten Spielanfragen Vektor-Suche starten
    if (isGameRelated && !isPolite) {
      console.log('🎯 Starte Vektor-Suche für Spielanfrage:', enhancedQuery);
      
      // 1. IMMER zuerst Vektor-Suche mit erweiterter Query
      const maxPrice = extractPrice(message);
      const similarIds = await chromaService.querySimilar(enhancedQuery, 5, maxPrice);
      
      if (similarIds.length > 0) {
        const vektorSpiele = await Spiel.find({ _id: { $in: similarIds } })
          .select('name description background_image rating genres price')
          .lean();

        gameRecommendations = similarIds
          .map(id => vektorSpiele.find(s => s._id.toString() === id))
          .filter(Boolean) as GameRecommendation[];
          
        console.log('✅ Vektor-Suche Treffer:', gameRecommendations.map(g => g.name));
      }
      
      // 2. Nur als Ergänzung: Genre-Suche für mehr Vielfalt
      if (gameRecommendations.length < 3) {
        const genres = await extractGenres(message);
        if (genres.length > 0) {
          const genreSpiele = await Spiel.find({
            'genres.name': { $in: genres },
            _id: { $nin: similarIds }
          })
          .sort({ rating: -1 })
          .limit(2)
          .select('name description background_image rating genres price')
          .lean();
          
          gameRecommendations = [...gameRecommendations, ...genreSpiele];
          console.log('✅ Ergänzt durch Genre-Suche:', genreSpiele.map(g => g.name));
        }
      }
    } else if (isPolite) {
      console.log('💬 Höfliche Phrase erkannt, keine Spielsuche:', message);
    }

    // Ollama Prompt mit Vektor-Fokus
    const ollamaPrompt = async () => {
      const rules = await ChatPrompt.findOne({ type: 'rules' });
      const vectorRules = await ChatPrompt.findOne({ type: 'vector_search' });
      
      if (!rules) throw new Error('Keine Regeln gefunden');

      return `Du bist ein Gaming-Verkaufsberater mit Vektor-Suche-Power! 🎮🔍

WICHTIGE REGELN:
${rules.rules.join('\n')}

VEKTOR-SUCHE REGELN:
${vectorRules?.rules.join('\n') || 'Nutze Vektor-Suche für alle Anfragen'}

Beispiele für perfekte Antworten:
${rules.examples.map(ex => `User: "${ex.user}"\nAssistant: "${ex.assistant}"`).join('\n\n')}

Bisheriger Chat:
${conversationHistory}

${gameRecommendations.length > 0 ? 
  `🎯 GEFUNDENE SPIELE (durch Vektor-Suche): ${gameRecommendations.map(g => `${g.name} (${g.price}€)`).join(', ')}` : 
  '❌ Keine Spiele gefunden - frage nach spezifischeren Wünschen'}

Antworte kurz, enthusiastisch und verkaufsorientiert! 🚀`;
    };

    // Ollama-Anfrage
    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: await ollamaPrompt(),
        stream: false
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error('Ollama API-Anfrage fehlgeschlagen');
    }

    const data = await ollamaResponse.json();

    // Ollama-Antwort zur Historie hinzufügen
    chatHistory.messages.push({
      role: 'assistant',
      content: data.response,
      timestamp: new Date()
    });

    // Historie speichern
    await chatHistory.save();

    // Antwort mit Spielempfehlungen
    res.json({
      aiResponse: data.response,
      games: gameRecommendations.length > 0 ? gameRecommendations : undefined,
      nextPrompt: currentPrompt?.nextPrompt ? 
        await ChatPrompt.findOne({ type: currentPrompt.nextPrompt }) : null,
      sessionId
    });

  } catch (error) {
    logger.error('Fehler bei der Chat-Verarbeitung:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
}) as RequestHandler);

async function extractGenres(message: string): Promise<string[]> {
  const allGenres = await Genre.find();
  const normalizedMessage = message.toLowerCase();
  
  const foundGenres: string[] = [];
  
  for (const genre of allGenres) {
    // Prüfe Name, germanName und aliases
    const searchTerms = [
      genre.name.toLowerCase(),
      ...(genre.germanName ? [genre.germanName.toLowerCase()] : []),
      ...genre.aliases
    ];
    
    if (searchTerms.some(term => normalizedMessage.includes(term))) {
      foundGenres.push(genre.name);
    }
  }
  
  return [...new Set(foundGenres)]; // Duplikate entfernen
}

function extractPrice(message: string): number | undefined {
  const priceMatch = message.match(/(\d+)\s*(dollar|euro|€|\$)/i);
  return priceMatch ? parseInt(priceMatch[1]) : undefined;
}

export { chatPopupRouter }; 