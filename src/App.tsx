import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/ui/CommandPalette';
import { TabBar } from './components/ui/TabBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { ShortcutsModal } from './components/ui/ShortcutsModal';
import { SkipLinks } from './components/ui/Accessibility';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoTheme } from './hooks/useAutoTheme';
import { useSmartPreload } from './hooks/useSmartPreload';
import { toolRegistry } from './config/toolRegistry';
import { ErrorBoundary, usePageTracking } from './monitoring';
import './i18n';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Pricing = lazy(() => import('./pages/Pricing').then((m) => ({ default: m.Pricing })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));
const Security = lazy(() => import('./pages/Security').then((m) => ({ default: m.Security })));
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const FavoritesPage = lazy(() =>
  import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
);
const BlogIndex = lazy(() =>
  import('./pages/blog/BlogIndex').then((m) => ({ default: m.BlogIndex })),
);
const ConvertImagesBlog = lazy(() =>
  import('./pages/blog/ConvertImagesWithoutLosingQuality').then((m) => ({
    default: m.ConvertImagesWithoutLosingQuality,
  })),
);
const GuiaFormatosBlog = lazy(() =>
  import('./pages/blog/GuiaFormatosImagen2026').then((m) => ({
    default: m.GuiaFormatosImagen2026,
  })),
);
const HerramientasSegurasBlog = lazy(() =>
  import('./pages/blog/HerramientasOnlineSeguras').then((m) => ({
    default: m.HerramientasOnlineSeguras,
  })),
);

// Category pages
const ConvertersPage = lazy(() =>
  import('./pages/ConvertersPage').then((m) => ({ default: m.ConvertersPage })),
);
const EditorsPage = lazy(() =>
  import('./pages/EditorsPage').then((m) => ({ default: m.EditorsPage })),
);
const ToolsPage = lazy(() => import('./pages/ToolsPage').then((m) => ({ default: m.ToolsPage })));
const DevToolsPage = lazy(() =>
  import('./pages/DevToolsPage').then((m) => ({ default: m.DevToolsPage })),
);
const UtilitiesPage = lazy(() =>
  import('./pages/UtilitiesPage').then((m) => ({ default: m.UtilitiesPage })),
);
const MetricsDashboard = lazy(() =>
  import('./pages/MetricsDashboard').then((m) => ({ default: m.MetricsDashboard })),
);

function KeyboardShortcutsProvider({
  children,
  onOpenShortcuts,
}: {
  children: React.ReactNode;
  onOpenShortcuts?: () => void;
}) {
  useKeyboardShortcuts(onOpenShortcuts);
  return <>{children}</>;
}

function PageTracker() {
  usePageTracking();
  return null;
}

function App() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Init auto theme (system preference)
  useAutoTheme();

  // Init smart prefetching on hover
  useSmartPreload();

  // Global listener for '?' key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
          return;
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Router>
        <KeyboardShortcutsProvider onOpenShortcuts={() => setShortcutsOpen(true)}>
          <PageTracker />
          <div className="app-shell">
            <SkipLinks />
            <Header />
            <CommandPalette />
            <ToastContainer />
            <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
            <TabBar />

            <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<BlogIndex />} />
                  <Route
                    path="/blog/como-convertir-imagenes-sin-perder-calidad"
                    element={<ConvertImagesBlog />}
                  />
                  <Route path="/blog/guia-formatos-imagen-2026" element={<GuiaFormatosBlog />} />
                  <Route
                    path="/blog/herramientas-online-seguras"
                    element={<HerramientasSegurasBlog />}
                  />

                  {/* Category landing pages */}
                  <Route path="/converter" element={<ConvertersPage />} />
                  <Route path="/editor" element={<EditorsPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/devtools" element={<DevToolsPage />} />
                  <Route path="/utilities" element={<UtilitiesPage />} />

                  {/* Metrics Dashboard */}
                  <Route path="/metrics" element={<MetricsDashboard />} />

                  {toolRegistry.map((tool) => (
                    <Route key={tool.path} path={tool.path} element={<tool.component />} />
                  ))}
                </Routes>
              </ErrorBoundary>
            </main>

            <Footer />
          </div>
        </KeyboardShortcutsProvider>
      </Router>
    </Suspense>
  );
}

export default App;
