import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const MeetingProtokolle: React.FC = () => {
  const { theme } = useTheme();

  const meetings = [
    {
      date: '16.04.2025',
      points: [
        'MongoDB oder PostgreSQL?',
        'Alle die gleiche Version von Programmen (NodeJs, Express usw.)',
        'Bis Playtest USP fertig haben, unsere Idee soll erkennbar sein',
        'Einheitliche Code Formatter',
        'Tickets:',
        '1) Beschreibung sollte verständlich für jedes Mitglied sein, soll hinreichend beschrieben sein',
        '2) Akzeptanzkriterien, beispiel Login (Email soll funktionieren)',
        '3) Definition of done (Progress zu closed, z.B laufen alle Tests?)',
        'Scrum Guide lesen, darüber informieren',
        'Mittwoch 13:30 Uhr, Meetings mit Dozent, immer vorbereiten',
        'Als Team einmal pro Woche treffen, Termin finden',
        'Website in mehreren Sprachen anbieten, wenn wir die Idee implementieren dann früh wie möglich anfangen',
        'Datenbank anbinden, vlt. Registrierungsformular erstellen',
        'Alle Development Tools Software die man benötigt installieren'
      ]
    },
    {
      date: '23.04.2025',
      points: [
        'Registrierung und Login nächstes mal vorzeigen',
        'Salt und Pepper für gehashtest Passwort',
        'Für neue Tickets Beschreibungen einfügen',
        'MeetingProtokoll in das Wiki einfügen, rechts zu table of content',
        'Developer Dokumentation schreiben (alle Schritte müssen funktioneren)',
        'Pitch Meeting vorbereiten und PDF abgeben (nächste Woche), kein Team Meeting',
        'Idee: Shop Entität, Foreign Key zu User, Buyer/Seller trennen oder zusammen',
        'Seite weiter gestalten, Figma Ideen umsetzen',
        'Automatisierte Tests im Backend, Pipeline für Test Report',
        'LiveChat Recherche Ticket, passende LLM aussuchen'
      ]
    },
    {
      date: '07.05.2025',
      points: [
        'ChatBot: Verbessern und auf unsere Seite anpassen, System soll ein Kontext haben (Daten vom User speichern mit Datenbank), Nur Spielthemen sollen besprechbar sein und User soll direkt erkennbar sein',
        '"github.com/danielmiessler/fabric", fabric AI anschauen',
        'MongoDB migration (migrate-mongo) oder Datenbank komplett neu',
        'Zahlungsmethode "stripe.com" anschauen',
        'Developer Documentation immer erweitern',
        'mehrere LLM mit .env endpoints geben, eine genaue Schnittstelle definieren',
        'Integrations-Test schreiben (Selenium) für jede API, Businesslogik',
        'Bei einer Person sollte alles funktionieren beim vorzeigen im TeamMeeting',
        'Cors Probleme: Frontend -> Backend -> LLM',
        'Autorisierung der Email: OAuth, OpenID'
      ]
    },
    {
      date: '21.05.2025',
      points: [
        'Businesslogik Idee Research Task',
        'Wichtige Funktionen (Dateien) wie z.B Payment soll in Pipeline funktionieren, als nur die wichtigsten Dateien testen',
        'Spielseite Design verbessern und SpielDescription Seite erstellen',
        'Import Prozess verbessern, also mehr als 40 Spiele in Datenbank, Datenbank Dump',
        'Sequenzdiagramm für ChatBot, die Abläufe der Prozesse genauer erklären (sequencediagram.org)',
        'ChatBot User Awareness und optional: KI-Profil erstellen, der Bot soll den User kennen',
        'Prompt engineering, weniger hardcoden und mehr dynamisch arbeiten',
        'MongoDB Binary Data anschauen für Profilbild',
        'FAQ verbessern und anpassen (Fragebogen entfernen)',
        'In 2 Wochen ein paar fertige Resultate zeigen'
      ]
    },
    {
      date: '28.05.2025',
      points: [
        'unique id für jeden chat, jeder User soll eigenen Chat Kontext haben',
        'Verkauf Seite beenden',
        'User Update beenden',
        'Spielvorschläge optimierien:',
        'Genres der Datenbank extrahieren,',
        'eventuell auch description usw. in Spiel.find einbauen um Vorschläge zu verbessern(Regular expressions %wert%),',
        'Vector search anschauen',
        'Für **Playtest!!**:',
        'Testplan und Umfrage erstellen',
        '**Testplan:**',
        'Anleitung für Nutzer präzise beschreiben (ca. 5min),',
        'mehrere Testpläne z.b Registrierung und Login Verlauf als Durchgänge,',
        'Idee/Vision beschreiben',
        'Laptops vorbereiten',
        'Vlt. Testdurchlauf mit Freunden, Eltern usw.',
        'wichtigste Funktionen untersuchen',
        '**Umfrage:**',
        'soll nach dem Test aufgefüllt werden (5min)',
        'wichtige Aspekte unserer Website nachfragen',
        'User experience fragen',
        'multiple choice, Skala (Likert Skala), offene Antwort (QR Code für Umfrage)',
        'Umfrage auswerten'
      ]
    },
    {
      date: '04.06.2025',
      points: [
        'SpielDetail Seite weiter anpasssen',
        'Verkaufseite, Verkäufernotiz überarbeiten (Verkäufer soll dem Spiel weitere Informationen geben)',
        'KI Suche neu und gebraucht einfügen',
        'E-R Modell Doku',
        'User Spieler Info in Prompt speichern',
        'Mehrere Testfälle erstellen (Sehr viele Funktionen wie möglich dem Nutzer zeigen und auch komplexere), Testpläne sollen einfach verständlich sein',
        'Vlt mehrere Umfragen für mehrere Testfälle'
      ]
    },
    {
      date: '18.06.2025',
      points: [
        'Deployment anfangen',
        'Live-Demo: Überlegen ob Ollama auf Localhost läuft',
        'Nächste Woche Dokumentation vorstellen',
        'in 2 Wochen: Anforderung Abschlusspräsentation besprechen',
        'Test Report',
        'Language-Keys entfernen',
        'Zusatz: Ollamma config (LLm ändern), Abstraktion API für die KI, z.B mit OpenAi,Deepseek'
      ]
    },
    {
      date: '25.06.2025',
      points: [
        'Prompt Dokumentation, mehr über KI in Abschlusspräsentation reden',
        'Dokumentation als Project Report',
        '**Dokumentation:**',
        'Stackoverflow, KI Recherche, Youtube Links angeben',
        'Projektbeschreibung, Projektziel',
        'Wiki Home Seite, Struktur einbauen, alte Home Seite entfernen und in richtige einfügen',
        'Wie klone ich das Projekt, Vorraussetzungen, Tools, Testing, Branching (wie wir Branches nutzen erklären), Formatting Rules, PR Process, (GitFlow)',
        'README Inhalt in Wiki einfügen',
        'Benutzerdokumentation (Hilfsanleitung für Nutzer), offene Fragen (FAQ)',
        'Admin/User Dokumentation',
        'Architektur unserer Anwendung zeigen, Schnittstellen, ER Diagramm, Dependencies, Bibliotheken, Frameworks',
        'Swagger Dokumentation',
        'Testing (Playtest Infos) und Test Report, wie lass ich die Tests laufen',
        'MeetingProtokolle',
        'Figma Prototypen (Screenshots/Links)',
        'Tools, Organisation',
        'Learnings (was lie gut/schlecht), Besonderheiten?',
        'Wenn wir am Projekt weiterarbeiten was würden wir noch umsetzen',
        'Slides der Abschlusspräsentation'
      ]
    }
  ];

  return (
    <div className="service-detail-container">
      <h1><span>📋</span> <span className="gradient-text">Meeting-Protokolle</span></h1>
      <p className="subtitle">Dokumentation der Team-Meetings für das GameCompass-Projekt</p>
      
      <div className="section">
        {meetings.map((meeting, index) => (
          <div key={index} style={{ marginBottom: '40px' }}>
            <div
              style={{
                padding: '25px',
                backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: `3px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ 
                margin: '0 0 20px 0', 
                color: theme === 'dark' ? '#f19115' : '#5c8791',
                fontSize: '1.8rem',
                borderBottom: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
                paddingBottom: '10px'
              }}>
                Protokoll-Meeting/{meeting.date}
              </h2>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {meeting.points.map((point, pointIndex) => (
                  <li key={pointIndex} style={{
                    padding: '8px 0',
                    borderBottom: pointIndex < meeting.points.length - 1 
                      ? `1px solid ${theme === 'dark' ? 'rgba(158, 158, 158, 0.2)' : 'rgba(0, 0, 0, 0.1)'}` 
                      : 'none',
                    fontSize: '16px',
                    lineHeight: '1.5'
                  }}>
                    {point.includes('**') ? (
                      <span style={{ fontWeight: 'bold', color: theme === 'dark' ? '#f19115' : '#5c8791' }}>
                        {point.replace(/\*\*/g, '')}
                      </span>
                    ) : (
                      <span>{point.startsWith('- ') ? `• ${point.substring(2)}` : `• ${point}`}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="section">
        <div style={{
          padding: '20px',
          backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
          borderRadius: '12px',
          border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#f19115' : '#5c8791'
          }}>
            Protokolle vom 16.04.2025 bis 25.06.2025
          </p>
        </div>
      </div>
    </div>
  );
}; 