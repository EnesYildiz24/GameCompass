import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  theme: 'light' | 'dark';
}

export const Mermaid: React.FC<MermaidProps> = ({ chart, theme }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = null;
    }
  }, []);

  // Render function
  const renderDiagram = useCallback(async () => {
    if (!chart) return;

    try {
      setIsLoading(true);
      setHasError(false);
      setSvgContent('');

      // Moderne Mermaid-Konfiguration mit krassen Farben
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'base',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
        securityLevel: 'loose',
        themeVariables: {
          // Hauptfarben - Website Branding
          primaryColor: theme === 'dark' ? '#f19115' : '#f19115',
          primaryTextColor: theme === 'dark' ? '#e0dfe5' : '#2c3e50',
          primaryBorderColor: theme === 'dark' ? '#f19115' : '#f19115',
          
          // Sekundärfarben - Website Palette
          secondaryColor: theme === 'dark' ? '#8bc34a' : '#5c8791',
          tertiaryColor: theme === 'dark' ? '#5c8791' : '#8bc34a',
          
          // Linien & Verbindungen - Eleganter
          lineColor: theme === 'dark' ? '#8bc34a' : '#5c8791',
          edgeLabelBackground: theme === 'dark' ? '#2d2e35' : '#ffffff',
          
          // Hintergründe - Subtiler
          background: theme === 'dark' ? '#2d2e35' : '#ffffff',
          mainBkg: theme === 'dark' ? '#f19115' : '#f19115',
          secondBkg: theme === 'dark' ? '#8bc34a' : '#5c8791',
          tertiaryBkg: theme === 'dark' ? '#5c8791' : '#8bc34a',
          
          // Spezielle Knoten - Website Style
          nodeBkg: theme === 'dark' ? '#f19115' : '#f19115',
          nodeBorder: theme === 'dark' ? '#8bc34a' : '#5c8791',
          
          // Cluster/Gruppen - Passend zum Theme
          clusterBkg: theme === 'dark' ? 'rgba(241, 145, 21, 0.15)' : 'rgba(241, 145, 21, 0.1)',
          clusterBorder: theme === 'dark' ? '#8bc34a' : '#5c8791',
          
          // Text - Lesbar und schön
          textColor: theme === 'dark' ? '#e0dfe5' : '#2c3e50',
          fontFamily: '"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
        },
      });

      // Eindeutige ID für das Diagramm
      const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Diagramm rendern
      const { svg } = await mermaid.render(diagramId, chart);
      
      // SVG Content in State setzen (React-safe)
      setSvgContent(svg);
      setIsLoading(false);
      
      console.log('🚀 Modernes Mermaid-Diagramm erfolgreich gerendert!');
    } catch (error) {
      console.error('❌ Fehler beim Rendern des Mermaid-Diagramms:', error);
      setHasError(true);
      setIsLoading(false);
      setSvgContent('');
    }
  }, [chart, theme]);

  useEffect(() => {
    cleanup();
    
    // Delay für smoother UX
    renderTimeoutRef.current = setTimeout(() => {
      renderDiagram();
    }, 200);

    // Cleanup bei unmount
    return cleanup;
  }, [renderDiagram, cleanup]);

  return (
    <div className="mermaid-container-modern">
      <div className="mermaid-header">
        <div className="mermaid-title">
          <span className="mermaid-icon">🌐</span>
          <h3>Network Architecture</h3>
          <div className="mermaid-status">
            {isLoading && <span className="status-loading">●</span>}
            {!isLoading && !hasError && <span className="status-ready">●</span>}
            {hasError && <span className="status-error">●</span>}
          </div>
        </div>
      </div>
      
      <div 
        ref={mermaidRef} 
        className={`mermaid-diagram-modern ${theme} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
      >
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Rendering network topology...</p>
          </div>
        )}
        {hasError && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h4>Rendering Error</h4>
            <p>Failed to load network diagram</p>
          </div>
        )}
        {!isLoading && !hasError && svgContent && (
          <div 
            className="mermaid-svg-container"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))',
              transition: 'all 0.3s ease',
            }}
          />
        )}
      </div>
    </div>
  );
}; 