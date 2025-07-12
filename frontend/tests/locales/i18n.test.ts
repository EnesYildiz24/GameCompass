import i18n from '../../src/i18n';

describe('i18n Konfiguration', () => {
  beforeEach(() => {
    i18n.changeLanguage('de');
  });

  it('initialisiert mit Standardsprache Deutsch', () => {
    expect(i18n.language).toBe('de');
  });

  it('wechselt erfolgreich die Sprache', () => {
    i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
  });

  it('enthält alle erforderlichen Übersetzungen', () => {
    const requiredKeys = [
      'nav.login',
      'nav.register',
      'nav.games',
      'nav.sell',
      'nav.about',
      'login.title',
      'login.email',
      'login.password',
      'login.submit',
      'register.title',
      'register.username',
      'register.email',
      'register.password',
      'register.submit',
      'games.title',
      'games.loading',
      'games.error',
      'sell.title',
      'sell.form.title',
      'sell.form.description',
      'sell.form.price',
      'sell.form.genre',
      'sell.form.submit',
      'about.title',
      'about.mission',
      'about.team.title',
      'about.contact.title',
      'about.social.title',
    ];

    requiredKeys.forEach((key) => {
      expect(i18n.exists(key)).toBe(true);
    });
  });

  it('übersetzt korrekt in verschiedene Sprachen', () => {
    expect(i18n.t('login.title')).toBe('Anmelden');

    i18n.changeLanguage('en');
    expect(i18n.t('login.title')).toBe('Login');

    i18n.changeLanguage('es');
    expect(i18n.t('login.title')).toBe('Iniciar Sesión');
  });

  it('verwendet Fallback-Sprache bei fehlenden Übersetzungen', () => {
    i18n.changeLanguage('fr');
    expect(i18n.t('login.title')).toBe('Login'); // Fallback auf Englisch
  });
});
