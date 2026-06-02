import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export function Privacy() {
  const { t } = useTranslation('privacy');

  const sections = t('sections', { returnObjects: true }) as Array<{
    heading: string;
    content: string;
  }>;

  return (
    <div className="page-container max-w-3xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-teal-100 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('lastUpdated')}</p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="card">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">{section.heading}</h2>
            <p className="text-slate-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 card bg-teal-50/80 border border-teal-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">¿Tienes preguntas?</h2>
        <p className="text-slate-600 mb-4">
          Si tienes alguna pregunta sobre esta política de privacidad, contáctanos:
        </p>
        <a
          href="mailto:privacy@converthub.com"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          privacy@converthub.com
        </a>
      </div>
    </div>
  );
}
