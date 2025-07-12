import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Design: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🎮</span> <span className="gradient-text">GameCompass – Design-Dokumentation</span></h1>
      <p className="subtitle">Datum: 10.04.2025 – 22.04.2025 | Schriftart: Verdana</p>
      
      <div className="section">
        <h2>✏️ Warum Verdana?</h2>
        <div className="verdana-info">
          <p>Wir haben uns für die Schriftart <strong>Verdana</strong> entschieden, weil sie serifenlos ist und speziell für die Bildschirmdarstellung entwickelt wurde. Das macht sie besonders gut lesbar – gerade bei Fließtexten im Web.</p>
          <p>Für mich ist wichtig, dass der Text leicht und angenehm zu erfassen ist – besonders auf digitalen Geräten. Verdana erfüllt das optimal, weil sie klare Buchstabenformen hat und auch bei kleinen Größen gut lesbar bleibt.</p>
        </div>
      </div>

      <div className="section">
        <h2>🌗 Light / Darkmode</h2>
        <div className="theme-info">
          <p>Unsere Website passt sich deinem Stil an – wähle zwischen hellem und dunklem Design.</p>
          <div className="theme-examples">
            <div className="theme-example light-example">
              <h4>Light Mode</h4>
              <p>Heller Hintergrund für optimale Lesbarkeit bei Tageslicht</p>
            </div>
            <div className="theme-example dark-example">
              <h4>Dark Mode</h4>
              <p>Dunkler Hintergrund für augenschonende Nutzung</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📎 Footer-Leiste</h2>
        <div className="footer-info">
          <ul>
            <li><strong>GameCompass-Logo</strong> – Dein Wegweiser in der Gaming-Welt</li>
            <li>Links zu: Datenschutz, AGB, Impressum und Support</li>
            <li>Social Media Icons (z. B. Facebook)</li>
            <li>Sprachauswahl – aktuell: Deutsch</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🎨 Farbpalette</h2>
        <div className="color-palette">
          <table>
            <thead>
              <tr>
                <th>Farbname</th>
                <th>Hex-Code</th>
                <th>Vorschau</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Weiß</td>
                <td><code>#ffffff</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#ffffff', border: '1px solid #ccc' }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>Blau-Grau</td>
                <td><code>#5c8791</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#5c8791' }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>Orange</td>
                <td><code>#f19115</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#f19115' }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>Hellgrau</td>
                <td><code>#9e9e9e</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#9e9e9e' }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>Dunkelgrau 1</td>
                <td><code>#25252c</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#25252c' }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>Dunkelgrau 2</td>
                <td><code>#34353b</code></td>
                <td>
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: '#34353b' }}
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .theme-examples {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .theme-example {
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        
        .light-example {
          background-color: #ffffff;
          color: #333333;
        }
        
        .dark-example {
          background-color: #25252c;
          color: #e0dfe5;
          border-color: #444;
        }
        
        .color-palette table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        
        .color-palette th,
        .color-palette td {
          padding: 0.8rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .color-palette th {
          font-weight: bold;
          background-color: rgba(241, 145, 21, 0.1);
        }
        
        .color-preview {
          width: 40px;
          height: 30px;
          border-radius: 4px;
          display: inline-block;
        }
        
        .footer-info ul {
          list-style-type: none;
          padding: 0;
        }
        
        .footer-info li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(241, 145, 21, 0.2);
        }
        
        .footer-info li:last-child {
          border-bottom: none;
        }
        
        .verdana-info p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .theme-examples {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}; 