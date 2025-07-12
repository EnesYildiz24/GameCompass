import { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ElevenLabsClient } from 'elevenlabs';
import { Voice as ElevenLabsVoice } from 'elevenlabs/api/types/Voice';

// ✨ NEUE Interface für Spielempfehlungen
interface Game {
  _id: string;
  name: string;
  description?: string;
  background_image?: string;
  rating: number;
  genres?: { name: string }[];
  price?: number;
  developer?: string;
  platforms?: string[];
}

// Minimalistisches Design für den Sprachassistenten
const AudioChatContainer = styled.div`
  z-index: 1000;
  position: relative;
`;

// ✨ NEUES Popup für Spielempfehlungen
const GamePopup = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${props => props.isVisible ? 1 : 0.8});
  width: 90vw;
  max-width: 800px;
  max-height: 80vh;
  background: linear-gradient(135deg, #1e1f23 0%, #2a2d32 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(241, 145, 21, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(241, 145, 21, 0.1) 0%, transparent 50%);
    z-index: -1;
  }
`;

const GamePopupOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1999;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  backdrop-filter: blur(5px);
`;

const GamePopupHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid rgba(241, 145, 21, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(241, 145, 21, 0.1) 0%, transparent 100%);
`;

const GamePopupTitle = styled.h2`
  margin: 0;
  color: #f19115;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '🎮';
    font-size: 28px;
    animation: bounce 2s infinite;
  }
`;

const CloseButton = styled.button`
  background: rgba(241, 145, 21, 0.2);
  border: 1px solid rgba(241, 145, 21, 0.4);
  color: #f19115;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background: rgba(241, 145, 21, 0.3);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(241, 145, 21, 0.5);
  }
`;

const GameGrid = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  max-height: 60vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #f19115;
    border-radius: 4px;
  }
`;

const GameCard = styled.div`
  background: linear-gradient(135deg, #2a2d32 0%, #34353b 100%);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(241, 145, 21, 0.3);
    border-color: rgba(241, 145, 21, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f19115, #e08010);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${GameCard}:hover & {
    transform: scale(1.05);
  }
`;

const GameContent = styled.div`
  padding: 20px;
`;

const GameTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const GameRating = styled.span`
  color: #f19115;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '⭐';
  }
`;

const GamePrice = styled.span`
  color: #4caf50;
  font-weight: 600;
  font-size: 16px;
`;

const GameGenres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const GenreTag = styled.span`
  background: rgba(241, 145, 21, 0.2);
  color: #f19115;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid rgba(241, 145, 21, 0.3);
`;

// Bestehende AudioButton und andere Styles bleiben gleich...
const AudioButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ff9d2f, #f18700);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.2),
    inset 0 -2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow:
      0 6px 15px rgba(0, 0, 0, 0.25),
      inset 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  &.recording {
    background: linear-gradient(145deg, #ff5a5a, #ff9d2f);
    animation: pulse 1.5s infinite;

    &:before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      animation: ripple 2s linear infinite;
    }
  }

  svg {
    width: 30px;
    height: 30px;
    color: white;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
  }

  &:active svg {
    transform: scale(0.9);
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.2),
        0 0 0 0 rgba(231, 76, 60, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow:
        0 4px 20px rgba(231, 76, 60, 0.4),
        0 0 20px 10px rgba(231, 76, 60, 0.1);
    }
    100% {
      transform: scale(1);
      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.2),
        0 0 0 0 rgba(231, 76, 60, 0.5);
    }
  }

  @keyframes ripple {
    0% {
      transform: rotate(0deg);
      opacity: 0.5;
    }
    100% {
      transform: rotate(360deg);
      opacity: 0.2;
    }
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s,
    transform 0.3s;
  white-space: nowrap;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ✨ NEUER Pfeil für bessere UX */
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(0, 0, 0, 0.7);
  }
