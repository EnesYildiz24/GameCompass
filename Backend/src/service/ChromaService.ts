import { ChromaClient } from 'chromadb';
import { ISpiel } from '../model/SpielModel';

class ChromaService {
  private client?: ChromaClient;
  private collectionPromise?: ReturnType<ChromaClient['getOrCreateCollection']>;

  constructor() {
    /*  ⬇️ Nur wenn CHROMA_URL definiert ist  */
    const chromaUrl = process.env.CHROMA_URL;
    if (!chromaUrl) {
      console.log('ℹ️  CHROMA_URL not set – skipping ChromaDB init');
      return;                                // alles überspringen
    }

    this.client = new ChromaClient({ path: chromaUrl });
    this.collectionPromise = this.client.getOrCreateCollection({ name: 'spiele' });
  }
  /** Games in den Vektor-Store upserten */
  async upsertGames(games: ISpiel[]): Promise<void> {
    const collection = await this.collectionPromise;
    if (!collection) {
      throw new Error('Collection is not initialized. Ensure CHROMA_URL is set.');
    }
    await collection.upsert({
      ids: games.map(g => g._id!.toString()),
      documents: games.map(g => `
        Titel: ${g.name}. 
        Genre-Tags: ${g.genres.map(genre => genre.name).join(', ')}. 
        Genre-Tags: ${g.genres.map(genre => genre.name).join(', ')}. 
        Beschreibung: ${g.description}. 
        Preis: ${g.price} Euro. 
        Developer: ${g.developer}. 
        Plattformen: ${g.platforms.join(', ')}.
      `), // Doppelte Genre-Tags für stärkere Gewichtung
      metadatas: games.map(g => ({
        price: g.price,
        rating: g.rating,
        genres: g.genres.map(gn => gn.name).join(', '),
        genreList: g.genres.map(gn => gn.name).join('|'), // Konvertiere Array zu String mit | als Trenner
        developer: g.developer || '',
        platforms: g.platforms.join(', ')
      }) as Record<string, string | number | boolean>),
    });
  }

