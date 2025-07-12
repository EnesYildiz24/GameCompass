import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Login } from './Login';
import { Modal, Button } from 'react-bootstrap';
export function Uber() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleClose = () => setShowLoginModal(false);

  return (
    <div>
      <Container>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <Navbar.Brand>GameCompass</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link
              to="/games"
              style={{ textDecoration: 'none', color: 'rgba(255,255,255,.55)', padding: '8px' }}
            >
              Spiele
            </Link>
            <Link
              to="/sell"
              style={{ textDecoration: 'none', color: 'rgba(255,255,255,.55)', padding: '8px' }}
            >
              Verkaufen
            </Link>
            <Link
              to="/about"
              style={{ textDecoration: 'none', color: 'rgba(255,255,255,.55)', padding: '8px' }}
            >
              Über uns
            </Link>
          </Nav>
          <Nav className="ms-auto">
            <span
              style={{
                textDecoration: 'none',
                color: 'rgba(255,255,255,.55)',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={handleLoginClick}
            >
              Login
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <main style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
        <section className="hero-section py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 text-center">
                <h1 className="display-4 fw-bold mb-4">Willkommen auf der Über uns Seite!</h1>
                <p className="lead mb-4">Hier erfahren Sie mehr über uns...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Modal show={showLoginModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
