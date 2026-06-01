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
import { DevToolsPage } from './pages/DevToolsPage';
import { ImageEditorPage } from './pages/ImageEditorPage';
import { TextEditorPage } from './pages/TextEditorPage';
import { JsonFormatterPage } from './pages/JsonFormatterPage';
import { MarkdownEditorPage } from './pages/MarkdownEditorPage';
import { SpreadsheetEditorPage } from './pages/SpreadsheetEditorPage';
import { OcrPage } from './pages/OcrPage';
import { ImageCompressorPage } from './pages/ImageCompressorPage';
import { FileAnalyzerPage } from './pages/FileAnalyzerPage';
import { VideoConverterPage } from './pages/VideoConverterPage';
import { UnitConverterPage } from './pages/UnitConverterPage';
import { UtilitiesPage } from './pages/UtilitiesPage';
import './i18n';

function App() {
  const { isPremium } = usePremiumStore();

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
        <div className="app-shell">
          <Header isPremium={isPremium()} />

          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/converter/image" element={<ImageConverter />} />
              <Route path="/converter/pdf" element={<PdfConverter />} />
              <Route path="/converter/csv" element={<SpreadsheetConverter />} />
              <Route path="/converter/audio" element={<AudioConverter />} />
              <Route path="/converter/video" element={<VideoConverterPage />} />
              <Route path="/editor/image" element={<ImageEditorPage />} />
              <Route path="/editor/text" element={<TextEditorPage />} />
              <Route path="/editor/json" element={<JsonFormatterPage />} />
              <Route path="/editor/markdown" element={<MarkdownEditorPage />} />
              <Route path="/editor/spreadsheet" element={<SpreadsheetEditorPage />} />
              <Route path="/tools/unit-converter" element={<UnitConverterPage />} />
              <Route path="/tools/utilities" element={<UtilitiesPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/tools/ocr" element={<OcrPage />} />
              <Route path="/tools/image-compressor" element={<ImageCompressorPage />} />
              <Route path="/tools/file-analyzer" element={<FileAnalyzerPage />} />
              <Route path="/devtools" element={<DevToolsPage />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
