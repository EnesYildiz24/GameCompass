import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Uber } from '../../src/components/Uber';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Über uns', () => {
  it('rendert Hauptüberschrift und Beschreibung', () => {
    render(
      <BrowserRouter>
        <Uber />
      </BrowserRouter>
    );

    expect(screen.getByText('about.title')).toBeInTheDocument();
    expect(screen.getByText('about.mission')).toBeInTheDocument();
  });

  it('rendert Team-Mitglieder', () => {
    render(
      <BrowserRouter>
        <Uber />
      </BrowserRouter>
    );

    expect(screen.getByText('about.team.title')).toBeInTheDocument();
    expect(screen.getByText('about.team.developer')).toBeInTheDocument();
    expect(screen.getByText('about.team.designer')).toBeInTheDocument();
  });

  it('rendert Kontaktinformationen', () => {
    render(
      <BrowserRouter>
        <Uber />
      </BrowserRouter>
    );

    expect(screen.getByText('about.contact.title')).toBeInTheDocument();
    expect(screen.getByText('about.contact.email')).toBeInTheDocument();
    expect(screen.getByText('about.contact.phone')).toBeInTheDocument();
  });

  it('rendert Social Media Links', () => {
    render(
      <BrowserRouter>
        <Uber />
      </BrowserRouter>
    );

    expect(screen.getByText('about.social.title')).toBeInTheDocument();
    expect(screen.getByText('about.social.facebook')).toBeInTheDocument();
    expect(screen.getByText('about.social.twitter')).toBeInTheDocument();
    expect(screen.getByText('about.social.instagram')).toBeInTheDocument();
  });
}); 