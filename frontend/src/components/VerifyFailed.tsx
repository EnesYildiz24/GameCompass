export default function VerifyFailed() {
    return (
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Bestätigung fehlgeschlagen</h2>
        <p>Der Link ist ungültig oder abgelaufen.</p>
        <a className="btn btn-primary" href="/">Zur Startseite</a>
      </main>
    );
  }
  