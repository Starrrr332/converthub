import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/ui/CommandPalette';
import { TabBar } from './components/ui/TabBar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { toolRegistry } from './config/toolRegistry';
import './i18n';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));

function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">ConvertHub</p>
        </div>
      }
    >
      <Router>
        <KeyboardShortcutsProvider>
          <div className="app-shell">
            <Header />
            <CommandPalette />
            <TabBar />

            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/privacy" element={<Privacy />} />
                {toolRegistry.map(tool => (
                  <Route
                    key={tool.path}
                    path={tool.path}
                    element={<tool.component />}
                  />
                ))}
              </Routes>
            </main>

            <Footer />
          </div>
        </KeyboardShortcutsProvider>
      </Router>
    </Suspense>
  );
}

export default App;
