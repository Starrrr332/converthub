import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simular envío (en producción aquí iría la lógica real)
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Para consultas generales',
      value: 'hello@converthub.com',
      href: 'mailto:hello@converthub.com',
    },
    {
      icon: Mail,
      title: 'Privacidad',
      description: 'Consultas sobre datos personales',
      value: 'privacy@converthub.com',
      href: 'mailto:privacy@converthub.com',
    },
    {
      icon: Mail,
      title: 'Legal',
      description: 'Términos y condiciones',
      value: 'legal@converthub.com',
      href: 'mailto:legal@converthub.com',
    },
  ];

  return (
    <div className="page-container max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-indigo-100 rounded-2xl mb-4">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Contacto</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          ¿Tienes preguntas, sugerencias o problemas? Estamos aquí para ayudarte.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method, i) => (
          <a
            key={i}
            href={method.href}
            className="card text-center hover:shadow-lg transition-shadow"
          >
            <div className="inline-flex p-3 bg-indigo-100 rounded-xl mb-3">
              <method.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{method.title}</h3>
            <p className="text-sm text-slate-500 mb-2">{method.description}</p>
            <p className="text-indigo-600 font-medium">{method.value}</p>
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Envíanos un mensaje</h2>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-700 text-sm">
                Mensaje enviado correctamente. Te responderemos pronto.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-red-700 text-sm">
                Error al enviar el mensaje. Intenta de nuevo o contáctanos por email.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                Asunto
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              >
                <option value="">Selecciona un asunto</option>
                <option value="general">Consulta general</option>
                <option value="bug">Reportar un problema</option>
                <option value="feature">Sugerir una herramienta</option>
                <option value="privacy">Consulta de privacidad</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                placeholder="Cuéntanos en qué podemos ayudarte..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {status === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar mensaje
                </>
              )}
            </button>
          </form>
        </div>

        {/* Información adicional */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Tiempo de respuesta</h3>
            <p className="text-slate-600 text-sm">
              Nos esforzamos por responder todos los mensajes dentro de 48 horas durante días
              laborales. Para consultas urgentes, te recomendamos enviarnos un email directamente.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Idiomas</h3>
            <p className="text-slate-600 text-sm">
              Puedes escribirnos en español o inglés. Nuestro equipo responde en ambos idiomas.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">¿Qué incluir en tu mensaje?</h3>
            <ul className="text-slate-600 text-sm space-y-2">
              <li>• Describe tu problema o sugerencia con el mayor detalle posible</li>
              <li>• Incluye el navegador y dispositivo que estás usando</li>
              <li>• Si reportas un error, incluye los pasos para reproducirlo</li>
              <li>• Para sugerir herramientas, describe qué necesitas y cómo te ayudaría</li>
            </ul>
          </div>

          <div className="card bg-indigo-50/80 border border-indigo-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              ¿Necesitas ayuda con una herramienta?
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              Revisa nuestra sección de preguntas frecuentes para obtener respuestas rápidas.
            </p>
            <a href="/blog" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Ver guías y tutoriales →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