`;

// Orbit Animation für Recording State
const OrbitAnimation = styled.div`
  --uib-size: 35px;
  --uib-color: white;
  --uib-speed: 2.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: var(--uib-size);
  width: var(--uib-size);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;

  .slice {
    position: relative;
    height: calc(var(--uib-size) / 6);
    width: 100%;
  }

  .slice::before,
  .slice::after {
    --uib-a: calc(var(--uib-speed) / -2);
    --uib-b: calc(var(--uib-speed) / -6);
    content: '';
    position: absolute;
    top: 0;
    left: calc(50% - var(--uib-size) / 12);
    height: 100%;
    width: calc(100% / 6);
    border-radius: 50%;
    background-color: var(--uib-color);
    flex-shrink: 0;
    animation: orbit var(--uib-speed) linear infinite;
    transition: background-color 0.3s ease;
  }

  .slice:nth-child(1)::after {
    animation-delay: var(--uib-a);
  }

  .slice:nth-child(2)::before {
    animation-delay: var(--uib-b);
  }

  .slice:nth-child(2)::after {
    animation-delay: calc(var(--uib-a) + var(--uib-b));
  }

  .slice:nth-child(3)::before {
    animation-delay: calc(var(--uib-b) * 2);
  }
  .slice:nth-child(3)::after {
    animation-delay: calc(var(--uib-a) + var(--uib-b) * 2);
  }

  .slice:nth-child(4)::before {
    animation-delay: calc(var(--uib-b) * 3);
  }
  .slice:nth-child(4)::after {
    animation-delay: calc(var(--uib-a) + var(--uib-b) * 3);
  }

  .slice:nth-child(5)::before {
    animation-delay: calc(var(--uib-b) * 4);
  }
  .slice:nth-child(5)::after {
    animation-delay: calc(var(--uib-a) + var(--uib-b) * 4);
  }

  .slice:nth-child(6)::before {
    animation-delay: calc(var(--uib-b) * 5);
  }
  .slice:nth-child(6)::after {
    animation-delay: calc(var(--uib-a) + var(--uib-b) * 5);
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
  
  @keyframes orbit {
    0% { transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684); opacity: 0.65; }
    25% { transform: translateX(0%) scale(0.47368); opacity: 0.3; }
    50% { transform: translateX(calc(var(--uib-size) * -0.25)) scale(0.73684); opacity: 0.65; }
    75% { transform: translateX(0%) scale(1); opacity: 1; }
    100% { transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684); opacity: 0.65; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
    100% { transform: translateY(0px); }
  }
`;

// Neue Styled Components für Voice Toggle
const AudioControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 30px;
    z-index: -1;
    backdrop-filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const VoiceToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isFemale',
})<{ isFemale: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) =>
    props.isFemale
      ? 'linear-gradient(145deg, #f093fb, #e83e8c)'
      : 'linear-gradient(145deg, #6ec3f4, #007bff)'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  }

  .icon-container {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
    animation: float 3s ease-in-out infinite;

    svg {
      width: 28px;
      height: 28px;
      color: white;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }
  }
`;

// Stimmen-IDs für ElevenLabs
const VOICE_ALICE = '21m00Tcm4TlvDq8ikWAM'; // Weibliche Stimme (Rachel/Alice)
const VOICE_BRIAN = '29vD33N1CtxCmqQRPOHJ'; // Männliche Stimme (Josh/Brian)

