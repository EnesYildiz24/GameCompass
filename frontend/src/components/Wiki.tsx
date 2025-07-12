import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { GitStrategie } from './GitStrategie';
import { DeploymentPlan } from './DeploymentPlan';
import { DeveloperDocumentation } from './DeveloperDocumentation';
import { EnvironmentVariables } from './EnvironmentVariables';
import { Backend } from './Backend';
import { Model } from './Model';
import { IntegrationsServices } from './IntegrationsServices';
import { Authentifizierung } from './Authentifizierung';
import { Facebook } from './Facebook';
import { Google } from './Google';
import { NodemailerComponent } from './NodemailerComponent';
import { Stripe } from './Stripe';
import { UserModel } from './UserModel';
import { BuyerModel } from './BuyerModel';
import { AdminModel } from './AdminModel';
import { GenreModel } from './GenreModel';
import { SpielModel } from './SpielModel';
import { OfferModel } from './OfferModel';
import { CartModel } from './CartModel';
import { BestellungModel } from './BestellungModel';
import { BewertungModel } from './BewertungModel';
import { ChatPromptModel } from './ChatPromptModel';
import { ChatHistoryModel } from './ChatHistoryModel';
import { Frontend } from './Frontend';
import { Design } from './Design';
import { Figma } from './Figma';
import { InteraktiveNutzerfuehrung } from './InteraktiveNutzerfuehrung';
import { KI } from './KI';
import { GameCompassVektorSystem } from './GameCompassVektorSystem';
import { SyncToChroma } from './SyncToChroma';
import { SetupPrompts } from './SetupPrompts';
import { ArchitekturChatSystem } from './ArchitekturChatSystem';
import { ArchitekturChatSystem2 } from './ArchitekturChatSystem2';
import { KiChatModelle } from './KiChatModelle';
import { ArchitectureModell } from './ArchitectureModell';
import { VerkaufsLogikKYC } from './VerkaufsLogikKYC';
import { GameCompassDatenmodell } from './GameCompassDatenmodell';
import { MeetingProtokolle } from './MeetingProtokolle';
import { UnterstützteProgramme } from './UnterstützteProgramme';
import { Playtest } from './Playtest';
import { RechercheQuellen } from './RechercheQuellen';
import { ProjectLearnings } from './ProjectLearnings';
import { Zukunftsplaene } from './Zukunftsplaene';
import '../styles/Wiki.css';
import '../styles/ModelDetail.css';

interface TeamMember {
  name: string;
  id: string;
  email: string;
}

const team: TeamMember[] = [
  { name: 'Enes Yildiz', id: '100600', email: 'Enyi5938@bht-berlin.de' },
  { name: 'Adem Bacha', id: '950721', email: 's93198@bht-berlin.de' },
  { name: 'Abdullah Mubasher', id: '928083', email: 's86485@bht-berlin.de' },
  { name: 'Ensar Arik', id: '934051', email: 's87723@bht-berlin.de' },
  { name: 'Kaan Albayrak', id: '944019', email: 's92916@bht-berlin.de' },
  { name: 'Rojdi Zorlu', id: '953387', email: 's93125@bht-berlin.de' },
];

