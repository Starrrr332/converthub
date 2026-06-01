import { Link } from 'react-router-dom';
import { Shield, Zap, Gift, ArrowRight, Image, FileText, Table, Music, Edit3, Type, Braces, Code, FileSpreadsheet, Film, Ruler, Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';

export function Home() {
  
  const features = [
    {
      icon: Shield,
      title: 'Privacidad total',
      description: 'Tus archivos nunca salen de tu navegador. Todo se procesa localmente.'
    },
    {
      icon: Zap,
      title: 'Súper rápido',
      description: 'Conversiones instantáneas sin subir archivos a servidores.'
    },
    {
      icon: Gift,
      title: '100% Gratis',
      description: 'Sin límites, sin registro, sin anuncios. Todo gratuito.'
    }
  ];
  
  const converters = [
    {
      icon: Image,
      title: 'Convertir Imágenes',
      description: 'PNG, JPG, WebP, GIF, BMP, SVG, ICO, AVIF, HEIC',
      path: '/converter/image',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      title: 'Herramientas PDF',
      description: 'Unir, dividir, comprimir, rotar, marca de agua y más',
      path: '/converter/pdf',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Table,
      title: 'Convertir CSV/Excel',
      description: 'CSV a XLSX, XLSX a CSV, CSV a JSON y viceversa',
      path: '/converter/csv',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Music,
      title: 'Convertir Audio',
      description: 'MP3, WAV, OGG, FLAC, AAC - todos los formatos',
      path: '/converter/audio',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Film,
      title: 'Convertir Video',
      description: 'Convierte, comprime, recorta y extrae audio',
      path: '/converter/video',
      color: 'bg-orange-100 text-orange-600'
    },
  ];
  
  const editors = [
    {
      icon: Edit3,
      title: 'Editor de Imágenes',
      description: 'Redimensionar, rotar, voltear, filtros, brillo, contraste',
      path: '/editor/image',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Type,
      title: 'Editor de Texto',
      description: 'Notepad avanzado con formato, búsqueda y estadísticas',
      path: '/editor/text',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Braces,
      title: 'JSON Formatter',
      description: 'Formatear, minificar, validar y extraer claves JSON',
      path: '/editor/json',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Code,
      title: 'Editor Markdown',
      description: 'Escribe Markdown con vista previa en tiempo real',
      path: '/editor/markdown',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: FileSpreadsheet,
      title: 'Editor CSV Online',
      description: 'Edita hojas de cálculo directamente en el navegador',
      path: '/editor/spreadsheet',
      color: 'bg-emerald-100 text-emerald-600'
    }
  ];

  const tools = [
    {
      icon: Ruler,
      title: 'Convertidor de Unidades',
      description: 'Longitud, peso, temperatura, volumen, velocidad y más',
      path: '/tools/unit-converter',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      icon: Wrench,
      title: 'Utilidades',
      description: 'Generar contraseñas, UUID, Lorem Ipsum, QR, códigos de barras',
      path: '/tools/utilities',
      color: 'bg-amber-100 text-amber-600'
    },
  ];
  
  const pdfTools = [
    { icon: '📄', title: 'Unir PDF', description: 'Combina múltiples PDFs en uno solo' },
    { icon: '✂️', title: 'Dividir PDF', description: 'Separa PDFs en páginas individuales' },
    { icon: '📦', title: 'Comprimir PDF', description: 'Reduce el tamaño sin perder calidad' },
    { icon: '🔄', title: 'Rotar PDF', description: 'Rota páginas 90°, 180° o 270°' },
    { icon: '💧', title: 'Marca de agua', description: 'Agrega texto personalizado como marca' },
    { icon: '🔢', title: 'Números de página', description: 'Inserta números automáticos' },
    { icon: '🖼️', title: 'Imágenes a PDF', description: 'Convierte PNG/JPG a PDF' },
    { icon: '🔓', title: 'Desbloquear PDF', description: 'Remueve contraseñas de PDFs' },
  ];
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Convierte y edita archivos <span className="text-blue-600">gratis</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Herramientas online para convertir, editar y procesar archivos. 
          Todo en tu navegador, sin subir archivos. 100% privado.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/converter/image">
            <Button size="lg">
              Empezar ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              Donar
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Privacy Banner */}
      <section className="max-w-3xl mx-auto mt-12 px-4">
        <PrivacyBanner />
      </section>
      
      {/* Converters Grid */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Convertidores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {converters.map((converter, index) => (
            <Link key={index} to={converter.path}
              className="card text-center hover:shadow-xl transition-shadow group"
            >
              <div className={`inline-flex p-4 rounded-full mb-4 ${converter.color} group-hover:scale-110 transition-transform`}>
                <converter.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{converter.title}</h3>
              <p className="text-sm text-gray-600">{converter.description}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Editors Grid */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Editores Online
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor, index) => (
            <Link key={index} to={editor.path}
              className="card hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className={`inline-flex p-3 rounded-xl ${editor.color} group-hover:scale-110 transition-transform`}>
                  <editor.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{editor.title}</h3>
                  <p className="text-sm text-gray-600">{editor.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Herramientas Útiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Link key={index} to={tool.path}
              className="card hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className={`inline-flex p-3 rounded-xl ${tool.color} group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* PDF Tools Grid */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Herramientas PDF
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pdfTools.map((tool, index) => (
            <Link key={index} to="/converter/pdf"
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.title}</h3>
              <p className="text-xs text-gray-500">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          ¿Por qué ConvertHub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
