import { BlogPost } from './BlogPost';
import { Link } from 'react-router-dom';

export function GuiaFormatosImagen2026() {
  return (
    <BlogPost
      title="Guía Completa de Formatos de Imagen 2026"
      description="PNG, JPG, WebP, AVIF: ¿cuál elegir? Conoce las diferencias y cuándo usar cada formato."
      date="15 de diciembre, 2025"
      readTime="8 min de lectura"
      tags={['Formatos', 'Imágenes', 'SEO']}
    >
      <h2>Introducción</h2>
      <p>
        Elegir el formato de imagen adecuado es crucial para obtener la mejor calidad y rendimiento
        en tu sitio web o proyecto. Cada formato tiene sus ventajas y desventajas, y conocerlas te
        ayudará a tomar mejores decisiones.
      </p>

      <h2>Formatos principales</h2>

      <h3>PNG (Portable Network Graphics)</h3>
      <p>
        PNG es un formato de compresión sin pérdida que se ha convertido en el estándar para
        imágenes en la web. Sus principales características son:
      </p>
      <ul>
        <li>
          <strong>Compresión sin pérdida:</strong> No pierde calidad al guardar
        </li>
        <li>
          <strong>Transparencia:</strong> Soporta canal alfa para transparencia completa
        </li>
        <li>
          <strong>Colores:</strong> Soporta hasta 16 millones de colores
        </li>
        <li>
          <strong>Uso ideal:</strong> Logos, iconos, gráficos con texto, imágenes con transparencia
        </li>
      </ul>
      <p>
        <strong>Desventaja:</strong> Los archivos pueden ser más pesados que otros formatos,
        especialmente para fotografías.
      </p>

      <h3>JPEG/JPG (Joint Photographic Experts Group)</h3>
      <p>
        JPEG es el formato más utilizado para fotografías y imágenes con gradientes de color.
        Utiliza compresión con pérdida, lo que significa que cada vez que guardas la imagen, pierde
        un poco de calidad.
      </p>
      <ul>
        <li>
          <strong>Compresión con pérdida:</strong> Archivos más pequeños pero con pérdida de calidad
        </li>
        <li>
          <strong>No soporta transparencia:</strong> Fondo blanco predeterminado
        </li>
        <li>
          <strong>Calidad ajustable:</strong> Puedes controlar el nivel de compresión
        </li>
        <li>
          <strong>Uso ideal:</strong> Fotografías, imágenes complejas, contenido para web
        </li>
      </ul>
      <p>
        <strong>Consejo:</strong> Usa calidad 95% o superior para minimizar la pérdida visible.
      </p>

      <h3>WebP</h3>
      <p>
        WebP es un formato desarrollado por Google que ofrece mejor compresión que PNG y JPEG
        manteniendo la calidad. Es el futuro de las imágenes web.
      </p>
      <ul>
        <li>
          <strong>Mejor compresión:</strong> Archivos 25-35% más pequeños que JPEG con la misma
          calidad
        </li>
        <li>
          <strong>Soporta transparencia:</strong> Como PNG pero con mejor compresión
        </li>
        <li>
          <strong>Compresión con y sin pérdida:</strong> Flexibilidad para diferentes usos
        </li>
        <li>
          <strong>Uso ideal:</strong> Sitios web, aplicaciones móviles, contenido digital
        </li>
      </ul>
      <p>
        <strong>Dato:</strong> WebP es soportado por todos los navegadores modernos desde 2020.
      </p>

      <h3>AVIF (AV1 Image File Format)</h3>
      <p>
        AVIF es el formato más moderno, basado en el códec de video AV1. Ofrece la mejor compresión
        disponible actualmente.
      </p>
      <ul>
        <li>
          <strong>Compresión superior:</strong> 50% más pequeño que JPEG con la misma calidad
        </li>
        <li>
          <strong>Soporta HDR:</strong> Mejor rango dinámico de colores
        </li>
        <li>
          <strong>Compresión sin pérdida:</strong> Calidad perfecta con archivos pequeños
        </li>
        <li>
          <strong>Uso ideal:</strong> Fotografía de alta calidad, sitios web modernos
        </li>
      </ul>
      <p>
        <strong>Nota:</strong> Aunque es el formato del futuro, la compatibilidad aún no es 100% en
        todos los dispositivos.
      </p>

      <h2>Tabla comparativa</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Formato</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Compresión</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Transparencia</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Tamaño</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Uso ideal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-3 px-4 font-medium">PNG</td>
              <td className="py-3 px-4">Sin pérdida</td>
              <td className="py-3 px-4">Sí</td>
              <td className="py-3 px-4">Grande</td>
              <td className="py-3 px-4">Logos, gráficos</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 px-4 font-medium">JPEG</td>
              <td className="py-3 px-4">Con pérdida</td>
              <td className="py-3 px-4">No</td>
              <td className="py-3 px-4">Mediano</td>
              <td className="py-3 px-4">Fotografías</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 px-4 font-medium">WebP</td>
              <td className="py-3 px-4">Ambas</td>
              <td className="py-3 px-4">Sí</td>
              <td className="py-3 px-4">Pequeño</td>
              <td className="py-3 px-4">Web general</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">AVIF</td>
              <td className="py-3 px-4">Ambas</td>
              <td className="py-3 px-4">Sí</td>
              <td className="py-3 px-4">Muy pequeño</td>
              <td className="py-3 px-4">Alta calidad</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>¿Cómo elegir el formato correcto?</h2>
      <p>La elección del formato depende de varios factores:</p>
      <ol>
        <li>
          <strong>Tipo de imagen:</strong> Fotografías → JPEG/WebP, Logos → PNG/WebP, Iconos →
          SVG/WebP
        </li>
        <li>
          <strong>Calidad necesaria:</strong> Si necesitas calidad perfecta, usa PNG o WebP sin
          pérdida
        </li>
        <li>
          <strong>Tamaño del archivo:</strong> Para web, prioriza WebP o AVIF para mejor rendimiento
        </li>
        <li>
          <strong>Compatibilidad:</strong> Si necesitas soporte universal, JPEG es la opción más
          segura
        </li>
      </ol>

      <h2>Convierte tus imágenes con ConvertHub</h2>
      <p>
        ConvertHub te permite convertir entre todos estos formatos directamente en tu navegador.
        Nuestro convertidor es completamente gratuito, no requiere registro y garantiza la
        privacidad de tus archivos.
      </p>
      <ul>
        <li>Conversión instantánea entre PNG, JPEG, WebP, AVIF y más</li>
        <li>Control de calidad ajustable</li>
        <li>Procesamiento por lotes para múltiples imágenes</li>
        <li>100% privado: tus archivos nunca salen de tu navegador</li>
      </ul>

      <div className="not-prose">
        <Link
          to="/converter/image"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Probar convertidor de imágenes
        </Link>
      </div>

      <h2>Conclusión</h2>
      <p>
        No existe un "mejor" formato universal. Cada uno tiene su propósito. Para la mayoría de
        casos en web, WebP ofrece el mejor equilibrio entre calidad y tamaño. Para fotografías donde
        la calidad es crítica, AVIF es la opción del futuro. Y para compatibilidad universal, JPEG
        sigue siendo una opción segura.
      </p>
      <p>
        Lo más importante es entender las características de cada formato y elegir el que mejor se
        adapte a tus necesidades específicas.
      </p>
    </BlogPost>
  );
}