export const Wiki: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [activeAllgemeinSection, setActiveAllgemeinSection] = useState('');
  const [activeBackendSection, setActiveBackendSection] = useState('');
  const [activeIntegrationsSection, setActiveIntegrationsSection] = useState('');
  const [activeAuthSection, setActiveAuthSection] = useState('');
  const [activeModelSection, setActiveModelSection] = useState('');
  const [activeFrontendSection, setActiveFrontendSection] = useState('');
  const [activeKISection, setActiveKISection] = useState('');
  const [activeArchitectureSection, setActiveArchitectureSection] = useState('');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div>
            <h1>Home</h1>
            
            <div className="project-section">
              <h2>Projektname</h2>
              <h1 className="project-title">GameCompass</h1>
              <div className="project-image-container">
                <img 
                  src="/images/GameCompass Dschungel.png" 
                  alt="GameCompass Dschungel" 
                  className="project-image"
                />
              </div>
            </div>

            <p>Willkommen in unserem Wiki! Hier findest du alle wichtigen Informationen über unser Projekt und Team.</p>
            
            <h2>Projektbeschreibung</h2>
            <p>Diese Plattform dient als Marktplatz zum Kaufen, Verkaufen von digitalen Spielen und Game-Keys. Ein transparentes Bewertungssystem und moderne Zahlungsmethoden stellen dabei Sicherheit und Einfachheit sicher. Zudem erleichtert eine interaktive Einsteigerhilfe neuen Nutzer:innen den Einstieg in die Welt der Videospiele.</p>

            <h2>Projektziel</h2>
            <p>Ziel von GameCompass ist es, eine benutzerfreundliche Webplattform zu entwickeln, die den digitalen Handel mit Spielen ermöglicht, Nutzer:innen durch einen integrierten KI-Chat unterstützt und neuen Spieler:innen mit einer interaktiven Hilfe den Einstieg in die Welt der Videospiele erleichtert.</p>
            
            <h2>Tech Stack</h2>
            <table className="tech-stack-table">
              <thead>
                <tr>
                  <th>Kategorie</th>
                  <th>Technologien</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Frontend</td>
                  <td>React, TypeScript, Vite, Axios, Bootstrap</td>
                </tr>
                <tr>
                  <td>Backend</td>
                  <td>Node.js, Express</td>
                </tr>
                <tr>
                  <td>Datenbank</td>
                  <td>MongoDB (lokal oder Container), ChromaDB für Vektorensuche</td>
                </tr>
                <tr>
                  <td>KI/LLM</td>
                  <td>Ollama für den integrierten Chat</td>
                </tr>
                <tr>
                  <td>Entwicklung</td>
                  <td>Git, Docker, ESLint, Prettier</td>
                </tr>
              </tbody>
            </table>
            
            <h2>📚 Wiki-Inhaltsverzeichnis</h2>
            <div className="wiki-index">
              <div className="index-section">
                <h3 onClick={() => { setActiveSection('allgemein'); setActiveAllgemeinSection(''); }} style={{ cursor: 'pointer', color: theme === 'dark' ? '#f19115' : '#5c8791' }}>
                  🔧 Allgemein
                </h3>
                <ul className="index-list">
                  <li onClick={() => { setActiveSection('allgemein'); setActiveAllgemeinSection('git-strategie'); }} style={{ cursor: 'pointer' }}>
                    ├─ Git Strategie
                  </li>
                  <li onClick={() => { setActiveSection('allgemein'); setActiveAllgemeinSection('deployment'); }} style={{ cursor: 'pointer' }}>
                    ├─ Deployment
                  </li>
                  <li onClick={() => { setActiveSection('allgemein'); setActiveAllgemeinSection('developer-documentation'); }} style={{ cursor: 'pointer' }}>
                    ├─ Developer Documentation
                  </li>
                  <li onClick={() => { setActiveSection('allgemein'); setActiveAllgemeinSection('env'); }} style={{ cursor: 'pointer' }}>
                    └─ Environment Variables
                  </li>
                </ul>
              </div>

              <div className="index-section">
                <h3 onClick={() => { setActiveSection('backend'); setActiveBackendSection(''); }} style={{ cursor: 'pointer', color: theme === 'dark' ? '#8bc34a' : '#4caf50' }}>
                  ⚙️ Backend
                </h3>
                <ul className="index-list">
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection(''); }} style={{ cursor: 'pointer' }}>
                    <strong>📊 Models</strong>
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('user-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ User Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('buyer-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Buyer Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('admin-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Admin Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('genre-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Genre Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('spiel-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Spiel Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('offer-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Offer Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('cart-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Cart Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('bestellung-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Bestellung Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('bewertung-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ Bewertung Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('chatprompt-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    ├─ ChatPrompt Model
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('model'); setActiveModelSection('chathistory-model'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    └─ ChatHistory Model
                  </li>
                  
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection(''); }} style={{ cursor: 'pointer', marginTop: '10px' }}>
                    <strong>🔗 Integrations & Services</strong>
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection('auth'); setActiveAuthSection(''); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    <strong>🔐 Authentifizierung (SSO)</strong>
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection('auth'); setActiveAuthSection('facebook'); }} style={{ cursor: 'pointer', marginLeft: '30px' }}>
                    ├─ Facebook
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection('auth'); setActiveAuthSection('google'); }} style={{ cursor: 'pointer', marginLeft: '30px' }}>
                    ├─ Google
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection('auth'); setActiveAuthSection('nodemailer'); }} style={{ cursor: 'pointer', marginLeft: '30px' }}>
                    └─ Nodemailer
                  </li>
                  <li onClick={() => { setActiveSection('backend'); setActiveBackendSection('integrations'); setActiveIntegrationsSection('stripe'); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>
                    └─ Stripe
                  </li>
                </ul>
              </div>

              <div className="index-section">
                <h3 onClick={() => { setActiveSection('frontend'); setActiveFrontendSection(''); }} style={{ cursor: 'pointer', color: theme === 'dark' ? '#61dafb' : '#1976d2' }}>
                  🎨 Frontend
                </h3>
                <ul className="index-list">
                  <li onClick={() => { setActiveSection('frontend'); setActiveFrontendSection('design'); }} style={{ cursor: 'pointer' }}>
                    ├─ Design
                  </li>
                  <li onClick={() => { setActiveSection('frontend'); setActiveFrontendSection('figma'); }} style={{ cursor: 'pointer' }}>
                    ├─ Figma
                  </li>
                  <li onClick={() => { setActiveSection('frontend'); setActiveFrontendSection('interaktive-nutzerfuehrung'); }} style={{ cursor: 'pointer' }}>
                    └─ Interaktive Nutzerführung
                  </li>
                </ul>
              </div>

              <div className="index-section">
                <h3 onClick={() => { setActiveSection('ki'); setActiveKISection(''); }} style={{ cursor: 'pointer', color: theme === 'dark' ? '#ff5722' : '#e91e63' }}>
                  🤖 KI
                </h3>
                <ul className="index-list">
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('gamecompass-vektor-system'); }} style={{ cursor: 'pointer' }}>
                    ├─ GameCompass Vektor-System
                  </li>
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('sync-to-chroma'); }} style={{ cursor: 'pointer' }}>
                    ├─ syncToChroma.ts
                  </li>
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('setup-prompts'); }} style={{ cursor: 'pointer' }}>
                    ├─ setupPrompts.ts
                  </li>
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('architektur-chat-system'); }} style={{ cursor: 'pointer' }}>
                    ├─ Architektur des Chat-Systems
                  </li>
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('architektur-chat-system-2'); }} style={{ cursor: 'pointer' }}>
                    ├─ Architektur des Chat-Systems 2
                  </li>
                  <li onClick={() => { setActiveSection('ki'); setActiveKISection('ki-chat-modelle'); }} style={{ cursor: 'pointer' }}>
                    └─ KI-Chat Modelle
                  </li>
                </ul>
              </div>

              <div className="index-section">
                <h3 onClick={() => { setActiveSection('architecture-modell'); setActiveArchitectureSection(''); }} style={{ cursor: 'pointer', color: theme === 'dark' ? '#9c27b0' : '#673ab7' }}>
                  🏗️ Architecture-Modell
                </h3>
                <ul className="index-list">
                  <li onClick={() => { setActiveSection('architecture-modell'); setActiveArchitectureSection('verkaufs-logik-kyc'); }} style={{ cursor: 'pointer' }}>
                    ├─ Verkaufs Logik mit KYC Integration
                  </li>
                  <li onClick={() => { setActiveSection('architecture-modell'); setActiveArchitectureSection('gamecompass-datenmodell'); }} style={{ cursor: 'pointer' }}>
                    └─ GameCompass – Datenmodell
                  </li>
                </ul>
              </div>

              <div className="index-section">
                <h3 style={{ color: theme === 'dark' ? '#ffc107' : '#ff9800' }}>📋 Dokumentation & Reports</h3>
                <ul className="index-list">
                  <li onClick={() => setActiveSection('meeting-protokolle')} style={{ cursor: 'pointer' }}>
                    ├─ Meeting-Protokolle
                  </li>
                  <li onClick={() => setActiveSection('unterstützte-programme')} style={{ cursor: 'pointer' }}>
                    ├─ Unterstützte Programme
                  </li>
                  <li onClick={() => setActiveSection('playtest')} style={{ cursor: 'pointer' }}>
                    ├─ Playtest
                  </li>
                  <li onClick={() => setActiveSection('recherche-quellen')} style={{ cursor: 'pointer' }}>
                    ├─ Recherche & Quellen
                  </li>
                  <li onClick={() => setActiveSection('project-learnings')} style={{ cursor: 'pointer' }}>
                    ├─ Project Learnings
                  </li>
                  <li onClick={() => setActiveSection('zukunftsplaene')} style={{ cursor: 'pointer' }}>
                    ├─ Zukunftspläne
                  </li>
                  <li onClick={() => setActiveSection('readme')} style={{ cursor: 'pointer' }}>
                    └─ README
                  </li>
                </ul>
              </div>
            </div>

            <h2>Teammitglieder</h2>
            <div className="hand">
              {team.map((member, idx) => (
                <div
                  className="card"
                  style={{
                    // @ts-ignore – CSS custom property
                    '--i': idx,
                  } as React.CSSProperties}
                  key={member.id}
                >
                  <div className="profile-icon">👤</div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-id">{member.id}</div>
                  <div className="member-email">{member.email}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'allgemein':
        // Wenn Git Strategie ausgewählt ist, zeige nur die GitStrategie Komponente
        if (activeAllgemeinSection === 'git-strategie') {
          return <GitStrategie />;
        }
        
        // Wenn Deployment ausgewählt ist, zeige nur die DeploymentPlan Komponente
        if (activeAllgemeinSection === 'deployment') {
          return <DeploymentPlan />;
        }
        
        // Wenn Developer Documentation ausgewählt ist, zeige nur die DeveloperDocumentation Komponente
        if (activeAllgemeinSection === 'developer-documentation') {
          return <DeveloperDocumentation />;
        }
        
        // Wenn env ausgewählt ist, zeige nur die EnvironmentVariables Komponente
        if (activeAllgemeinSection === 'env') {
          return <EnvironmentVariables />;
        }
        
        // Ansonsten zeige die Allgemein-Wiki-Übersicht
        return (
          <div>
            <h1>Allgemein – Wiki</h1>
            <div className="wiki-overview">
              <div className="overview-section">
                <h3>1. Git Strategie</h3>
                <ul className="overview-list">
                  <li>├─ Zweck & Leitfaden</li>
                  <li>├─ Branch‑Modell (Main, Dev, Feature, Hotfix)</li>
                  <li>├─ Commit‑Konventionen (Conventional Commits)</li>
                  <li>└─ Pull‑Request‑Checklist + Code‑Reviews</li>
                </ul>
              </div>

              <div className="overview-section">
                <h3>2. Developer Documentation</h3>
                <ul className="overview-list">
                  <li>├─ Architektur‑Übersicht</li>
                  <li>├─ API‑Dokumentation / OpenAPI Spec</li>
                  <li>├─ Code‑Style‑Guides (TS, React, CSS)</li>
                  <li>└─ How‑to‑Guides (Testing, Deployment, Debugging)</li>
                </ul>
              </div>

              <div className="overview-section">
                <h3>3. env (Einstellungen)</h3>
                <ul className="overview-list">
                  <li>├─ .env Beispiel – lokale Variablen</li>
                  <li>├─ Secrets Management (GitLab CI Variables)</li>
                  <li>├─ Konfig‑Profile (dev, staging, prod)</li>
                  <li>└─ Sicherheits‑Hinweise</li>
                </ul>
              </div>

              <div className="overview-section">
                <h3>4. Home</h3>
                <ul className="overview-list">
                  <li>├─ Projekt‑Überblick & Ziel</li>
                  <li>├─ Onboarding‑Schritte (Setup, Zugang)</li>
                  <li>├─ Team & Kontaktwege</li>
                  <li>└─ Roadmap / Offene Tasks</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'backend':
        // Backend Haupt-Übersicht
        if (activeBackendSection === '') {
          return <Backend onNavigate={(section) => setActiveBackendSection(section)} />;
        }
        
        // Model Section
        if (activeBackendSection === 'model') {
          // Model Haupt-Übersicht
          if (activeModelSection === '') {
            return <Model onNavigate={(page) => setActiveModelSection(page)} />;
          }
          
          // Spezifische Model-Seiten
          if (activeModelSection === 'user-model') {
            return <UserModel />;
          }
          if (activeModelSection === 'buyer-model') {
            return <BuyerModel />;
          }
          if (activeModelSection === 'admin-model') {
            return <AdminModel />;
          }
          if (activeModelSection === 'genre-model') {
            return <GenreModel />;
          }
          if (activeModelSection === 'spiel-model') {
            return <SpielModel />;
          }
          if (activeModelSection === 'offer-model') {
            return <OfferModel />;
          }
          if (activeModelSection === 'cart-model') {
            return <CartModel />;
          }
          if (activeModelSection === 'bestellung-model') {
            return <BestellungModel />;
          }
          if (activeModelSection === 'bewertung-model') {
            return <BewertungModel />;
          }
          if (activeModelSection === 'chatprompt-model') {
            return <ChatPromptModel />;
          }
          if (activeModelSection === 'chathistory-model') {
            return <ChatHistoryModel />;
          }
          
          return <Model onNavigate={(page) => setActiveModelSection(page)} />;
        }
        
        // Integrations & Services Section
        if (activeBackendSection === 'integrations') {
          // Integrations Haupt-Übersicht
          if (activeIntegrationsSection === '') {
            return <IntegrationsServices />;
          }
          
          // Authentifizierung Section
          if (activeIntegrationsSection === 'auth') {
            // Auth Haupt-Übersicht
            if (activeAuthSection === '') {
              return <Authentifizierung />;
            }
            
            // Spezifische Auth-Anbieter
            if (activeAuthSection === 'facebook') {
              return <Facebook />;
            }
            if (activeAuthSection === 'google') {
              return <Google />;
            }
            if (activeAuthSection === 'nodemailer') {
              return <NodemailerComponent />;
            }
          }
          
          // Stripe Section
          if (activeIntegrationsSection === 'stripe') {
            return <Stripe />;
          }
        }
        
        return <Backend />;
      case 'frontend':
        // Frontend Haupt-Übersicht
        if (activeFrontendSection === '') {
          return <Frontend onNavigate={(page) => setActiveFrontendSection(page)} />;
        }
        
        // Spezifische Frontend-Seiten
        if (activeFrontendSection === 'design') {
          return <Design />;
        }
        if (activeFrontendSection === 'figma') {
          return <Figma />;
        }
        if (activeFrontendSection === 'interaktive-nutzerfuehrung') {
          return <InteraktiveNutzerfuehrung />;
        }
        
        return <Frontend />;
      case 'ki':
        // KI Haupt-Übersicht
        if (activeKISection === '') {
          return <KI onNavigate={(page) => setActiveKISection(page)} />;
        }
        
        // Spezifische KI-Seiten
        if (activeKISection === 'gamecompass-vektor-system') {
          return <GameCompassVektorSystem />;
        }
        if (activeKISection === 'sync-to-chroma') {
          return <SyncToChroma />;
        }
        if (activeKISection === 'setup-prompts') {
          return <SetupPrompts />;
        }
        if (activeKISection === 'architektur-chat-system') {
          return <ArchitekturChatSystem />;
        }
        if (activeKISection === 'architektur-chat-system-2') {
          return <ArchitekturChatSystem2 />;
        }
        if (activeKISection === 'ki-chat-modelle') {
          return <KiChatModelle />;
        }
        
        return <KI onNavigate={(page) => setActiveKISection(page)} />;
      case 'meeting-protokolle':
        return <MeetingProtokolle />;
      case 'unterstützte-programme':
        return <UnterstützteProgramme />;
      case 'playtest':
        return <Playtest />;
      case 'recherche-quellen':
        return <RechercheQuellen />;
      case 'project-learnings':
        return <ProjectLearnings />;
      case 'zukunftsplaene':
        return <Zukunftsplaene />;
      case 'readme':
        return (
          <div className="service-detail-container">
            <h1><span>🎮</span> <span className="gradient-text">GameCompass</span></h1>
            <p className="subtitle">Moderne Webplattform zur Organisation, Bewertung und Vorstellung von Spielen</p>
            
            <div className="section">
              <h2>📁 Projektstruktur</h2>
              <div className="code-block">
                <pre><code>{`.
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + Express API
└── database/          # MongoDB-Anbindung (lokal oder Docker)`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🚀 Lokale Entwicklung starten</h2>
              <p>Öffne zwei Terminal-Tabs oder nutze <code>tmux</code>/<code>zellij</code>:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
                
                {/* Frontend */}
                <div style={{
                  padding: '20px',
                  backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
                  borderRadius: '12px',
                  border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: theme === 'dark' ? '#f19115' : '#5c8791',
                      color: theme === 'dark' ? '#2d2e35' : '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      minWidth: '50px'
                    }}>
                      🔹
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: theme === 'dark' ? '#f19115' : '#5c8791' }}>
                      Tab 1 – Frontend (Vite + HMR)
                    </h3>
                    <div className="code-block">
                      <pre><code>{`cd frontend
npm install
npm run dev        # http://localhost:5173`}</code></pre>
                    </div>
                  </div>
                </div>

                {/* Backend */}
                <div style={{
                  padding: '20px',
                  backgroundColor: theme === 'dark' ? 'rgba(139, 195, 74, 0.1)' : 'rgba(139, 195, 74, 0.1)',
                  borderRadius: '12px',
                  border: `2px solid #8bc34a`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#8bc34a',
                      color: '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      minWidth: '50px'
                    }}>
                      🔹
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#8bc34a' }}>
                      Tab 2 – Backend (API mit Express)
                    </h3>
                    <div className="code-block">
                      <pre><code>{`cd backend
npm install
npm start          # http://localhost:3000`}</code></pre>
                    </div>
                  </div>
                </div>

              </div>
              <p>Das Frontend konsumiert API-Requests automatisch von <code>VITE_API_BASE_URL</code>, siehe <code>.env.local</code>.</p>
            </div>

            <div className="section">
              <h2>🗄️ Erste Datenbank anlegen</h2>
              <div className="code-block">
                <pre><code>{`mongosh
> use GameCompass
> db.users.insertOne({ username: "test", email: "test@example.com" })
> show collections
> db.users.find().pretty()`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🐳 MongoDB mit Docker starten (optional)</h2>
              <div className="code-block">
                <pre><code>{`docker run -d --name gamecompass-mongo -p 27017:27017 mongo:latest`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🔧 .env-Dateien</h2>
              
              <h3>frontend/.env.local</h3>
              <div className="code-block">
                <pre><code>{`VITE_API_BASE_URL=http://localhost:3000`}</code></pre>
              </div>
              
              <h3>backend/.env</h3>
              <div className="code-block">
                <pre><code>{`PORT=3000
MONGO_URI=mongodb://localhost:27017/GameCompass`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🧪 Technologien</h2>
              <ul>
                <li><strong>Frontend</strong>: React, TypeScript, Vite, Axios, Bootstrap</li>
                <li><strong>Backend</strong>: Node.js, Express</li>
                <li><strong>Datenbank</strong>: MongoDB (lokal oder Container)</li>
                <li><strong>Entwicklung</strong>: Git, Docker, ESLint, Prettier</li>
              </ul>
            </div>

            <div className="section">
              <h2>🕹️ RAWG API Integration</h2>
              
              <h3>.env</h3>
              <div className="code-block">
                <pre><code>{`RAWG_API_KEY=dein_rawg_api_schluessel
RAWG_BASE_URL=https://api.rawg.io/api`}</code></pre>
              </div>
              
              <h3>API aufrufen</h3>
              <div className="code-block">
                <pre><code>{`curl -X POST http://localhost:3000/api/games/import-rawg

# oder 

curl -k -X POST https://localhost:3000/api/games/import-rawg

# oder

Invoke-RestMethod -Uri "https://localhost:3000/api/games/import-rawg" -Method Post`}</code></pre>
              </div>
              
              <p><strong>Wichtig:</strong> Die <code>.env</code> Datei muss korrekt geladen werden, damit der API-Schlüssel an den Server weitergegeben wird.</p>
            </div>

            <div className="section">
              <h2>⚡ Schnelle Installation</h2>
              <div className="code-block">
                <pre><code>{`# 1. Repository clonen
git clone <dein-repo>
cd GameCompass

# 2. Backend Dependencies
cd Backend
npm install

# 3. Chroma-Server starten (Docker)
docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest

# 4. In neuem Terminal: Spiele zu Chroma synchronisieren
cd Backend
npx ts-node scripts/syncToChroma.ts

# 5. Backend starten
npm run dev

# 6. Frontend starten (neues Terminal)
cd ../frontend
npm install
npm run dev`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🤖 KI-System Scripts</h2>
              
              <h3>syncToChroma.ts Script ausführen:</h3>
              <div className="code-block">
                <pre><code>{`cd Backend
npx ts-node scripts/syncToChroma.ts`}</code></pre>
              </div>
              
              <h3>Prompts erstellen:</h3>
              <div className="code-block">
                <pre><code>{`cd Backend
npx tsx scripts/setupPrompts.ts`}</code></pre>
              </div>
              
              <h3>Docker Status prüfen:</h3>
              <div className="code-block">
                <pre><code>{`cd Backend
docker ps | findstr chroma`}</code></pre>
              </div>
            </div>

            <div className="section">
              <h2>🧾 Datenquelle</h2>
              <p>Dieses Projekt nutzt die <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer">RAWG Video Games Database API</a> für die Anzeige von Spieledaten.</p>
              <p>Alle Spieledaten stammen von RAWG. Dieses Projekt ist nicht-kommerziell und dient ausschließlich zu Lernzwecken im Rahmen einer Universitätsveranstaltung.</p>
            </div>

            <div className="section">
              <h2>👥 Team</h2>
              <ul>
                <li><strong>Enes</strong> – Teamleader / FullStack Developer</li>
                <li><strong>Rojdi</strong> – Backend Developer</li>
                <li><strong>Abdullah</strong> – Frontend Developer (Funktionalität)</li>
                <li><strong>Adem</strong> – Frontend Developer (CSS & HTML)</li>
                <li><strong>Ensar</strong> – Frontend Developer / Designer</li>
                <li><strong>Kaan</strong> – Frontend Developer / Scrum Master</li>
              </ul>
            </div>

            <div className="section">
              <h2>📝 Lizenz</h2>
              <p>MIT – Feel free to fork, build and share.</p>
            </div>
          </div>
        );
      case 'architecture-modell':
        // Architecture-Modell Haupt-Übersicht
        if (activeArchitectureSection === '') {
          return <ArchitectureModell onNavigate={(page) => setActiveArchitectureSection(page)} />;
        }
        
        // Spezifische Architecture-Modell-Seiten
        if (activeArchitectureSection === 'verkaufs-logik-kyc') {
          return <VerkaufsLogikKYC />;
        }
        if (activeArchitectureSection === 'gamecompass-datenmodell') {
          return <GameCompassDatenmodell />;
        }

        
        return <ArchitectureModell onNavigate={(page) => setActiveArchitectureSection(page)} />;
      default:
        return <div><h1>Home</h1><p>Willkommen!</p></div>;
    }
  };

  return (
    <div className={`wiki-container ${theme}`}>
      <aside className="wiki-sidebar">
        <ul>
          <li 
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => setActiveSection('home')}
          >
            Home
          </li>
          <li 
            className={activeSection === 'allgemein' ? 'active' : ''}
            onClick={() => {
              setActiveSection('allgemein');
              setActiveAllgemeinSection(''); // Reset submenu selection
            }}
          >
            Allgemein
          </li>
          <li 
            className={activeSection === 'backend' ? 'active' : ''}
            onClick={() => {
              setActiveSection('backend');
              setActiveBackendSection(''); // Reset submenu selection
              setActiveIntegrationsSection('');
              setActiveAuthSection('');
              setActiveModelSection('');
            }}
          >
            Backend
          </li>
          {activeSection === 'allgemein' && (
            <ul className="submenu">
              <li 
                className={activeAllgemeinSection === 'git-strategie' ? 'active' : ''}
                onClick={() => setActiveAllgemeinSection('git-strategie')}
              >
                Git Strategie
              </li>
              <li 
                className={activeAllgemeinSection === 'deployment' ? 'active' : ''}
                onClick={() => setActiveAllgemeinSection('deployment')}
              >
                Deployment
              </li>
              <li 
                className={activeAllgemeinSection === 'developer-documentation' ? 'active' : ''}
                onClick={() => setActiveAllgemeinSection('developer-documentation')}
              >
                Developer Documentation
              </li>
              <li 
                className={activeAllgemeinSection === 'env' ? 'active' : ''}
                onClick={() => setActiveAllgemeinSection('env')}
              >
                env
              </li>
            </ul>
          )}
          {activeSection === 'backend' && (
            <ul className="submenu">
              <li 
                className={activeBackendSection === 'model' ? 'active' : ''}
                onClick={() => {
                  setActiveBackendSection('model');
                  setActiveIntegrationsSection('');
                  setActiveAuthSection('');
                  setActiveModelSection('');
                }}
              >
                Model
              </li>
              {activeBackendSection === 'model' && (
                <ul className="submenu-deep">
                  <li 
                    className={activeModelSection === 'user-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('user-model')}
                  >
                    User Model
                  </li>
                  <li 
                    className={activeModelSection === 'buyer-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('buyer-model')}
                  >
                    Buyer Model
                  </li>
                  <li 
                    className={activeModelSection === 'admin-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('admin-model')}
                  >
                    Admin Model
                  </li>
                  <li 
                    className={activeModelSection === 'genre-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('genre-model')}
                  >
                    Genre Model
                  </li>
                  <li 
                    className={activeModelSection === 'spiel-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('spiel-model')}
                  >
                    Spiel Model
                  </li>
                  <li 
                    className={activeModelSection === 'offer-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('offer-model')}
                  >
                    Offer Model
                  </li>
                  <li 
                    className={activeModelSection === 'cart-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('cart-model')}
                  >
                    Cart Model
                  </li>
                  <li 
                    className={activeModelSection === 'bestellung-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('bestellung-model')}
                  >
                    Bestellung Model
                  </li>
                  <li 
                    className={activeModelSection === 'bewertung-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('bewertung-model')}
                  >
                    Bewertung Model
                  </li>
                  <li 
                    className={activeModelSection === 'chatprompt-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('chatprompt-model')}
                  >
                    ChatPrompt Model
                  </li>
                  <li 
                    className={activeModelSection === 'chathistory-model' ? 'active' : ''}
                    onClick={() => setActiveModelSection('chathistory-model')}
                  >
                    ChatHistory Model
                  </li>
                </ul>
              )}
              <li 
                className={activeBackendSection === 'integrations' ? 'active' : ''}
                onClick={() => {
                  setActiveBackendSection('integrations');
                  setActiveIntegrationsSection('');
                  setActiveAuthSection('');
                }}
              >
                Integrations & Services
              </li>
              {activeBackendSection === 'integrations' && (
                <ul className="submenu-deep">
                  <li 
                    className={activeIntegrationsSection === 'auth' ? 'active' : ''}
                    onClick={() => {
                      setActiveIntegrationsSection('auth');
                      setActiveAuthSection('');
                    }}
                  >
                    Authentifizierung (SSO)
                  </li>
                  {activeIntegrationsSection === 'auth' && (
                    <ul className="submenu-deeper">
                      <li 
                        className={activeAuthSection === 'facebook' ? 'active' : ''}
                        onClick={() => setActiveAuthSection('facebook')}
                      >
                        Facebook
                      </li>
                      <li 
                        className={activeAuthSection === 'google' ? 'active' : ''}
                        onClick={() => setActiveAuthSection('google')}
                      >
                        Google
                      </li>
                      <li 
                        className={activeAuthSection === 'nodemailer' ? 'active' : ''}
                        onClick={() => setActiveAuthSection('nodemailer')}
                      >
                        Nodemailer
                      </li>
                    </ul>
                  )}
                  <li 
                    className={activeIntegrationsSection === 'stripe' ? 'active' : ''}
                    onClick={() => {
                      setActiveIntegrationsSection('stripe');
                      setActiveAuthSection('');
                    }}
                  >
                    Stripe
                  </li>
                </ul>
              )}
            </ul>
          )}
          <li 
            className={activeSection === 'frontend' ? 'active' : ''}
            onClick={() => {
              setActiveSection('frontend');
              setActiveFrontendSection(''); // Reset submenu selection
            }}
          >
            Frontend
          </li>
          {activeSection === 'frontend' && (
            <ul className="submenu">
              <li 
                className={activeFrontendSection === 'design' ? 'active' : ''}
                onClick={() => setActiveFrontendSection('design')}
              >
                Design
              </li>
              <li 
                className={activeFrontendSection === 'figma' ? 'active' : ''}
                onClick={() => setActiveFrontendSection('figma')}
              >
                Figma
              </li>
              <li 
                className={activeFrontendSection === 'interaktive-nutzerfuehrung' ? 'active' : ''}
                onClick={() => setActiveFrontendSection('interaktive-nutzerfuehrung')}
              >
                Interaktive Nutzerführung
              </li>
            </ul>
          )}
          <li 
            className={activeSection === 'ki' ? 'active' : ''}
            onClick={() => {
              setActiveSection('ki');
              setActiveKISection(''); // Reset submenu selection
            }}
          >
            KI
          </li>
          {activeSection === 'ki' && (
            <ul className="submenu">
              <li 
                className={activeKISection === 'gamecompass-vektor-system' ? 'active' : ''}
                onClick={() => setActiveKISection('gamecompass-vektor-system')}
              >
                GameCompass Vektor-System
              </li>
              <li 
                className={activeKISection === 'sync-to-chroma' ? 'active' : ''}
                onClick={() => setActiveKISection('sync-to-chroma')}
              >
                syncToChroma.ts
              </li>
              <li 
                className={activeKISection === 'setup-prompts' ? 'active' : ''}
                onClick={() => setActiveKISection('setup-prompts')}
              >
                setupPrompts.ts
              </li>
              <li 
                className={activeKISection === 'architektur-chat-system' ? 'active' : ''}
                onClick={() => setActiveKISection('architektur-chat-system')}
              >
                Architektur des Chat-Systems
              </li>
              <li 
                className={activeKISection === 'architektur-chat-system-2' ? 'active' : ''}
                onClick={() => setActiveKISection('architektur-chat-system-2')}
              >
                Architektur des Chat-Systems 2
              </li>
              <li 
                className={activeKISection === 'ki-chat-modelle' ? 'active' : ''}
                onClick={() => setActiveKISection('ki-chat-modelle')}
              >
                KI-Chat Modelle
              </li>
            </ul>
          )}
          <li 
            className={activeSection === 'architecture-modell' ? 'active' : ''}
            onClick={() => {
              setActiveSection('architecture-modell');
              setActiveArchitectureSection(''); // Reset submenu selection
            }}
          >
            Architecture-Modell
          </li>
          <li 
            className={activeSection === 'meeting-protokolle' ? 'active' : ''}
            onClick={() => {
              setActiveSection('meeting-protokolle');
            }}
          >
            Meeting-Protokolle
          </li>
          <li 
            className={activeSection === 'unterstützte-programme' ? 'active' : ''}
            onClick={() => {
              setActiveSection('unterstützte-programme');
            }}
          >
            Unterstützte Programme
          </li>
          <li 
            className={activeSection === 'playtest' ? 'active' : ''}
            onClick={() => {
              setActiveSection('playtest');
            }}
          >
            Playtest
          </li>
          <li 
            className={activeSection === 'recherche-quellen' ? 'active' : ''}
            onClick={() => setActiveSection('recherche-quellen')}
          >
            Recherche & Quellen
          </li>
          <li 
            className={activeSection === 'project-learnings' ? 'active' : ''}
            onClick={() => setActiveSection('project-learnings')}
          >
            Project Learnings
          </li>
          <li 
            className={activeSection === 'zukunftsplaene' ? 'active' : ''}
            onClick={() => setActiveSection('zukunftsplaene')}
          >
            Zukunftspläne
          </li>
          <li 
            className={activeSection === 'readme' ? 'active' : ''}
            onClick={() => {
              setActiveSection('readme');
            }}
          >
            README
          </li>
          {activeSection === 'architecture-modell' && (
            <ul className="submenu">
              <li 
                className={activeArchitectureSection === 'verkaufs-logik-kyc' ? 'active' : ''}
                onClick={() => setActiveArchitectureSection('verkaufs-logik-kyc')}
              >
                Verkaufs Logik mit KYC Integration
              </li>
              <li 
                className={activeArchitectureSection === 'gamecompass-datenmodell' ? 'active' : ''}
                onClick={() => setActiveArchitectureSection('gamecompass-datenmodell')}
              >
                GameCompass – Datenmodell
              </li>

            </ul>
          )}

          {/* Weitere Navigationspunkte können hier ergänzt werden */}
        </ul>
      </aside>

      <main className="wiki-content">
        {renderContent()}
      </main>
    </div>
  );
}; 