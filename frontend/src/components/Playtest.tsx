import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Playtest: React.FC = () => {
  const { theme } = useTheme();

  const surveyData = [
    {
      question: "Hast du passende Spiele entdecken können?",
      results: [
        { answer: "Ja, mehrere", percentage: 82.4, color: '#4caf50' },
        { answer: "Ja, ein Spiel", percentage: 17.6, color: '#8bc34a' },
        { answer: "Nein, nichts relevantes", percentage: 0, color: '#f44336' }
      ]
    },
    {
      question: "Wie benutzerfreundlich fandest du die Navigation auf der Website?",
      results: [
        { answer: "Sehr benutzerfreundlich", percentage: 76.5, color: '#4caf50' },
        { answer: "Benutzerfreundlich", percentage: 23.5, color: '#8bc34a' },
        { answer: "Neutral", percentage: 0, color: '#ff9800' },
        { answer: "Nicht benutzerfreundlich", percentage: 0, color: '#f44336' },
        { answer: "Überhaupt nicht benutzerfreundlich", percentage: 0, color: '#d32f2f' }
      ]
    },
    {
      question: "Findest du das Design der Seite ansprechend und modern?",
      results: [
        { answer: "Stimme ich zu", percentage: 100, color: '#4caf50' },
        { answer: "Neutral", percentage: 0, color: '#ff9800' },
        { answer: "Stimme ich nicht zu", percentage: 0, color: '#f44336' }
      ]
    },
    {
      question: "Wie hilfreich war der KI-Chat für dich beim Finden eines Spiels?",
      results: [
        { answer: "Sehr hilfreich", percentage: 35.3, color: '#4caf50' },
        { answer: "Hilfreich", percentage: 64.7, color: '#8bc34a' },
        { answer: "Neutral", percentage: 0, color: '#ff9800' },
        { answer: "Wenig hilfreich", percentage: 0, color: '#f44336' },
        { answer: "Überhaupt nicht hilfreich", percentage: 0, color: '#d32f2f' }
      ]
    },
    {
      question: "Wie bewertest du die Qualität des Sprachchats mit der KI?",
      results: [
        { answer: "Sehr gut", percentage: 31.3, color: '#4caf50' },
        { answer: "Gut", percentage: 62.4, color: '#8bc34a' },
        { answer: "Mittel", percentage: 6.3, color: '#ff9800' },
        { answer: "Schlecht", percentage: 0, color: '#f44336' },
        { answer: "Sehr schlecht", percentage: 0, color: '#d32f2f' }
      ]
    },
    {
      question: "Wie findest du die Kauf-/Verkauf-Option auf der Website?",
      results: [
        { answer: "Sehr gut", percentage: 52.9, color: '#4caf50' },
        { answer: "Gut", percentage: 47.1, color: '#8bc34a' },
        { answer: "Mittel", percentage: 0, color: '#ff9800' },
        { answer: "Schlecht", percentage: 0, color: '#f44336' },
        { answer: "Sehr schlecht", percentage: 0, color: '#d32f2f' }
      ]
    },
    {
      question: "Wie zufrieden bist du insgesamt mit der Website?",
      results: [
        { answer: "Sehr zufrieden", percentage: 58.8, color: '#4caf50' },
        { answer: "Zufrieden", percentage: 41.2, color: '#8bc34a' },
        { answer: "Neutral", percentage: 0, color: '#ff9800' },
        { answer: "Unzufrieden", percentage: 0, color: '#f44336' },
        { answer: "Sehr unzufrieden", percentage: 0, color: '#d32f2f' }
      ]
    },
    {
      question: "Würdest du die Website privat verwenden, wenn sie live wäre?",
      results: [
        { answer: "Ja", percentage: 52.9, color: '#4caf50' },
        { answer: "Vielleicht", percentage: 47.1, color: '#ff9800' },
        { answer: "Nein", percentage: 0, color: '#f44336' }
      ]
    }
  ];

  const positiveFeedback = [
    "Das Design",
    "Das Design und Chatfunktion",
    "Design, Funktionen, vielfältige Optionen",
    "Die Homepage",
    "Fand alles sehr schön und alles hat funktioniert",
    "KI finde ich sehr gut, auch das Design ist entspannt",
    "Das einfache Design",
    "Die Design und KI",
    "Visuelle",
    "Das Design ist sehr schön, die Bilder sind clean und schön an das Thema Games angepasst. Es ähnelt im Design einem sehr simplistischen wie bei Apple.",
    "Das Design, die vielen Spiele und Sprachchat mit KI",
    "Sprachfunktion",
    "Ich fand's cool, dass man direkt Spiele finden konnte ohne groß suchen bzw. recherchieren zu müssen"
  ];

  const improvements = [
    "Der, wo spricht, ist zu lang",
    "Nichts, ihr seid die besten",
    "Optimierung von Sprachbefehlen",
    "Text-Rückgaben der KI könnten verbessert werden, z. B. nicht nur als \"plain text\"",
    "Vielleicht die Farbe der Navigation",
    "Der Sprachbot sollte in der Lage sein, direkt zu den Spielen zu navigieren"
  ];

  const technicalIssues = [
    "Nein",
    "Der Mann wurde zur Frauenstimme",
    "Ja, mit dem Chat. Obwohl der aus war, hat er die ganze Zeit reagiert",
    "Nein",
    "Nein, besser so 👍🏻",
    "Ja, mit Sprachbefehlen",
    "Die Sprache beim Chatbot hat sich geändert und er hat nicht ganz gefunden, was ich brauchte. Ich wollte ein Fußballspiel und er hat mir ein anderes Sportspiel vorgeschlagen.",
    "Nein",
    "Nein, was im Testlauf angegeben wurde, hat einwandfrei funktioniert.",
    "Keine",
    "Nein, nur KI einmal"
  ];

  const additionalComments = [
    "Den Standard-Spruch vom GPT kürzen",
    "Viel Erfolg weiterhin",
    "Im Vergleich zu anderen Seiten würde ich eure Seite aufgrund des Designs und der KI-Funktion bevorzugen.",
    "Ist richtig gut!!"
  ];

  return (
    <div className="service-detail-container">
      <h1><span>🕹️</span> <span className="gradient-text">Playtest: Ergebnisse & Erkenntnisse</span></h1>
      <p className="subtitle">Diese Seite fasst das Nutzerfeedback und die wichtigsten Erkenntnisse aus dem durchgeführten Playtest zusammen, auf dessen Basis gezielte Verbesserungen für GameCompass abgeleitet wurden.</p>
      
      <div className="section">
        <h2>📋 Übersicht</h2>
        <p>In dieser Wiki-Seite sind die Ergebnisse des Playtests dokumentiert. Die Daten stammen aus einer Google-Umfrage mit <strong>17 Teilnehmenden</strong>. Ziel war es, Feedback zu Spielmechanik, Benutzerfreundlichkeit und Spielspaß zu sammeln, um gezielte Verbesserungen abzuleiten.</p>
      </div>

      <div className="section">
        <h2>📊 Google Docs Umfrage</h2>
        
        {surveyData.map((survey, index) => (
          <div key={index} style={{ marginBottom: '40px' }}>
            <div
              style={{
                padding: '25px',
                backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: theme === 'dark' ? '#f19115' : '#5c8791',
                fontSize: '1.3rem',
                fontStyle: 'italic'
              }}>
                <strong>{survey.question}</strong>
              </h3>
              
              <div style={{ marginTop: '15px' }}>
                {survey.results.map((result, resultIndex) => (
                  <div key={resultIndex} style={{ marginBottom: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{result.answer}</span>
                      <span style={{ fontWeight: 'bold' }}>{result.percentage}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '20px',
                      backgroundColor: theme === 'dark' ? 'rgba(158, 158, 158, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${result.percentage}%`,
                        height: '100%',
                        backgroundColor: result.color,
                        borderRadius: '10px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>📣 Feedback</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div
            style={{
              padding: '25px',
              backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
              borderRadius: '12px',
              border: '2px solid #4caf50'
            }}
          >
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#4caf50',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>👍</span> Positives Feedback
            </h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {positiveFeedback.map((feedback, index) => (
                <li key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < positiveFeedback.length - 1 ? '1px solid rgba(76, 175, 80, 0.2)' : 'none',
                  fontSize: '15px',
                  lineHeight: '1.4'
                }}>
                  • {feedback}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: '25px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
              borderRadius: '12px',
              border: '2px solid #ff9800'
            }}
          >
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#ff9800',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>❗</span> Verbesserungsvorschläge / Kritik
            </h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {improvements.map((improvement, index) => (
                <li key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < improvements.length - 1 ? '1px solid rgba(255, 152, 0, 0.2)' : 'none',
                  fontSize: '15px',
                  lineHeight: '1.4'
                }}>
                  • {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🛠️ Technische Probleme während des Tests</h2>
        
        <div
          style={{
            padding: '25px',
            backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
            borderRadius: '12px',
            border: '2px solid #f44336'
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {technicalIssues.map((issue, index) => (
              <li key={index} style={{
                padding: '8px 0',
                borderBottom: index < technicalIssues.length - 1 ? '1px solid rgba(244, 67, 54, 0.2)' : 'none',
                fontSize: '15px',
                lineHeight: '1.4'
              }}>
                • {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>💬 Weitere Kommentare und Anmerkungen</h2>
        
        <div
          style={{
            padding: '25px',
            backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)',
            borderRadius: '12px',
            border: '2px solid #9c27b0'
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {additionalComments.map((comment, index) => (
              <li key={index} style={{
                padding: '8px 0',
                borderBottom: index < additionalComments.length - 1 ? '1px solid rgba(156, 39, 176, 0.2)' : 'none',
                fontSize: '15px',
                lineHeight: '1.4'
              }}>
                • {comment}
              </li>
            ))}
          </ul>
        </div>
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
            Playtest durchgeführt mit 17 Teilnehmenden - Google Docs Umfrage
          </p>
        </div>
      </div>
    </div>
  );
}; 