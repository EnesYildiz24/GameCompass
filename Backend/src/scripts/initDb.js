const mongoose = require('mongoose');
require('dotenv').config();

const initPrompts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const ChatPrompt = mongoose.model('ChatPrompt', new mongoose.Schema({
      type: String,
      question: String,
      nextPrompt: String,
      responseType: String
    }));

    const prompts = [
      {
        type: 'initial',
        question: 'Hallo! Ich bin dein Gaming-Berater. Erzähl mir von deinen Spielevorlieben!',
        responseType: 'simple',
        nextPrompt: 'genre'
      },
      {
        type: 'genre',
        question: 'Welche Spielgenres magst du besonders? (z.B. Action, RPG, Strategy)',
        responseType: 'genre',
        nextPrompt: 'final'
      },
      {
        type: 'final',
        question: 'Danke für deine Antworten! Ich hoffe, die Empfehlungen gefallen dir.',
        responseType: 'final'
      }
    ];

    await ChatPrompt.deleteMany({}); // Löscht existierende Prompts
    await ChatPrompt.insertMany(prompts);
    console.log('Chat-Prompts erfolgreich initialisiert!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Fehler beim Initialisieren der Prompts:', error);
    process.exit(1);
  }
};

initPrompts(); 