import { Link } from 'react-router-dom';
import { Shield, Zap, Gift, ArrowRight, Image, FileText, Table, Music, Edit3, Type, Braces, Code, FileSpreadsheet, Film, Ruler, Wrench, Star, Users, FileUp, Cpu, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';

export function Home() {

  const features = [
    { icon: Shield, title: 'Privacidad total', description: 'Tus archivos nunca salen de tu navegador. Todo se procesa localmente.' },
    { icon: Zap, title: 'Súper rápido', description: 'Conversiones instantáneas sin subir archivos a servidores.' },
    { icon: Gift, title: '100% Gratis', description: 'Sin límites, sin registro, sin anuncios. Todo gratuito.' },
  ];

  const stats = [
    { icon: Star, value: '35+', label: 'Herramientas' },
    { icon: FileUp, value: '100%', label: 'Client-side' },
    { icon: Users, value: 'Gratis', label: 'Sin registro' },
    { icon: Shield, value: 'Privado', label: 'Sin servidores' },
  ];

  const converters = [
    { icon: Image, title: 'Convertir Imágenes', description: 'PNG, JPG, WebP, GIF, BMP, SVG, ICO, AVIF, HEIC', path: '/converter/image', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { icon: FileText, title: 'Herramientas PDF', description: 'Unir, dividir, comprimir, rotar, marca de agua y más', path: '/converter/pdf', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
    { icon: Table, title: 'Convertir CSV/Excel', description: 'CSV a XLSX, XLSX a CSV, CSV a JSON y viceversa', path: '/converter/csv', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { icon: Music, title: 'Convertir Audio', description: 'MP3, WAV, OGG, FLAC, AAC - todos los formatos', path: '/converter/audio', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { icon: Film, title: 'Convertir Video', description: 'Convierte, comprime, recorta y extrae audio', path: '/converter/video', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  ];

  const editors = [
    { icon: Edit3, title: 'Editor de Imágenes', description: 'Redimensionar, rotar, voltear, filtros, brillo, contraste', path: '/editor/image', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50' },
    { icon: Type, title: 'Editor de Texto', description: 'Notepad avanzado con formato, búsqueda y estadísticas', path: '/editor/text', color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50' },
    { icon: Braces, title: 'JSON Formatter', description: 'Formatear, minificar, validar y extraer claves JSON', path: '/editor/json', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
    { icon: Code, title: 'Editor Markdown', description: 'Escribe Markdown con vista previa en tiempo real', path: '/editor/markdown', color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' },
    { icon: FileSpreadsheet, title: 'Editor CSV Online', description: 'Edita hojas de cálculo directamente en el navegador', path: '/editor/spreadsheet', color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  const tools = [
    { icon: Ruler, title: 'Convertidor de Unidades', description: 'Longitud, peso, temperatura, volumen, velocidad y más', path: '/tools/unit-converter', color: 'from-cyan-500 to-cyan-600' },
    { icon: Wrench, title: 'Utilidades', description: 'Generar contraseñas, UUID, Lorem Ipsum, códigos de barras', path: '/tools/utilities', color: 'from-amber-500 to-amber-600' },
    { icon: Cpu, title: 'DevTools', description: 'Base64, Hash, QR, SQL, Regex, JWT, Diff Checker', path: '/devtools', color: 'from-slate-500 to-slate-600' },
  ];

  const pdfTools = [
    { icon: '📄', title: 'Unir PDF', description: 'Combina múltiples PDFs' },
    { icon: '✂️', title: 'Dividir PDF', description: 'Separa PDFs en páginas' },
    { icon: '📦', title: 'Comprimir PDF', description: 'Reduce el tamaño' },
    { icon: '🔄', title: 'Rotar PDF', description: 'Rota páginas 90°-270°' },
    { icon: '💧', title: 'Marca de agua', description: 'Agrega texto personalizado' },
    { icon: '🔢', title: 'Números de página', description: 'Inserta números automáticos' },
    { icon: '🖼️', title: 'Imágenes a PDF', description: 'Convierte PNG/JPG a PDF' },
    { icon: '🔓', title: 'Desbloquear PDF', description: 'Remueve contraseñas' },
  ];

  const howItWorks = [
    { step: '1', title: 'Sube tu archivo', description: 'Arrastra o selecciona el archivo que quieras procesar.' },
    { step: '2', title: 'Elige la herramienta', description: 'Selecciona la conversión, edición o utilidad que necesites.' },
    { step: '3', title: 'Descarga el resultado', description: 'Obtén tu archivo procesado al instante. Sin esperas.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Más de 35 herramientas gratuitas</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Convierte, edita y procesa archivos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">sin servidores</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Todo en tu navegador. Privacidad total, sin registro, sin límites. 
              Herramientas profesionales completamente gratuitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/converter/image">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl text-base px-8 py-3">
                  Explorar herramientas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-3">
                  Donar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="h-8 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex p-2 bg-blue-100 rounded-lg text-blue-600 mb-2">
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="max-w-6xl mx-auto mt-12 px-4">
        <PrivacyBanner />
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tres pasos simples. Sin complicaciones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, i) => (
            <div key={i} className="relative text-center p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 shadow-lg shadow-blue-200">
                {item.step}
              </div>
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-300" />
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Converters Grid */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Convertidores
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convierte entre múltiples formatos de archivo al instante.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {converters.map((item, index) => (
            <Link key={index} to={item.path}
              className={`${item.bgColor} rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}>
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editors Grid */}
      <section className="bg-gray-50 mt-20 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Editores Online
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Edita imágenes, texto, JSON, Markdown y hojas de cálculo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {editors.map((item, index) => (
              <Link key={index} to={item.path}
                className="bg-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* More Tools + PDF Tools */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Más herramientas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Utilidades, dev tools y herramientas PDF profesionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {tools.map((item, index) => (
            <Link key={index} to={item.path}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 text-center">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Herramientas PDF</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pdfTools.map((tool, index) => (
              <Link key={index} to="/converter/pdf"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{tool.title}</p>
                  <p className="text-xs text-gray-400">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why ConvertHub */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué ConvertHub?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              La mejor alternativa gratuita a las herramientas de pago.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="inline-flex p-3 bg-blue-500/20 rounded-full mb-5">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto my-20 px-4 text-center">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-12 md:p-16 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Más de 35 herramientas gratuitas. Sin registro, sin límites, sin anuncios.
          </p>
          <Link to="/converter/image">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl text-base px-10 py-3">
              Comienza ahora gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