// Deklaration für TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function AudioChat() {
  const { t, i18n } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [volume] = useState(1);
  const [, setVoices] = useState<ElevenLabsVoice[]>([]);
  
  // ✨ KORRIGIERTE PERSISTENTE Stimmen-Auswahl
  const [selectedVoice, setSelectedVoice] = useState(() => {
    const saved = localStorage.getItem('audioChat_selectedVoice');
    console.log('🔄 Lade gespeicherte Stimme:', saved);
    return saved || VOICE_ALICE;
  });
  
  const [isFemaleVoice, setIsFemaleVoice] = useState(() => {
    const saved = localStorage.getItem('audioChat_selectedVoice');
    const isFemale = !saved || saved === VOICE_ALICE;
    console.log('🔄 Stimmen-Geschlecht:', isFemale ? 'weiblich' : 'männlich');
    return isFemale;
  });
  
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  // ✨ SPIELEMPFEHLUNGEN STATES
  const [gameRecommendations, setGameRecommendations] = useState<Game[]>([]);
  const [showGamePopup, setShowGamePopup] = useState(false);
  
  // ✨ ALLE REFS HINZUFÜGEN
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversationActiveRef = useRef(false);
  const recordingRef = useRef(false);
  const loadingRef = useRef(false);

  // ✨ ElevenLabs Client als Ref - NUR EINMAL erstellen
  const elevenLabsClientRef = useRef<ElevenLabsClient | null>(null);
  
  // ✨ Client initialisieren
  useEffect(() => {
    if (!elevenLabsClientRef.current) {
      elevenLabsClientRef.current = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
      });
      console.log('✅ ElevenLabs Client erstellt');
    }
  }, []);

  // ElevenLabs API Key aus der .env-Datei
  const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

  // ✨ AudioContext als Ref statt bei jedem Render neu
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ✨ ALLE FUNKTIONEN ERST NACH DEN REFS DEFINIEREN
  const startRecording = async () => {
    try {
      updateStatus('audioChat.listening');
      console.log('Starte Aufnahme...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setAudioStream(stream);

      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Spracherkennung wird von diesem Browser nicht unterstützt');
        updateStatus('audioChat.error.browserNotSupported');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // ✨ WICHTIG: Recognition in Ref speichern für sauberes Cleanup
      const recognitionRef = { current: recognition };

      recognition.start();
      setIsRecording(true);
      console.log('Spracherkennung gestartet');

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Erkannter Text:', speechResult);

        // ✨ Cleanup BEFORE processing
        if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        recognitionRef.current = null;

        getBotResponse(speechResult);
      };

      recognition.onerror = (event: any) => {
        console.error('Fehler bei der Spracherkennung:', event.error);
        
        // ✨ Nur bei echten Fehlern reagieren, nicht bei "aborted"
        if (event.error !== 'aborted') {
          if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);

          if (event.error === 'no-speech') {
            updateStatus('audioChat.error.noSpeech');
          } else if (event.error === 'audio-capture') {
            updateStatus('audioChat.error.audioCapture');
          } else if (event.error === 'not-allowed') {
            updateStatus('audioChat.error.notAllowed');
          } else {
            updateStatus('audioChat.error.speechRecognition');
          }
        }
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        console.log('Spracherkennung beendet');
        if (isRecording && recognitionRef.current) {
          if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
        }
        recognitionRef.current = null;
      };

      // ✨ Timeout mit sauberem Stop
      setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          recognitionRef.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Fehler beim Starten der Aufnahme:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        updateStatus('audioChat.error.microphoneAccess');
      } else {
        updateStatus('audioChat.error.microphoneError');
      }
    }
  };

  // ✨ REST DER FUNKTIONEN...
  // Status‑Anzeige aktualisieren mit Übersetzungen
  const updateStatus = (messageKey: string) => {
    const translatedMessage = messageKey.startsWith('audioChat.') ? t(messageKey) : messageKey;

    setStatus(translatedMessage);
    if (translatedMessage) {
      setShowStatus(true);
      if (!translatedMessage.includes('...')) {
        setTimeout(() => setShowStatus(false), 3000);
      }
    } else {
      setShowStatus(false);
    }
  };

  // ... alle anderen Funktionen ...

  // ✨ useEffects GANZ AM ENDE
  useEffect(() => {
    console.log('🔧 AudioChat Environment Check:');
    console.log('API Key:', import.meta.env.VITE_ELEVENLABS_API_KEY ? '✅ Vorhanden' : '❌ Fehlt');
    console.log('API URL:', import.meta.env.VITE_API_SERVER_URL);
    console.log('Browser TTS:', window.speechSynthesis ? '✅' : '❌');
    console.log('Web Audio:', window.AudioContext ? '✅' : '❌');
    console.log('Speech Recognition:', 
      (window.SpeechRecognition || window.webkitSpeechRecognition) ? '✅' : '❌'
    );
  }, []);

  // Stimmen laden
  useEffect(() => {
    const loadVoices = async () => {
      if (!elevenLabsClientRef.current) return;
      
      try {
        const voicesResponse = await elevenLabsClientRef.current.voices.getAll();
        setVoices(voicesResponse.voices);
        console.log('✅ Stimmen geladen:', voicesResponse.voices.length);
      } catch (error) {
        console.error('❌ Fehler beim Laden der Stimmen:', error);
      }
    };
    
    // Warte bis Client bereit ist
    const checkClient = () => {
      if (elevenLabsClientRef.current) {
        loadVoices();
      } else {
        setTimeout(checkClient, 100);
      }
    };
    checkClient();
  }, []);

  // Sync Refs mit State
  useEffect(() => {
    conversationActiveRef.current = isConversationActive;
  }, [isConversationActive]);
  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);
  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  // Audio‑Element Setup
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
    }

    const handleEnded = () => {
      console.log('✅ Audio‑Wiedergabe beendet');
      updateStatus('');
      // ✨ JETZT sollten die Refs funktionieren
      if (conversationActiveRef.current && !recordingRef.current && !loadingRef.current) {
        setTimeout(() => {
          if (conversationActiveRef.current && !recordingRef.current && !loadingRef.current) {
            startRecording();
          }
        }, 400);
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Lautstärke anpassen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* ---------- Audio entsperren bei erstem Klick ---------- */
  const startConversation = async () => {
    if (isConversationActive) return;

    // ✨ AUDIO-UNLOCK - KRITISCH für Browser-Autoplay
    try {
      if (audioRef.current) {
        // Kurzer stummer Ton um Browser zu entsperren
        audioRef.current.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        console.log('🔓 Audio entsperrt für ElevenLabs');
      }
    } catch (e) {
      console.warn('Audio-Unlock fehlgeschlagen:', e);
    }

    setIsConversationActive(true);
    startRecording();
  };

  /* ---------- Text-to-Speech mit korrektem Client ---------- */
  const textToSpeech = async (text: string) => {
    if (!elevenLabsClientRef.current) {
      console.error('❌ ElevenLabs Client nicht bereit');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔊 Starte Text‑to‑Speech mit ElevenLabs...');
      console.log('📝 Text:', text);
      console.log('🎤 Stimme:', selectedVoice);

      const audioResponse = await elevenLabsClientRef.current.textToSpeech.convert(selectedVoice, {
        text,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      });

      const chunks: Uint8Array[] = [];
      for await (const chunk of audioResponse) chunks.push(chunk);
      const totalLength = chunks.reduce((acc, cur) => acc + cur.length, 0);
      const mergedArray = new Uint8Array(totalLength);
      let offset = 0;
      chunks.forEach((chunk) => {
        mergedArray.set(chunk, offset);
        offset += chunk.length;
      });
      
      console.log('🎵 Audio-Blob erstellt:', totalLength, 'bytes');
      
      const audioBlob = new Blob([mergedArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 1.0; // ✨ Maximale Lautstärke
        
        // ✨ ERWEITERTE DEBUGGING
        console.log('🔊 Audio-Element Status:', {
          volume: audioRef.current.volume,
          muted: audioRef.current.muted,
          readyState: audioRef.current.readyState
        });
        
        audioRef.current
          .play()
          .then(() => {
            console.log('✅ ElevenLabs Audio WIRKLICH gestartet!');
            console.log('🔊 Dauer:', audioRef.current?.duration, 'Sekunden');
            updateStatus('audioChat.responding');
          })
          .catch((err) => {
            console.error('❌ Audio-Play Fehler:', err);
            // Fallback zu Browser-TTS
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'de-DE';
              utterance.rate = 0.9;
              utterance.volume = 1.0;
              speechSynthesis.speak(utterance);
              console.log('🔄 Fallback zu Browser-TTS');
            }
          });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ ElevenLabs Fehler:', error);
      setIsLoading(false);
      
      // ✨ FALLBACK zu Browser-TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
        updateStatus('audioChat.responding');
        console.log('🔄 Fallback zu Browser-TTS aktiviert');
      }
    }
  };

  /* ---------- Gespräch starten mit Audio-Entsperrung ---------- */
  const stopConversation = () => {
    if (!isConversationActive) return;
    setIsConversationActive(false);
    stopRecording();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    updateStatus('');
  };

  const stopRecording = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
    if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    updateStatus('');
  };

  /* ---------- Bot‑Antwort holen VEREINFACHT ---------- */
  const getBotResponse = async (userMessage: string) => {
    try {
      updateStatus('audioChat.processing');
      console.log(`Verarbeite Benutzeranfrage: "${userMessage}"`);

      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          language: i18n.language,
          sessionId: crypto.randomUUID(),
        }),
      });

      if (!response.ok) throw new Error('API‑Anfrage fehlgeschlagen');

      const data = await response.json();
      console.log('Antwort von KI erhalten:', data.response);

      // ✨ SPIELEMPFEHLUNGEN HINZUFÜGEN
      if (data.games && data.games.length > 0) {
        console.log('🎮 Spielempfehlungen erhalten:', data.games);
        setGameRecommendations(data.games);
        setShowGamePopup(true);
      }

      await textToSpeech(data.response);
    } catch (error) {
      console.error('Fehler beim Abrufen der Bot‑Antwort:', error);
      updateStatus('audioChat.error.responseGeneration');
      await textToSpeech(t('chatbot.error'));
    }
  };

  /* ---------- Stimme umschalten MIT PERSISTENZ ---------- */
  const toggleVoice = () => {
    const newVoice = isFemaleVoice ? VOICE_BRIAN : VOICE_ALICE;
    const newGender = !isFemaleVoice;
    
    console.log('🎤 Stimmen-Wechsel:', {
      vorher: { voice: selectedVoice, gender: isFemaleVoice ? 'weiblich' : 'männlich' },
      nachher: { voice: newVoice, gender: newGender ? 'weiblich' : 'männlich' }
    });
    
    // ✨ SOFORT speichern UND State setzen
    localStorage.setItem('audioChat_selectedVoice', newVoice);
    setSelectedVoice(newVoice);
    setIsFemaleVoice(newGender);
    
    updateStatus(newGender ? 'audioChat.voiceToggle.female' : 'audioChat.voiceToggle.male');
    
    // ✨ ZUSÄTZLICHE Verifikation
    setTimeout(() => {
      const verified = localStorage.getItem('audioChat_selectedVoice');
      console.log('✅ Stimme gespeichert und verifiziert:', verified);
    }, 100);
  };

  // ✨ ZUSÄTZLICHER useEffect für Stimmen-Sync
  useEffect(() => {
    const savedVoice = localStorage.getItem('audioChat_selectedVoice');
    if (savedVoice && savedVoice !== selectedVoice) {
      console.log('🔄 Synchronisiere Stimme:', savedVoice);
      setSelectedVoice(savedVoice);
      setIsFemaleVoice(savedVoice === VOICE_ALICE);
    }
  }, []);

  // ✨ DEBUG useEffect für Stimmen-Änderungen
  useEffect(() => {
    console.log('🎤 Aktuelle Stimme geändert:', {
      selectedVoice,
      isFemaleVoice,
      localStorage: localStorage.getItem('audioChat_selectedVoice')
    });
  }, [selectedVoice, isFemaleVoice]);

  // ✨ NEUE Funktion für Spiel-Klicks
  const handleGameClick = async (game: Game) => {
    try {
      // Versuche zum Spiel-Angebot zu navigieren
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/offers`);
      const offers = await response.json();
      
      const gameOffer = offers.find((offer: any) => 
        offer.game?.name?.toLowerCase() === game.name.toLowerCase()
      );
      
      if (gameOffer) {
        window.open(`/offer/${gameOffer._id}`, '_blank');
      } else {
        console.log('🎮 Kein Angebot für dieses Spiel gefunden');
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Offers:', error);
    }
  };

  return (
    <AudioChatContainer>
      <StatusIndicator className={showStatus ? 'visible' : ''}>{status}</StatusIndicator>

      <AudioControlsContainer>
        <VoiceToggleButton
          id="voice-toggle"
          isFemale={isFemaleVoice}
          onClick={toggleVoice}
          title={
            isFemaleVoice
              ? t('audioChat.voiceToggle.femaleTitle')
              : t('audioChat.voiceToggle.maleTitle')
          }
          className={isFemaleVoice ? 'female' : 'male'}
        >
          <div className="icon-container">
            {isFemaleVoice ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M12 13v8" />
                <path d="M8 18h8" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 144.52 144.56"
                fill="currentColor"
                style={{ width: '22px', height: '24px' }}
              >
                <path d="M84.27,118.75c-16.12,16.12-42.34,16.12-58.46,0s-16.12-42.34,0-58.46c8.07-8.05,18.65-12.09,29.23-12.09s21.18,4.04,29.23,12.09,12.11,18.19,12.11,29.23-4.3,21.42-12.11,29.23ZM82.14,0v13.73h38.99l-32.34,32.34c-21.58-16.78-52.86-15.3-72.69,4.52-21.46,21.46-21.46,56.41,0,77.87,10.74,10.74,24.83,16.1,38.93,16.1s28.21-5.36,38.93-16.1c10.4-10.4,16.12-24.23,16.12-38.93,0-12.39-4.12-24.13-11.6-33.75l32.32-32.32v38.99h13.73V0h-62.37Z" />
              </svg>
            )}
          </div>
        </VoiceToggleButton>

        <AudioButton
          id="audio-chat-button"
          className={isConversationActive ? 'recording' : ''}
          onClick={isConversationActive ? stopConversation : startConversation}
          disabled={isLoading}
          aria-label={isConversationActive ? t('audioChat.stopButton') : t('audioChat.startButton')}
        >
          {isConversationActive ? (
            <OrbitAnimation>
              <div className="slice"></div>
              <div className="slice"></div>
              <div className="slice"></div>
              <div className="slice"></div>
              <div className="slice"></div>
              <div className="slice"></div>
            </OrbitAnimation>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          )}
        </AudioButton>
      </AudioControlsContainer>

      {/* Spielempfehlungs-Popup */}
      <GamePopupOverlay 
        isVisible={showGamePopup} 
        onClick={() => setShowGamePopup(false)} 
      />
      
      <GamePopup isVisible={showGamePopup}>
        <GamePopupHeader>
          <GamePopupTitle>Spielempfehlungen</GamePopupTitle>
          <CloseButton onClick={() => setShowGamePopup(false)}>
            ×
          </CloseButton>
        </GamePopupHeader>
        
        <GameGrid>
          {gameRecommendations.map((game, index) => (
            <GameCard 
              key={game._id} 
              onClick={() => handleGameClick(game)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {game.background_image && (
                <GameImage 
                  src={game.background_image} 
                  alt={game.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/game-placeholder.jpg';
                  }}
                />
              )}
              <GameContent>
                <GameTitle>{game.name}</GameTitle>
                <GameInfo>
                  <GameRating>{game.rating.toFixed(1)}</GameRating>
                  {game.price !== undefined && (
                    <GamePrice>{game.price}€</GamePrice>
                  )}
                </GameInfo>
                {game.genres && game.genres.length > 0 && (
                  <GameGenres>
                    {game.genres.slice(0, 3).map((genre, idx) => (
                      <GenreTag key={idx}>{genre.name}</GenreTag>
                    ))}
                  </GameGenres>
                )}
              </GameContent>
            </GameCard>
          ))}
        </GameGrid>
      </GamePopup>

      <GlobalStyle />
    </AudioChatContainer>
  );
}
