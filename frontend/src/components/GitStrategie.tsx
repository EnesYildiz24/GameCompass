import React from 'react';
import '../styles/GitStrategie.css';

export const GitStrategie: React.FC = () => {
  return (
    <div className="git-strategie-container">
      <h1><span className="brain-emoji">🧠</span> <span className="gradient-text">Git-Strategie für GameCompass</span></h1>
      <p className="subtitle">Dieses Dokument beschreibt den Git-Workflow und die Branch-Strategie für das Projekt GameCompass.</p>

      <div className="section">
        <h2>🔧 Repositoriestruktur</h2>
        <ul>
          <li><code>main</code>: Hauptbranch, in den nur getestete und geprüfte Änderungen gemergt werden</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔁 Standard-Workflow (Arbeiten mit Branches)</h2>
        <ol>
          <li>
            <strong>Neuen Branch anlegen</strong> (aus <code>main</code>):
            <div className="code-block">
              <pre><code>{`git checkout main
git pull origin main
git checkout -b <dein-branch-name>`}</code></pre>
            </div>
          </li>
          
          <li>
            <strong>Code schreiben & committen:</strong>
            <div className="code-block">
              <pre><code>{`git add .
git commit -m "feat: xy umgesetzt"`}</code></pre>
            </div>
          </li>
          
          <li>
            <strong>Branch pushen:</strong>
            <div className="code-block">
              <pre><code>{`git push origin <dein-branch-name>`}</code></pre>
            </div>
          </li>
          
          <li><strong>Merge Request / Pull Request öffnen</strong> (GitHub / GitLab)</li>
          
          <li>
            <strong>Merge in <code>main</code>:</strong>
            <div className="code-block">
              <pre><code>{`git checkout main
git pull origin main
git merge <dein-branch-name>
git push origin main`}</code></pre>
            </div>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2>🔀 Mit anderen Branches zusammenarbeiten</h2>
        <ol>
          <li>
            <strong>Einen fremden Branch auschecken:</strong>
            <div className="code-block">
              <pre><code>{`git fetch
git checkout <kollege-branch>`}</code></pre>
            </div>
          </li>
          
          <li>
            <strong>Änderungen übernehmen (merge):</strong>
            <div className="code-block">
              <pre><code>{`git checkout <dein-branch>
git merge <kollege-branch>`}</code></pre>
            </div>
          </li>
          
          <li>
            <strong>Änderungen an gemeinsamen Branch zurückgeben:</strong>
            <div className="code-block">
              <pre><code>{`git push origin <dein-branch>`}</code></pre>
            </div>
          </li>
          
          <li>
            <strong>Optional: Merge von gemeinsamer Arbeit in <code>main</code>:</strong>
            <div className="code-block">
              <pre><code>{`git checkout main
git pull origin main
git merge <dein-branch>
git push origin main`}</code></pre>
            </div>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2>🚨 Konfliktbehandlung</h2>
        <div className="code-block">
          <pre><code>{`git pull origin main
# Konflikt? Dateien manuell bearbeiten
git add <datei>
git commit   # Commit mit Konfliktlösung
git push`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>✅ Commit-Konventionen</h2>
        <div className="commit-conventions">
          <div className="commit-item">
            <code>feat:</code> <span>neue Funktion</span>
          </div>
          <div className="commit-item">
            <code>fix:</code> <span>Bugfix</span>
          </div>
          <div className="commit-item">
            <code>refactor:</code> <span>Code-Umstrukturierung</span>
          </div>
          <div className="commit-item">
            <code>style:</code> <span>Formatierung (kein Code-Verhalten)</span>
          </div>
          <div className="commit-item">
            <code>docs:</code> <span>Dokumentation</span>
          </div>
          <div className="commit-item">
            <code>chore:</code> <span>Wartung, Build-Skripte etc.</span>
          </div>
          <div className="commit-item">
            <code>test:</code> <span>Tests hinzugefügt/geändert</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📌 Tipps</h2>
        <ul className="tips-list">
          <li>Häufig <code>git pull</code> aus <code>main</code> holen, um Konflikte früh zu vermeiden</li>
          <li>Branches regelmäßig pushen – auch als Backup</li>
          <li>Nur getestete Branches in <code>main</code> mergen</li>
          <li>Pull Requests vor jedem Merge verwenden (keine direkten Merges ohne Review)</li>
        </ul>
      </div>
    </div>
  );
}; 