import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePremiumStore } from './store/premiumStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Converter as ImageConverter } from './pages/Converter';
import { PdfConverter } from './pages/PdfConverter';
import { SpreadsheetConverter } from './pages/SpreadsheetConverter';
import { AudioConverter } from './pages/AudioConverter';
import { Pricing } from './pages/Pricing';
import { Privacy } from './pages/Privacy';
import './i18n';

function App() {
  const { isPremium } = usePremiumStore();
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header isPremium={isPremium()} />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/converter/image" element={<ImageConverter />} />
              <Route path="/converter/pdf" element={<PdfConverter />} />
              <Route path="/converter/csv" element={<SpreadsheetConverter />} />
              <Route path="/converter/audio" element={<AudioConverter />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          
          <Footer isPremium={isPremium()} />
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
