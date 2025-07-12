import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Figma: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🎯</span> <span className="gradient-text">Figma Design-Prototypen</span></h1>
      <p className="subtitle">GameCompass - Unsere Design-Reise von der ersten Idee zur finalen Umsetzung</p>
      
      <div className="section">
        <h2>🎨 Unser erstes Design-Konzept</h2>
        <div className="figma-showcase">
          <div className="figma-image-container">
            <img 
              src="/images/Figma.png" 
              alt="GameCompass Figma Design Prototyp" 
              className="figma-design-image"
            />
          </div>
          
          <div className="design-story">
            <h3>Die Geburt von GameCompass</h3>
            <p>
              Das ist unser allererstes Design-Konzept für GameCompass! 🚀 Hier siehst du die ursprüngliche Vision unserer Gaming-Plattform, 
              wie sie in Figma entstanden ist. Von der ersten Skizze bis zur ausgereiften Benutzeroberfläche – jedes Detail wurde durchdacht.
            </p>
            
            <div className="design-highlights">
              <h4>Was macht dieses Design besonders?</h4>
              <ul>
                <li><strong>🌟 Helle & Dunkle Ansichten:</strong> Schon früh haben wir beide Theme-Varianten geplant</li>
                <li><strong>🎮 Gaming-orientierte UI:</strong> Spielkarten-Layout für optimale Übersicht</li>
                <li><strong>🧭 Intuitive Navigation:</strong> Klare Strukturierung für beste User Experience</li>
                <li><strong>📱 Responsive Design:</strong> Von Anfang an für alle Bildschirmgrößen konzipiert</li>
              </ul>
            </div>

            <div className="evolution-note">
              <h4>Von Figma zur Realität</h4>
              <p>
                Dieses Design war der Grundstein für alles, was GameCompass heute ist. Viele Elemente aus diesem ersten Entwurf 
                haben es in die finale Version geschafft – natürlich verfeinert und optimiert durch unzählige Iterationen und User-Feedback.
              </p>
              <p>
                <em>Design ist ein Prozess, keine Einbahnstraße. Jede Linie, jede Farbe und jeder Button in diesem Prototyp 
                erzählt die Geschichte unserer Vision: Eine Plattform zu schaffen, die Gamer:innen wirklich lieben werden.</em>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔗 Live-Design anschauen</h2>
        <div className="figma-link-section">
          <div className="figma-cta">
            <h3>🚀 Erkunde unser Design selbst!</h3>
            <p>
              Möchtest du tiefer in unser Design eintauchen? Klick auf den Link unten und erkunde 
              unseren originalen Figma-Prototypen. Hier kannst du alle Screens, Komponenten und 
              Interaktionen in ihrer vollen Pracht erleben.
            </p>
            
            <div className="figma-link-container">
              <a 
                href="https://www.figma.com/design/tXuijEpnkB9DPhkU1XpWBh/Projekt-website?node-id=0-1&t=o96tCZbKUR1y5O1G-1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="figma-link-button"
              >
                <span className="figma-icon">🎨</span>
                Figma-Design öffnen
                <span className="external-icon">↗️</span>
              </a>
            </div>
            
            <div className="figma-tip">
              <p>💡 <strong>Tipp:</strong> Im Figma-File kannst du zwischen verschiedenen Ansichten wechseln, 
              Kommentare lesen und sogar den Prototype-Modus testen!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Design-Werkzeuge & Workflow</h2>
        <div className="tools-info">
          <div className="tool-item">
            <h4>🎯 Figma</h4>
            <p>Unser Haupttool für Prototyping, Wireframing und Kollaboration im Team</p>
          </div>
          <div className="tool-item">
            <h4>🎨 Design-System</h4>
            <p>Konsistente Komponenten-Bibliothek für einheitliches Design</p>
          </div>
          <div className="tool-item">
            <h4>👥 Team-Kollaboration</h4>
            <p>Real-time Feedback und Iterationen direkt im Design-Tool</p>
          </div>
        </div>
      </div>

      <style>{`
        .figma-showcase {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 1.5rem;
        }
        
        .figma-image-container {
          text-align: center;
          padding: 1rem;
          background: rgba(241, 145, 21, 0.05);
          border-radius: 12px;
          border: 2px solid rgba(241, 145, 21, 0.2);
        }
        
        .figma-design-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .figma-design-image:hover {
          transform: scale(1.02);
        }
        
        .design-story {
          padding: 1.5rem;
          background: rgba(92, 135, 145, 0.05);
          border-radius: 12px;
          border-left: 4px solid #5c8791;
        }
        
        .design-story h3 {
          color: #f19115;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        .design-story p {
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .design-highlights {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(241, 145, 21, 0.08);
          border-radius: 8px;
        }
        
        .design-highlights h4 {
          color: #f19115;
          margin-bottom: 0.8rem;
        }
        
        .design-highlights ul {
          margin: 0;
          padding-left: 1rem;
        }
        
        .design-highlights li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        
        .evolution-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(92, 135, 145, 0.08);
          border-radius: 8px;
          border: 1px solid rgba(92, 135, 145, 0.2);
        }
        
        .evolution-note h4 {
          color: #5c8791;
          margin-bottom: 0.8rem;
        }
        
        .evolution-note em {
          display: block;
          margin-top: 1rem;
          font-style: italic;
          opacity: 0.9;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          border-left: 3px solid #5c8791;
        }
        
                 .figma-link-section {
           text-align: center;
           margin-top: 1rem;
         }
         
         .figma-cta {
           padding: 2rem;
           background: linear-gradient(135deg, rgba(241, 145, 21, 0.1), rgba(92, 135, 145, 0.1));
           border-radius: 16px;
           border: 2px solid rgba(241, 145, 21, 0.3);
         }
         
         .figma-cta h3 {
           color: #f19115;
           margin-bottom: 1rem;
           font-size: 1.5rem;
         }
         
         .figma-link-container {
           margin: 2rem 0;
         }
         
         .figma-link-button {
           display: inline-flex;
           align-items: center;
           gap: 0.8rem;
           padding: 1rem 2rem;
           background: linear-gradient(135deg, #f19115, #e67e22);
           color: white;
           text-decoration: none;
           font-weight: bold;
           font-size: 1.1rem;
           border-radius: 12px;
           border: none;
           box-shadow: 0 4px 15px rgba(241, 145, 21, 0.4);
           transition: all 0.3s ease;
           cursor: pointer;
         }
         
         .figma-link-button:hover {
           transform: translateY(-2px);
           box-shadow: 0 6px 20px rgba(241, 145, 21, 0.6);
           color: white;
           text-decoration: none;
         }
         
         .figma-link-button:active {
           transform: translateY(0);
         }
         
         .figma-icon, .external-icon {
           font-size: 1.2rem;
         }
         
         .figma-tip {
           margin-top: 1.5rem;
           padding: 1rem;
           background: rgba(92, 135, 145, 0.1);
           border-radius: 8px;
           border-left: 4px solid #5c8791;
         }
         
         .figma-tip p {
           margin: 0;
           font-size: 0.95rem;
           line-height: 1.5;
         }
         
         .tools-info {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
           gap: 1rem;
           margin-top: 1rem;
         }
         
         .tool-item {
           padding: 1rem;
           background: rgba(241, 145, 21, 0.05);
           border-radius: 8px;
           border: 1px solid rgba(241, 145, 21, 0.2);
         }
         
         .tool-item h4 {
           color: #f19115;
           margin-bottom: 0.5rem;
         }
         
         .tool-item p {
           margin: 0;
           line-height: 1.5;
         }
        
                 @media (max-width: 768px) {
           .figma-showcase {
             gap: 1rem;
           }
           
           .design-story {
             padding: 1rem;
           }
           
           .design-highlights {
             padding: 0.8rem;
           }
           
           .figma-cta {
             padding: 1.5rem;
           }
           
           .figma-link-button {
             padding: 0.8rem 1.5rem;
             font-size: 1rem;
           }
           
           .tools-info {
             grid-template-columns: 1fr;
           }
         }
      `}</style>
    </div>
  );
}; 