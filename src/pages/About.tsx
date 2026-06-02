import { Users, Shield, Heart, Code, Globe } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Shield,
      title: 'Privacidad Primero',
      description: 'Tus archivos nunca salen de tu navegador. Todo el procesamiento es 100% local y privado.',
    },
    {
      icon: Heart,
      title: 'Gratis para Todos',
      description: 'Creemos que las herramientas básicas deben ser accesibles para todos, sin excepción.',
    },
    {
      icon: Code,
      title: 'Transparencia',
      description: 'Nuestro código es auditable y我们的 procesos son transparentes. No hay sorpresas.',
    },
    {
      icon: Globe,
      title: 'Accesibilidad Universal',
      description: 'Disponible en múltiples idiomas y dispositivos. Sin barreras de entrada.',
    },
  ];

  const stats = [
    { value: '52+', label: 'Herramientas disponibles' },
    { value: '100%', label: 'Procesamiento local' },
    { value: '0', label: 'Archivos subidos a servidores' },
    { value: '2', label: 'Idiomas soportados' },
  ];

  return (
    <div className="page-container max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-indigo-100 rounded-2xl mb-4">
          <Users className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Acerca de ConvertHub
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Construyendo herramientas web que respetan tu privacidad y son accesibles para todos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="card text-center">
            <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
            <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Misión</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          ConvertHub nació de la necesidad de tener herramientas de conversión y edición de archivos que
          respeten la privacidad del usuario. En un mundo donde cada vez más servicios suben nuestros datos
          a la nube, nosotros elegimos un camino diferente: procesar todo localmente en tu navegador.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Creemos que la tecnología debe ser una herramienta al servicio de las personas, no al revés.
          Por eso, todas nuestras herramientas son gratuitas, no requieren registro, y lo más importante:
          tus archivos nunca salen de tu dispositivo.
        </p>
      </div>

      {/* Story */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Historia</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          ConvertHub comenzó como un proyecto personal para resolver un problema común: necesitábamos
          convertir imágenes y documentos rápidamente, sin crear cuentas ni preocuparnos por quién
          veía nuestros archivos.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Descubrimos que con las tecnologías modernas de navegador (Canvas API, WebAssembly, File API)
          era posible crear herramientas tan potentes como las de escritorio, pero sin las desventajas
          de la privacidad.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Hoy, ConvertHub ofrece más de 52 herramientas para convertir, editar y procesar todo tipo de
          archivos: imágenes, PDF, audio, video, documentos de texto y más. Y seguimos creciendo.
        </p>
      </div>

      {/* Values */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Nuestros Valores</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {values.map((value, i) => (
            <div key={i} className="card flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
                <value.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Tecnología</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          ConvertHub está construido con tecnologías web modernas que nos permiten ofrecer
          un rendimiento comparable a las aplicaciones de escritorio:
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
          <li><strong>React + TypeScript:</strong> Para una interfaz de usuario rápida y confiable</li>
          <li><strong>Canvas API:</strong> Para procesamiento de imágenes directamente en el navegador</li>
          <li><strong>WebAssembly:</strong> Para operaciones pesadas como compresión de video</li>
          <li><strong>File API:</strong> Para acceso seguro a archivos locales</li>
          <li><strong>PWA:</strong> Para experiencia de aplicación nativa en cualquier dispositivo</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="card bg-indigo-50/80 border border-indigo-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">¿Quieres Saber Más?</h2>
        <p className="text-slate-600 mb-4">
          Si tienes preguntas sobre ConvertHub, sugerencias de herramientas o simplemente quieres saludar,
          no dudes en contactarnos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:hello@converthub.com"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Enviar email
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Formulario de contacto
          </a>
        </div>
      </div>
    </div>
  );
}