  /** Ähnliche Spiele mit verbesserter Semantik */
  async querySimilar(text: string, nResults = 3, maxPrice?: number): Promise<string[]> {
    const collection = await this.collectionPromise;
    
    // 🔥 TIPPFEHLER-KORREKTUR UND SYNONYME
    let correctedText = text.toLowerCase()
      .replace(/maripo/g, 'mario')
      .replace(/schwiumm/g, 'schwimmen swimming water')
      .replace(/puzzel/g, 'puzzle')
      .replace(/räzel/g, 'rätsel puzzle')
      .replace(/kämpfen/g, 'fighting combat action')
      .replace(/bauen/g, 'building construction sandbox')
      .replace(/fahren/g, 'driving racing cars')
      .replace(/fliegen/g, 'flying flight pilot')
      .replace(/kochen/g, 'cooking chef restaurant')
      .replace(/angeln/g, 'fishing')
      .replace(/boxen/g, 'boxing fighting')
      .replace(/golf/g, 'golf sports')
      .replace(/tennis/g, 'tennis sports')
      .replace(/basketball/g, 'basketball sports')
      .replace(/schwimmen/g, 'swimming water diving underwater')
      .replace(/musik/g, 'music rhythm guitar piano')
      .replace(/tanzen/g, 'dancing rhythm music');
    
    // Verstärke spezifische Spielnamen und Genre-Relevanz
    const enhancedQuery = `
      ${correctedText}
      ${text.includes('mario') ? 'super mario nintendo platformer jump run mushroom' : ''}
      ${text.includes('zelda') ? 'legend of zelda nintendo adventure hyrule link' : ''}
      ${text.includes('pokemon') ? 'pokemon nintendo rpg monster catch trainer' : ''}
      ${text.includes('minecraft') ? 'minecraft sandbox building survival crafting' : ''}
      ${text.includes('sonic') ? 'sonic sega speed rings platform hedgehog' : ''}
      ${text.includes('schwimm') || text.includes('swimming') ? 'water swimming diving underwater ocean sea pool' : ''}
      ${text.includes('action') ? 'action combat fighting shooter adventure' : ''}
      ${text.includes('puzzle') ? 'puzzle logic brain thinking strategy' : ''}
      Preis: ${maxPrice ? `unter ${maxPrice}` : ''} Euro
    `.trim();
    
    console.log('🔍 Original:', text);
    console.log('🔧 Korrigiert:', correctedText);
    console.log('🚀 Erweitert:', enhancedQuery);
    
    const queryParams: any = { 
      queryTexts: [enhancedQuery],
      nResults: nResults * 4  // Noch mehr Ergebnisse für besseres Filtering
    };
    
    if (maxPrice) {
      queryParams.where = { 
        price: { $lte: maxPrice }
      };
    }
    
    if (!collection) {
      throw new Error('Collection is not initialized. Ensure CHROMA_URL is set.');
    }
    const res = await collection.query(queryParams);
    
    // Erweitertes Logging
    console.log('🔍 Suchanfrage:', text);
    console.log('💰 Max Preis:', maxPrice);
    console.log('📊 Gefundene Ähnlichkeiten:', res.distances?.[0]);
    console.log('🎯 Spiel-IDs:', res.ids?.[0]);
    
    const ids = res.ids?.[0] as string[] ?? [];
    const distances = res.distances?.[0] as number[] ?? [];
    const metadatas = res.metadatas?.[0] as any[] ?? [];
    
    // Kombiniere und filtere Ergebnisse
    const results = ids
      .map((id, index) => ({
        id,
        distance: distances[index],
        metadata: metadatas[index]
      }))
      .filter(result => !maxPrice || result.metadata.price <= maxPrice);
    
    // 🔥 VERBESSERTE SORTIERUNG mit spezifischen Matches
    results.sort((a, b) => {
      // Spezifische Spielnamen haben höchste Priorität
      const aSpecificMatch = 
        (text.includes('mario') && a.metadata.genres.toLowerCase().includes('platform')) ||
        (text.includes('zelda') && a.metadata.genres.toLowerCase().includes('adventure')) ||
        (text.includes('pokemon') && a.metadata.genres.toLowerCase().includes('rpg')) ||
        (text.includes('schwimm') && (
          a.metadata.genres.toLowerCase().includes('sport') ||
          a.metadata.genres.toLowerCase().includes('simulation')
        ));
      
      const bSpecificMatch = 
        (text.includes('mario') && b.metadata.genres.toLowerCase().includes('platform')) ||
        (text.includes('zelda') && b.metadata.genres.toLowerCase().includes('adventure')) ||
        (text.includes('pokemon') && b.metadata.genres.toLowerCase().includes('rpg')) ||
        (text.includes('schwimm') && (
          b.metadata.genres.toLowerCase().includes('sport') ||
          b.metadata.genres.toLowerCase().includes('simulation')
        ));
      
      if (aSpecificMatch && !bSpecificMatch) return -1;
      if (!aSpecificMatch && bSpecificMatch) return 1;
      
      // Genre-Übereinstimmung
      const aGenreMatch = a.metadata.genres.toLowerCase().includes(correctedText);
      const bGenreMatch = b.metadata.genres.toLowerCase().includes(correctedText);
      
      if (aGenreMatch && !bGenreMatch) return -1;
      if (!aGenreMatch && bGenreMatch) return 1;
      
      return a.distance - b.distance;
    });
    
    // Erweitertes Debug-Logging
    results.forEach((result, index) => {
      console.log(`\n🎮 Spiel ${index + 1}:`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Genres: ${result.metadata.genres}`);
      console.log(`   Ähnlichkeit: ${result.distance}`);
      console.log(`   Preis: ${result.metadata.price}€`);
      console.log(`   Rating: ${result.metadata.rating}`);
    });
    
    return results.slice(0, nResults).map(r => r.id);
  }
}

export default new ChromaService(); 