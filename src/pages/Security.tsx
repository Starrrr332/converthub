import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from 'lucide-react';

export function Security() {
  const securityFeatures = [
    {
      icon: Server,
      title: 'Procesamiento Local',
      description: 'Todo se ejecuta en tu navegador. Ningún archivo se sube a servidores externos.',
    },
    {
      icon: Lock,
      title: 'Sin Almacenamiento',
      description: 'No guardamos tus archivos, datos de formulario ni información personal.',
    },
    {
      icon: Eye,
      title: 'Sin Tracking',
      description: 'No utilizamos cookies de rastreo ni vendemos datos a terceros.',
    },
    {
      icon: FileCheck,
      title: 'Código Abierto',
      description: 'Nuestro procesamiento es transparente y auditable en el navegador.',
    },
  ];

  const bestPractices = [
    'Todos los archivos se procesan localmente usando Web APIs del navegador',
    'No se utilizan servidores intermedios para ninguna conversión',
    'Los archivos temporales se eliminan automáticamente al cerrar la pestaña',
    'No se almacenan metadatos de archivos procesados',
    'Encriptación AES-256-GCM disponible para archivos sensibles',
    'Sin dependencias de servicios externos para procesamiento',
  ];

  return (
    <div className="page-container max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-teal-100 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Seguridad y Privacidad
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Tu privacidad es nuestra prioridad. Descubre cómo ConvertHub protege tus datos.
        </p>
      </div>

      {/* Security Features */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="card">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 shrink-0">
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Cómo Protegemos Tus Datos</h2>
        <div className="card">
          <div className="space-y-4">
            {bestPractices.map((practice, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-slate-700">{practice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Detalles Técnicos</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Tecnologías Utilizadas</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Web APIs nativas del navegador (File API, Canvas, WebAssembly)</li>
              <li>• JavaScript sandboxed (sin acceso al sistema de archivos)</li>
              <li>• Service Worker para funcionamiento offline</li>
              <li>• HTTPS obligatorio para todas las conexiones</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Lo que NO Hacemos</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• No subimos archivos a servidores</li>
              <li>• No vendemos datos personales</li>
              <li>• No utilizamos cookies de rastreo</li>
              <li>• No compartimos información con terceros</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="mb-12">
        <div className="card bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Reportar Vulnerabilidades</h3>
              <p className="text-sm text-amber-800 mb-3">
                Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.
              </p>
              <a
                href="mailto:security@converthub.com"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-900 hover:text-amber-700"
              >
                security@converthub.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div className="card bg-teal-50/80 border border-teal-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          ¿Tienes preguntas sobre seguridad?
        </h2>
        <p className="text-slate-600 mb-4">
          Si tienes alguna duda sobre cómo protegemos tus datos, no dudes en contactarnos.
        </p>
        <a
          href="mailto:privacy@converthub.com"
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          privacy@converthub.com
        </a>
      </div>
    </div>
  );
}
