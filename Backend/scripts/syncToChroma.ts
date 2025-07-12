import 'dotenv/config';
import mongoose from 'mongoose';
import { Spiel } from '../src/model/SpielModel';
import chromaService from '../src/service/ChromaService';
import process from 'process';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB verbunden...');
    
    const spiele = await Spiel.find().lean();
    console.log(`Gefunden: ${spiele.length} Spiele`);
    
    if (spiele.length > 0) {
      await chromaService.upsertGames(spiele);
      console.log(`✅ ${spiele.length} Spiele zu Chroma synchronisiert`);
    } else {
      console.log('❌ Keine Spiele gefunden - importiere zuerst Spiele!');
    }
  } catch (error) {
    console.error('Fehler:', error);
  } finally {
    process.exit(0);
  }
})();