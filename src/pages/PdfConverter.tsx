import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { PdfToolSelector } from '../components/pdf/PdfToolSelector';
import { PdfToolContent } from '../components/pdf/PdfToolContent';
import type { PdfTool } from '../types';

export function PdfConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<PdfTool>('merge');

  return (
    <PageLayout
      title={t('pdf.title')}
      description="Herramientas PDF online gratis: unir, dividir, comprimir y rotar documentos PDF. Procesamiento 100% local y seguro en tu navegador."
      subtitle={t('pdf.subtitle')}
      breadcrumb={[{ label: tc('nav.home'), to: '/' }, { label: tc('nav.converters.pdf') }]}
    >
      <div className="mb-8">
        <PdfToolSelector selectedTool={selectedTool} onSelect={setSelectedTool} />
      </div>

      <div className="content-panel">
        <PdfToolContent tool={selectedTool} />
      </div>

      {/* Contenido descriptivo para SEO */}
      <div className="mt-16 border-t border-slate-200 pt-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Herramientas PDF Online Gratis</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            ConvertHub ofrece un conjunto completo de herramientas para trabajar con archivos PDF
            directamente en tu navegador. Unir, dividir, comprimir, rotar y modificar tus documentos
            PDF sin necesidad de descargar software adicional.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
            Herramientas disponibles
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Unir PDF</h4>
                <p className="text-sm text-slate-600">
                  Combina múltiples archivos PDF en un solo documento
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Dividir PDF</h4>
                <p className="text-sm text-slate-600">
                  Separa un PDF en páginas individuales o rangos específicos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Comprimir PDF</h4>
                <p className="text-sm text-slate-600">
                  Reduce el tamaño de tus archivos PDF sin perder calidad
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Rotar PDF</h4>
                <p className="text-sm text-slate-600">
                  Gira páginas individuales o todo el documento
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
            ¿Por qué elegir nuestras herramientas PDF?
          </h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
            <li>
              <strong>100% privado:</strong> Tus documentos nunca salen de tu navegador. No se
              envían a servidores externos.
            </li>
            <li>
              <strong>Plan gratuito:</strong> 50 conversiones gratis al día. Upgrade a Premium para
              uso ilimitado.
            </li>
            <li>
              <strong>Rápido:</strong> Obtén resultados instantáneos sin esperas ni colas de
              procesamiento.
            </li>
            <li>
              <strong>Sin registro:</strong> No necesitas crear cuenta para usar las
              herramientas básicas.
            </li>
          </ul>

          <div className="bg-indigo-50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-slate-900 mb-2">Consejo de seguridad</h4>
            <p className="text-slate-600 text-sm">
              Como todas nuestras herramientas procesan archivos localmente en tu navegador, puedes
              trabajar con documentos confidenciales sin preocuparte por la privacidad. Tus archivos
              nunca salen de tu dispositivo.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
