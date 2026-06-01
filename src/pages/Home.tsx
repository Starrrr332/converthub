import { Link } from 'react-router-dom';
import {
  ArrowRight, Image, FileText, Table, Music, Film,
  Edit3, Type, Braces, Code, FileSpreadsheet,
  Ruler, Wrench, Cpu, Shield, Zap, Sparkles,
  Upload, Sliders, Download, Heart
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';

export function Home() {

  const stats = [
    { value: '35+', label: 'Herramientas' },
    { value: '100%', label: 'En tu navegador' },
    { value: 'Gratis', label: 'Sin registro' },
    { value: 'Privado', label: 'Sin servidores' },
  ];

  const converters = [
    { icon: Image, title: 'Imágenes', description: 'PNG, JPG, WebP, GIF, SVG, ICO, AVIF, HEIC', path: '/converter/image', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FileText, title: 'PDF', description: 'Unir, dividir, comprimir, rotar, marca de agua', path: '/converter/pdf', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Table, title: 'CSV / Excel', description: 'CSV a XLSX, XLSX a CSV, CSV a JSON', path: '/converter/csv', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Music, title: 'Audio', description: 'MP3, WAV, OGG, FLAC, AAC', path: '/converter/audio', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Film, title: 'Video', description: 'Convertir, comprimir, recortar, extraer audio', path: '/converter/video', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const editors = [
    { icon: Edit3, title: 'Editor de Imágenes', description: 'Redimensionar, rotar, filtros, brillo, contraste', path: '/editor/image' },
    { icon: Type, title: 'Editor de Texto', description: 'Notepad con búsqueda, reemplazo y estadísticas', path: '/editor/text' },
    { icon: Braces, title: 'JSON Formatter', description: 'Formatear, minificar, validar y extraer claves', path: '/editor/json' },
    { icon: Code, title: 'Editor Markdown', description: 'Live preview, exportar a HTML', path: '/editor/markdown' },
    { icon: FileSpreadsheet, title: 'CSV Online', description: 'Editar hojas de cálculo directamente', path: '/editor/spreadsheet' },
  ];

  const tools = [
    { icon: Ruler, title: 'Convertidor de Unidades', description: 'Longitud, peso, temperatura, volumen', path: '/tools/unit-converter', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: Wrench, title: 'Utilidades', description: 'Contraseñas, UUID, Lorem Ipsum, códigos de barras', path: '/tools/utilities', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Cpu, title: 'DevTools', description: 'Base64, Hash, QR, SQL, Regex, JWT', path: '/devtools', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const pdfTools = [
    'Unir PDF', 'Dividir PDF', 'Comprimir PDF', 'Rotar PDF',
    'Marca de agua', 'Números de página', 'Imágenes a PDF', 'Desbloquear PDF',
  ];

  const howItWorks = [
    { icon: Upload, title: 'Sube tu archivo', description: 'Arrastra o selecciona el archivo que quieras procesar.' },
    { icon: Sliders, title: 'Elige la herramienta', description: 'Selecciona la conversión, edición o utilidad que necesites.' },
    { icon: Download, title: 'Descarga el resultado', description: 'Obtén tu archivo procesado al instante. Sin esperas.' },
  ];

  const features = [
    { icon: Shield, title: 'Privacidad total', description: 'Tus archivos nunca salen de tu navegador. Todo se procesa localmente.' },
    { icon: Zap, title: 'Rápido y eficiente', description: 'Conversiones instantáneas sin subir archivos a servidores.' },
    { icon: Sparkles, title: 'Completamente gratis', description: 'Sin límites, sin registro, sin anuncios. Todo gratuito.' },
  ];

  return (
    <div>
      {/* ───── Hero ───── */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-transparent pointer-events-none" />
        <div className="page-container relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Más de 35 herramientas gratuitas
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-tight">
              Convierte y edita archivos{' '}
              <span className="text-gradient">sin servidores</span>
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-lg mx-auto">
              Privacidad total, sin registro, sin límites. Todo en tu navegador.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/converter/image">
                <Button size="lg">
                  Explorar herramientas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4" />
                  Donar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="border-y border-border bg-surface">
        <div className="page-container py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Privacy Banner ───── */}
      <section className="page-container mt-8 sm:mt-10">
        <PrivacyBanner />
      </section>

      {/* ───── How It Works ───── */}
      <section className="page-container mt-16 sm:mt-20">
        <div className="text-center mb-10">
          <h2 className="section-heading">Cómo funciona</h2>
          <p className="section-subheading mx-auto">Tres pasos simples. Sin complicaciones.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {howItWorks.map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-brand-600" />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold text-text mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Converters ───── */}
      <section className="page-container mt-16 sm:mt-20">
        <div className="text-center mb-10">
          <h2 className="section-heading">Convertidores</h2>
          <p className="section-subheading mx-auto">Convierte entre múltiples formatos de archivo al instante.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {converters.map((item, i) => (
            <Link key={i} to={item.path}
              className="card-interactive text-center">
              <div className={`inline-flex p-3 rounded-xl ${item.bg} ${item.color} mb-3`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-text text-sm">{item.title}</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── Editors ───── */}
      <section className="bg-surface-secondary mt-16 sm:mt-20 py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-heading">Editores Online</h2>
            <p className="section-subheading mx-auto">Edita imágenes, texto, JSON, Markdown y hojas de cálculo.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {editors.map((item, i) => (
              <Link key={i} to={item.path}
                className="card-interactive flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text text-sm">{item.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── More Tools + PDF ───── */}
      <section className="page-container mt-16 sm:mt-20">
        <div className="text-center mb-10">
          <h2 className="section-heading">Más herramientas</h2>
          <p className="section-subheading mx-auto">Utilidades, dev tools y herramientas PDF profesionales.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {tools.map((item, i) => (
            <Link key={i} to={item.path}
              className="card-interactive text-center">
              <div className={`inline-flex p-3 rounded-xl ${item.bg} ${item.color} mb-3`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-text text-sm">{item.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="card">
          <h3 className="font-semibold text-text text-center mb-4">Herramientas PDF</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pdfTools.map((tool, i) => (
              <Link key={i} to="/converter/pdf"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-text-secondary hover:text-text">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                {tool}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Why ConvertHub ───── */}
      <section className="bg-text mt-16 sm:mt-20 py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">¿Por qué ConvertHub?</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto">La mejor alternativa gratuita a las herramientas de pago.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {features.map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="inline-flex p-2.5 rounded-xl bg-brand-500/20 mb-4">
                  <item.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="page-container my-16 sm:my-20 text-center">
        <div className="max-w-lg mx-auto p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">¿Listo para empezar?</h2>
          <p className="text-brand-100 text-sm sm:text-base mb-6">
            Más de 35 herramientas gratuitas. Sin registro, sin límites.
          </p>
          <Link to="/converter/image">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
              Comienza ahora gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
