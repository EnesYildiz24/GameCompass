import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';
import { motion } from 'framer-motion'; // Für Animationen - npm install framer-motion
import imageCompression from 'browser-image-compression';
import { BestellungResource } from '../Resources';
import { getUserOrders } from '../backend/api';

interface OwnedGame {
  spielId: string;
  name: string;
  price: number;
  amount: number;
}
export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([]);

  // Lade Benutzerdaten beim Initialisieren
  useEffect(() => {
    // Hier würde normalerweise ein API-Aufruf stehen, um die Benutzerdaten zu laden
    if (user) {
      setUsername(user.username);
      setEmail('benutzer@example.com'); // Beispiel-E-Mail
      
      // Lade gespeichertes Profilbild aus dem localStorage
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
      getUserOrders()
      .then((orders: BestellungResource[]) => {
        // Nur Bestellungen, die bezahlt sind:
        const paid = orders.filter(o => o.status === 'bezahlt');
        // Flatten aller game-items
        const games = paid.flatMap(o =>
          o.product.map(p => ({
            spielId: p.spielId,
            name:    p.name,
            price:   p.price,
            amount:  p.amount,
          }))
        );
        setOwnedGames(games);
      })
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Setze einen Ladezustand
        setMessage({ text: 'Bild wird verarbeitet...', type: 'success' });
        
        // Komprimierungsoptionen
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/jpeg',
          initialQuality: 0.92
        };
        
        // Komprimiere das Bild mit hoher Qualität
        const compressedFile = await imageCompression(file, options);
        
        // Konvertiere zu Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const optimizedImage = reader.result as string;
          setProfileImage(optimizedImage);
          localStorage.setItem('profileImage', optimizedImage);
          
          // Aktualisiere den Benutzer im AuthContext mit dem neuen Profilbild
          if (user) {
            const updatedUser = { ...user, profileImage: optimizedImage };
            // Hier würde normalerweise ein API-Aufruf stehen, um das Profilbild zu aktualisieren
            // Für jetzt aktualisieren wir nur den lokalen Zustand
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Aktualisiere den Benutzer im AuthContext
            if (setUser) {
              setUser(updatedUser);
            }
          }
          
          setMessage({ text: 'Profilbild erfolgreich aktualisiert!', type: 'success' });
          
          // Nachricht nach 3 Sekunden ausblenden
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        };
        reader.readAsDataURL(compressedFile);
        
      } catch (error) {
        console.error('Fehler bei der Bildverarbeitung:', error);
        setMessage({ text: 'Fehler beim Verarbeiten des Bildes', type: 'error' });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validierung für Passwortänderung
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: 'Die Passwörter stimmen nicht überein', type: 'error' });
      return;
    }

    try {
      // Hier würde ein API-Aufruf stehen, um die Benutzerdaten zu aktualisieren
      // Für jetzt simulieren wir einen erfolgreichen API-Aufruf
      
      setTimeout(() => {
        setMessage({ text: 'Profil erfolgreich aktualisiert!', type: 'success' });
        setIsEditing(false);
        
        // Zurücksetzen der Passwortfelder nach erfolgreicher Aktualisierung
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1000);
      
    } catch (error) {
      setMessage({ text: 'Fehler beim Aktualisieren des Profils', type: 'error' });
    }
  };

  return (
    <motion.div 
      className="profile-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-content">
        <h1 className="profile-title">Mein Profil</h1>
        
        <div className="profile-layout">
          {/* Linke Seite - Profilbild */}
          <motion.div 
            className="profile-image-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="profile-image-container">
              {profileImage ? (
                <img src={profileImage} alt="Benutzeravatar" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="35" r="20" fill="#eceff1" />
                    <path d="M80,85 C80,65 65,55 50,55 C35,55 20,65 20,85" fill="#eceff1" />
                  </svg>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button className="upload-button" onClick={triggerFileInput}>
                Bild hochladen
              </button>
            </div>
          </motion.div>

          {/* Rechte Seite - Benutzerinformationen */}
          <motion.div 
            className="profile-info-section"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {message && (
              <motion.div 
                className={`message ${message.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.text}
              </motion.div>
            )}
            
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label htmlFor="username">Benutzername</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">E-Mail-Adresse</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="form-group">
                    <label htmlFor="currentPassword">Aktuelles Passwort</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="editable"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">Neues Passwort</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="editable"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Passwort bestätigen</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="editable"
                    />
                  </div>
                </motion.div>
              )}
              
              <div className="button-group">
                {isEditing ? (
                  <>
                    <button type="submit" className="save-button">
                      Änderungen speichern
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Profil bearbeiten
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Spielebibliothek-Bereich */}
        <motion.div 
          className="game-library-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="library-title">Meine Spielebibliothek</h2>
          {ownedGames.length === 0 ? (
            <div className="game-library-placeholder">
              <p>Du hast noch keine Spiele in deiner Bibliothek. Entdecke den Shop, um Spiele hinzuzufügen!</p>
            </div>
          ) : (
            <div className="game-library-list">
              {ownedGames.map(game => (
                <div key={game.spielId} className="game-card">
                  <h5>{game.name}</h5>
                  <p>{game.amount}× {(game.price).toFixed(2)} €</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ProfilePage; 