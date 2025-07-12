import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorFallback } from '../../src/components/ErrorFallback';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ErrorFallback', () => {
  it('rendert Fehlermeldung korrekt', () => {
    const error = new Error('Testfehler');
    render(
      <BrowserRouter>
        <ErrorFallback error={error} />
      </BrowserRouter>
    );

    expect(screen.getByText('error.title')).toBeInTheDocument();
    expect(screen.getByText('Testfehler')).toBeInTheDocument();
  });

  it('zeigt Zurück-Button an', () => {
    const error = new Error('Testfehler');
    render(
      <BrowserRouter>
        <ErrorFallback error={error} />
      </BrowserRouter>
    );

    expect(screen.getByText('error.back')).toBeInTheDocument();
  });

  it('navigiert zurück bei Klick auf Zurück-Button', () => {
    const error = new Error('Testfehler');
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <BrowserRouter>
        <ErrorFallback error={error} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('error.back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('zeigt zusätzliche Fehlerdetails an', () => {
    const error = new Error('Testfehler');
    error.stack = 'Fehlerstack';
    render(
      <BrowserRouter>
        <ErrorFallback error={error} />
      </BrowserRouter>
    );

    expect(screen.getByText('Fehlerstack')).toBeInTheDocument();
  });
}); 