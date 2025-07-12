// KI-Service Interface und Abstraktion
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'developer';
  content: string;
}

export interface AIResponse {
  content: string;
  model?: string;
  provider?: string;
  usage?: {
    tokens?: number;
    cost?: number;
  };
}

export interface AIProviderConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

// Basis-Interface für alle KI-Provider
export abstract class AIProvider {
  protected config: AIProviderConfig;
  protected name: string;

  constructor(config: AIProviderConfig, name: string) {
    this.config = config;
    this.name = name;
  }

  abstract generateResponse(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<AIResponse>;

  abstract isAvailable(): Promise<boolean>;

  getName(): string {
    return this.name;
  }

  getModel(): string {
    return this.config.model;
  }
}

// Ollama Provider Implementation
export class OllamaProvider extends AIProvider {
  private apiUrl: string;

  constructor(config: AIProviderConfig & { apiUrl: string }) {
    super(config, config.model); // Verwende Modellname als Provider-Name
    this.apiUrl = config.apiUrl;
  }

  async generateResponse(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    try {
      // Formatiere Messages für Ollama
      const conversationHistory = messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      // ✨ ULTRA-AGGRESSIVE System-Anweisung für MAXIMALE Kürze
      const finalPrompt = systemPrompt 
        ? `${systemPrompt}\n\nSTRENGSTE REGEL: NUR 1 KURZER SATZ! KEINE ERKLÄRUNGEN! KEINE FRAGEN!\n\n${conversationHistory}`
        : conversationHistory;

      const response = await fetch(`${this.apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt: finalPrompt,
          stream: false,
          options: {
            temperature: 0.3, // Niedrigere Temperatur für präzisere Antworten
            top_p: 0.8,
            // ✨ ULTRA-AGGRESSIVE Begrenzungen
            num_predict: 50, // Maximal 50 Tokens
            stop: ['\n', '.', '!', '?', 'Außerdem', 'Zusätzlich', 'Darüber hinaus', 'Wenn', 'Falls', 'Du kannst'], // Stoppt früh
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API-Fehler: ${response.status}`);
      }

      const data = await response.json();

      // ✨ BEREINIGTE NACHBEARBEITUNG ohne Debug-Logs
      let content = data.response.trim();
      
      // Schneide bei erstem Satzende ab
      const sentenceEnd = content.search(/[.!?]/);
      if (sentenceEnd !== -1) {
        content = content.substring(0, sentenceEnd + 1);
      }
      
      // Entferne Fragen und Erklärungen
      content = content
        .replace(/\?.*$/g, '.')
        .replace(/Wenn du.*$/gi, '')
        .replace(/Falls du.*$/gi, '')
        .replace(/Du kannst.*$/gi, '')
        .replace(/Möchtest du.*$/gi, '')
        .replace(/Brauchst du.*$/gi, '')
        .trim();

      // Falls immer noch zu lang, schneide bei 100 Zeichen ab
      if (content.length > 100) {
        content = content.substring(0, 100) + '.';
      }

      return {
        content: content,
        model: this.config.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('Ollama Provider Fehler:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      console.log(`🔍 Prüfe Verfügbarkeit von ${this.config.model}...`);
      const response = await fetch(`${this.apiUrl}/api/tags`);
      if (!response.ok) {
        console.log(`❌ Ollama API nicht erreichbar: ${response.status}`);
        return false;
      }
      
      const data = await response.json();
      const availableModels = data.models?.map((m: any) => m.name) || [];
      console.log(`📋 Verfügbare Ollama-Modelle:`, availableModels);
      
      // Prüfe, ob das spezifische Modell verfügbar ist
      const found = availableModels.includes(this.config.model);
      
      console.log(`🎯 Modell ${this.config.model} verfügbar: ${found}`);
      return found;
    } catch (error) {
      console.error(`❌ Ollama-Verfügbarkeitsprüfung fehlgeschlagen:`, error);
      return false;
    }
  }
}

// OpenAI Provider Implementation (über GitHub)
export class OpenAIProvider extends AIProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(config: AIProviderConfig & { apiKey: string; baseURL: string }) {
    super(config, 'OpenAI');
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
  }

  async generateResponse(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    try {
      const { default: OpenAI } = await import('openai');
      
      const client = new OpenAI({
        baseURL: this.baseURL,
        apiKey: this.apiKey,
      });

      const chatMessages = [...messages];
      if (systemPrompt) {
        chatMessages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await client.chat.completions.create({
        messages: chatMessages,
        model: this.config.model,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 2048,
        top_p: this.config.topP || 0.9,
      });

      return {
        content: response.choices[0].message.content || '',
        model: this.config.model,
        provider: this.name,
        usage: {
          tokens: response.usage?.total_tokens,
        },
      };
    } catch (error) {
      console.error('OpenAI Provider Fehler:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    // Vereinfachter Check - nur Token und Basis-Setup prüfen
    return !!(this.apiKey && this.baseURL);
  }
}

// Factory für Provider-Erstellung
export class AIProviderFactory {
  static createProvider(providerName: string): AIProvider {
    const apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    const providers = {
      'llama3': () => new OllamaProvider({
        model: 'llama3.1:latest',
        apiUrl,
        temperature: 0.7,
        maxTokens: 2048,
      }),
      
      'deepseek': () => new OllamaProvider({
        model: 'deepseek-r1:latest',
        apiUrl,
        temperature: 0.7,
        maxTokens: 2048,
      }),
      
      'gemma3': () => new OllamaProvider({
        model: 'gemma3:latest',
        apiUrl,
        temperature: 0.7,
        maxTokens: 2048,
      }),
    };

    const createProvider = providers[providerName.toLowerCase() as keyof typeof providers];
    if (!createProvider) {
      throw new Error(`Unbekannter KI-Provider: ${providerName}. Verfügbare Provider: ${Object.keys(providers).join(', ')}`);
    }

    return createProvider();
  }

  static async getAvailableProviders(): Promise<string[]> {
    const providerNames = ['llama3', 'deepseek', 'gemma3'];
    const availableProviders: string[] = [];

    console.log('🔍 Prüfe verfügbare KI-Provider...');

    for (const name of providerNames) {
      try {
        const provider = this.createProvider(name);
        const isAvailable = await provider.isAvailable();
        if (isAvailable) {
          availableProviders.push(name);
          console.log(`✅ Provider ${name} (${provider.getModel()}) verfügbar`);
        } else {
          console.log(`❌ Provider ${name} (${provider.getModel()}) nicht verfügbar`);
        }
      } catch (error) {
        console.log(`❌ Provider ${name} Fehler:`, (error as Error).message);
      }
    }

    console.log(`📋 Verfügbare Provider: [${availableProviders.join(', ')}]`);
    return availableProviders;
  }
} 