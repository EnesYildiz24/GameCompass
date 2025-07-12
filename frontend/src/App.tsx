import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Spiele } from './components/Spiele';
import { Verkaufen } from './components/Verkaufen';
import { Login } from './components/Login';
import { Registrieren } from './components/Registrieren';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import VerifyPending from './components/VerifyPending';
import VerifyEmail from './components/VerifyEmail';
import AboutUs from './components/AboutUs';
import { ProfilePage } from './components/ProfilePage';
import { SpielDetail } from './components/SpielDetail';
import { Warenkorb } from './components/Warenkorb';
import CheckoutPage from './components/CheckoutPage';
import { OrderSuccess } from './components/OrderSuccess';
import { Footer } from './components/Footer';
import { ConnectReturn } from './components/ConnectReturn';
import { VerkaufenIntern } from './components/VerkaufenIntern';
import VerifyFailed from './components/VerifyFailed';
import { HelpTour } from './components/HelpTour';

function App() {
  const { } = useTranslation();
  return (
    <>
      <Header />
      {/* Navbar */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/games" element={<Spiele />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrieren" element={<Registrieren />} />
        <Route path="/verify-pending" element={<VerifyPending />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/offer/:offerId" element={<SpielDetail />} />
        <Route path="/game/:gameId"   element={<SpielDetail />} />
        <Route path="/cart" element={<Warenkorb />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/verify-failed" element={<VerifyFailed />} />

        {/* Sell routen */}
        <Route path="/connect/return" element={<ConnectReturn />} />
        <Route path="/sell" element={<Verkaufen />} />
        <Route path="/verkaufen" element={<Verkaufen />} />
        <Route path="/verkaufen-intern" element={<VerkaufenIntern />} />

        <Route path="/help-tour" element={<HelpTour />} />

        {/* <Route path="/wiki" element={<Wiki />} /> */}

      </Routes>

      <Footer />
    </>
  );
}

export default App;
