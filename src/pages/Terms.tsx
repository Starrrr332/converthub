import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="page-container max-w-3xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-indigo-100 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Términos de Servicio
        </h1>
        <p className="text-sm text-slate-500">Última actualización: 1 de enero de 2026</p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            1. Aceptación de los Términos
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Al acceder y utilizar ConvertHub ("el Servicio"), aceptas estar sujeto a estos Términos
            de Servicio. Si no estás de acuerdo con alguno de estos términos, no utilices el
            Servicio. Nos reservamos el derecho de modificar estos términos en cualquier momento, y
            el uso continuado del Servicio constituye la aceptación de cualquier cambio.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Descripción del Servicio</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            ConvertHub es una plataforma web que ofrece herramientas gratuitas para conversión,
            edición y procesamiento de archivos. Todas las herramientas funcionan directamente en el
            navegador del usuario utilizando tecnologías web modernas (JavaScript, Canvas API,
            WebAssembly).
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>El procesamiento de archivos se realiza 100% localmente en tu navegador</li>
            <li>No se suben archivos a servidores externos</li>
            <li>No se requiere registro para usar las herramientas básicas</li>
            <li>El servicio es gratuito y no tiene límites de uso</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Uso Aceptable</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Al utilizar ConvertHub, te comprometes a:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>No utilizar el servicio para fines ilegales o no autorizados</li>
            <li>No intentar interferir con el funcionamiento del servicio</li>
            <li>No realizar acciones que puedan sobrecargar o dañar la infraestructura</li>
            <li>Respetar los derechos de propiedad intelectual de terceros</li>
            <li>No utilizar el servicio para distribuir malware o contenido dañino</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Propiedad Intelectual</h2>
          <p className="text-slate-600 leading-relaxed">
            El contenido, diseño, código fuente y todos los elementos de ConvertHub están protegidos
            por las leyes de propiedad intelectual. Los usuarios pueden utilizar el servicio para
            procesar sus propios archivos, pero no pueden copiar, modificar o distribuir el código o
            diseño de la plataforma sin autorización expresa.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Contenido del Usuario</h2>
          <p className="text-slate-600 leading-relaxed">
            ConvertHub no almacena, procesa ni tiene acceso al contenido de los archivos que los
            usuarios cargan para su conversión o edición. Todo el procesamiento se realiza
            localmente en tu navegador. Los archivos nunca salen de tu dispositivo y no se envían a
            nuestros servidores.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            6. Limitación de Responsabilidad
          </h2>
          <p className="text-slate-600 leading-relaxed">
            ConvertHub se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que
            el servicio estará disponible de forma ininterrumpida o libre de errores. No somos
            responsables de la pérdida de datos que pueda resultar del uso del servicio. Se
            recomienda siempre mantener copias de seguridad de archivos importantes antes de
            procesarlos.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            7. Disponibilidad del Servicio
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Nos esforzamos por mantener el servicio disponible las 24 horas del día, los 7 días de
            la semana. Sin embargo, no garantizamos la disponibilidad continua y nos reservamos el
            derecho de realizar mantenimiento programado o no programado cuando sea necesario.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Enlaces a Terceros</h2>
          <p className="text-slate-600 leading-relaxed">
            ConvertHub puede contener enlaces a sitios web de terceros. Estos enlaces se
            proporcionan solo para tu conveniencia. No tenemos control sobre el contenido de estos
            sitios web y no somos responsables de su contenido o prácticas de privacidad.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Cambios en el Servicio</h2>
          <p className="text-slate-600 leading-relaxed">
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte del
            servicio en cualquier momento sin previo aviso. No seremos responsables ante ti o
            terceros por cualquier modificación, suspensión o discontinuación del servicio.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Ley Aplicable</h2>
          <p className="text-slate-600 leading-relaxed">
            Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa
            derivada de estos términos o del uso del servicio será resuelta en los tribunales
            competentes de Santiago, Chile.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">11. Contacto</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Si tienes alguna pregunta sobre estos Términos de Servicio, por favor contáctanos:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>Email: legal@converthub.com</li>
            <li>Asunto: "Consulta Términos de Servicio"</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 card bg-indigo-50/80 border border-indigo-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">¿Tienes preguntas?</h2>
        <p className="text-slate-600 mb-4">
          Si tienes alguna pregunta sobre estos Términos de Servicio, no dudes en contactarnos.
        </p>
        <a
          href="mailto:legal@converthub.com"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          legal@converthub.com
        </a>
      </div>
    </div>
  );
}
